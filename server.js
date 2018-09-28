// ================= Dependencies =====================
var express = require("express");

// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var ArticleSchema = require("./models/articles");
var mongoose = require("mongoose");


// Initialize Express
var app = express();


//Serve up static assets from public
app.use(express.static("public"));
// ====================================================

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/sfRentalScrapper");


var PORT = 3000;

request("https://sfbay.craigslist.org/search/sfc/apa?max_price=3500&availabilityMode=0&pets_dog=1&sale_date=all+dates", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var resultsArr = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("li.result-row").each(function(i, element) {
    // console.log(element);
    var title = $(element).find('a.result-title').text();
    var link = $(element).find('a.result-title').attr('href');
    var price = $(element).find('span.result-price').text();
    price = `$${price.split('$')[1]}`;
    var location = $(element).find('span.result-hood').text();
    location = location.replace('(', '').replace(')', '');

    var rentalInfo = {
      title: title,
      link: link,
      price: price, 
      location: location
    };

    resultsArr.push(rentalInfo);

    ArticleSchema.remove({}, function(err, res) {
      if (err) {
        throw err;
      }
    });
    ArticleSchema.create(resultsArr, function(err, results) {
      if (err) {
        throw err;
      }
      res.json(results);
    });
  });
});












// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

