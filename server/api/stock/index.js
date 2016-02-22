'use strict';

var express = require('express');
var controller = require('./stock.controller');

var router = express.Router();

//router.get('/', controller.index);
router.post('/', controller.create);
router.get('/mostOperated', controller.mostOperatedStock);
router.get('/mostActiveUser', controller.mostActiveUser);
router.get('/mostExpensiveStock', controller.mostExpensiveStock);
router.post('/meanAndMedian', controller.meanAndMedian);

module.exports = router;