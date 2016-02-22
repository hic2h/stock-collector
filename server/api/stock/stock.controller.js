/**
 * Main stock service endpoint
 * POST    /stock                     ->  @create: Create a new stock in the db
 * GET     /stock/mostOperated        ->  @mostOperatedStock
 * GET     /stock/mostActiveUser      ->  @mostActiveUser
 * GET     /stock/mostExpensiveStock  ->  @mostExpensiveStock
 * POST     /stock/meanAndMedian      ->  @meanAndMedian
 */
'use strict';

var _ = require('lodash');
var moment = require('moment');
var Stock = require('./stock.model');
var Account = require('./../account/account.model');

var stockOpen = function (hour) {
    if ((hour >= 10) && (hour <= 15)) return true;
    else return false
};

// generate random shares
exports.index = function (req, res) {
    return res.json({});

};

// Creates a new stock in the DB.
exports.create = function (req, res) {
    var stock = req.body;
    if (stock) {
        if (stock.time) stock.time = moment(stock.time, "YYYY-MM-DDTHH:mm:ssZ").toDate();
        Account.findOne({name: stock.account})
            .exec(function (err, account) {
                if (account) {
                    if (stockOpen(moment(stock.time).utcOffset("-05:00").hour())) {
                        account.total_operated = account.total_operated + (stock.buy - stock.sell);
                        account.save();
                    }
                } else {
                    var account = {name: stock.account};
                    if (stockOpen(moment(stock.time).utcOffset("-05:00").hour())) {
                        account.total_operated = stock.buy - stock.sell;
                    }
                    Account.create(account)
                }
            });
        Stock.create(stock, function (err, stock) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(201).json({
                success: true,
                stock: stock
            });
        });
    } else return res.status(400).json({
        success: false,
        err: 'Stock input is not defined!'
    });
};

// Get the most operated stock for each account
exports.mostOperatedStock = function (req, res) {
    Account.find({total_operated: {$gte: 100000}})
        .select("name total_operated")
        .exec(function (err, accounts) {
            console.log(accounts.length);
            if (!accounts || !accounts.length) {
                return res.status(200).json({
                    success: true,
                    stock: []
                });
            } else {
                var response = [];
                accounts.forEach(function (account, index) {
                    Stock.aggregate(
                        {$match: {account: account.name}},
                        {
                            $project: {
                                sell: 1,
                                buy: 1,
                                ticket: 1,
                                user: 1,
                                account: 1,
                                rate: 1,
                                time: 1,
                                operation_value: {$subtract: ['$sell', '$buy']}
                            }
                        },
                        {$sort: {operation_value: -1}},
                        {$limit: 1},

                        function (err, stock) {
                            response.push(stock);
                            console.log(stock)
                            if (index >= accounts.length - 1) {
                                return res.status(200).json({
                                    success: true,
                                    stock: response
                                });
                            }
                        }
                    );
                });

            }
        })

};

// Get the most active user in the last hour
exports.mostActiveUser = function (req, res) {
    Stock.aggregate([
        {$match: {time: {$gte: moment().subtract(1, 'hours').format(), $lt: moment().format()}}},
        {
            $group: {
                _id: '$user',
                count: {$sum: 1}
            }
        },
        {$sort: {count: -1}},
        {$limit: 1}
    ], function (err, results) {
        if (results && results.length) {
            var result = results.pop();
            return res.status(200).json({
                success: true,
                user: result._id,
                count: result.count
            });
        } else {
            return res.status(200).json({
                success: true
            });
        }
    });
};

// Get the most expensive stock for the last day.
exports.mostExpensiveStock = function (req, res) {
    Stock.distinct("market", function (error, results) {
        if (!results && !results.length) {
            return res.status(200).json({
                success: true,
                stock: []
            });
        } else {
            var most_expensive_stock = [];
            results.forEach(function (market, index) {
                Stock.findOne({market: market})
                    .sort("-rate")
                    .limit(1)
                    .exec(function (err, mes_market) {
                        most_expensive_stock.push(mes_market);
                        if (index >= results.length - 1) {
                            return res.status(200).json({
                                success: true,
                                stock: most_expensive_stock
                            });
                        }
                    });
            });
        }
    });
};

// Get the mean and the median value for a requested date range
exports.meanAndMedian = function (req, res) {
    var match = {};
    if (req.body.fromDate && req.body.toDate) {
        match = {
            time: {
                $gte: moment(req.body.fromDate, "YYYY-MM-DDTHH:mm:ssZ").toDate(),
                $lt: moment(req.body.toDate, "YYYY-MM-DDTHH:mm:ssZ").toDate()
            }
        };
    }
    Stock.aggregate([
            {$match: match},
            {
                $group: {
                    _id: 0,
                    rateAvg: {$avg: '$rate'}
                }
            }
        ], function (err, results) {
            if (results && results.length) {
                var result = results.pop();
                return res.status(200).json({
                    success: true,
                    mean: result.rateAvg
                });
            } else {
                return res.status(200).json({
                    success: true
                });
            }
        }
    );
};

function handleError(res, err) {
    console.log(err);
    return res.status(500).json({
        success: false,
        err: 'An unknown error has occurred. Please try again later!'
    });
}