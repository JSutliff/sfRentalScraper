// ================= Dependencies =====================
var express = require("express");

// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");




// ====================================================

// Initialize Express
var app = express();

request("https://sfbay.craigslist.org/search/sfc/apa?max_price=3500&availabilityMode=0&pets_dog=1&sale_date=all+dates", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("li.result-row").each(function(i, element) {
    // console.log(element);
    var title = $(element).find('a').text();
    console.log(title);
    // Save the text of the element in a "title" variable
    // var title = $(element).text();

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    // var link = $(element).children().attr("href");

    // Save these results in an object that we'll push into the results array we defined earlier
    // results.push({
    //   title: title,
    //   link: link
    // });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  // console.log(results);
});
