'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var StockSchema = new Schema({
  ticket: String,
  market: String,
  user: String,
  account: String,
  sell: Number,
  rate: Number,
  time: Date,
  buy: Number
});

StockSchema.pre('save', function (next) {
  if(this.ticket) this.market = this.ticket.split(':')[0];
  next();
});

module.exports = mongoose.model('Stock', StockSchema);