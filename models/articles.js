var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticlesSchema = new Schema({
  title: {
    type: String,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
    unique: true
  },
  price: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  summary: {
    type: String,
    trim: true,
  },
  saved: {
    type: Boolean,
    default: false
  },
  note: {
    type: String,
    trim: true,
    default: 'Enter your notes here'
  }

});

module.exports = mongoose.model('ArticlesSchema', ArticlesSchema);