// ================= Dependencies =====================
var express = require("express");

// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var ArticleSchema = require("./models/articles");
var mongoose = require("mongoose");
const bodyParser = require('body-parser');

// Initialize Express
var app = express();

// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Serve up static assets from public
app.use(express.static("public"));
// ====================================================

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/sfRentalScrapper", { useNewUrlParser: true });


var PORT = process.env.PORT ||3000;

app.get('/scrape', function(req, res) {
  request("https://sfbay.craigslist.org/search/sfc/apa?max_price=3500&availabilityMode=0&pets_dog=1&sale_date=all+dates", function(error, response, html) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape
    var resultsArr = [];
  
    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $("li.result-row").each(function(i, element) {
      var title = $(element).find('a.result-title').text();
      var link = $(element).find('a.result-title').attr('href');
      var price = $(element).find('span.result-price').text();
      price = `$${price.split('$')[1]}`;
      var location = $(element).find('span.result-hood').text();
      location = location.replace('(', '').replace(')', '');
      var summary = $(element).find('span.housing').text().split('\n');
      var newSummary = summary.map(function(elem) {
        return elem.replace(/\W?|\D?\w?/g, '');
      }).filter(function(elem) {
        return elem.length > 0;
      });
      
      var rentalInfo = {
        title: title,
        link: link,
        price: price, 
        summary: newSummary,
        location: location
      };
      resultsArr.push(rentalInfo);
    });
    ArticleSchema.deleteMany({saved: false}, function(err, results) {

    //   if (err) {
    //     throw err;
    //   }
      ArticleSchema.create(resultsArr, function(err, results) {

        // if (err) {
        //   throw err;
        // }

        ArticleSchema.find({}, function(err, results) {
          res.send(results);
        })
        
      });
    });

    // res.send(resultsArr);
  });

});

app.post('/save', function(req, res) {
  console.log(req.body);
  ArticleSchema.findOneAndUpdate(
    {
      link: req.body.link
    },
    {
      $set: {saved: true}
    },
    {new: true}
  ).then(function(post) {
    console.log(post)
    res.json(post)
  })
})

app.post('/savenote', function(req, res) {
  console.log(req.body);
  ArticleSchema.findOneAndUpdate(
    {
      link: req.body.link
    },
    {
      $set: {note: req.body.note}
    },
    {new: true}
  ).then(function(post) {
    console.log(post)
    res.json(post)
  })
})

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

