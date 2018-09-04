var mongoose = require('../config/db');

var schema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title:{
    type:String,
    required: true
  },
  description:{
    required: true,
    type: String
  },
  price:{
    type: Number,
    required: true
  }
});
var model = mongoose.model('product', schema);
module.exports = model;
