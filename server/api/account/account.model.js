'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AccountSchema = new Schema({
  name: String,
  total_operated: {type: Number, default: 0}
});

module.exports = mongoose.model('Account', AccountSchema);