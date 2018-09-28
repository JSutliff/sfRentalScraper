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
  },
  price: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  }

});

module.exports = mongoose.model('ArticlesSchema', ArticlesSchema);