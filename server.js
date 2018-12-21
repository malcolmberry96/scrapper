//Dependencies 
const express = require("express");
const mongojs = require("mongojs");
//Require axios and cheerio. Makes the scrapping possible 
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

//Initialize express
const app = express();

//Database config 
const databaseUrl = "scrapehw";
const collections = ["scrapeData"];

//Database configuration 
const db = mongojs(databaseUrl, collections);
db.on("error", function(error){
    console.log("Database error:", error);
});

//Main route
app.get("/", function (req, res){
    res.send("Hello world");
});

//Retrieve data from the db 
app.get("/all", function(req, res){
    //Find all results from the collection in the DB 
    db.scrapedData.find({}, function(error, found){
        if (error) {
            console.log(error);
        }
        //if no error, send data as json
        else {
            res.json(found);
        }
    });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
    // Make a request via axios for the news section of `ycombinator`
    axios.get("https://news.ycombinator.com/").then(function(response) {
      // Load the html body from axios into cheerio
      var $ = cheerio.load(response.data);
      // For each element with a "title" class
      $(".title").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element
        var title = $(element).children("a").text();
        var link = $(element).children("a").attr("href");
        console.log(link);
        console.log(title);
  
        // If this found element had both a title and a link
        if (title && link) {
          // Insert the data in the scrapedData db
          db.scrapedData.insert({
            title: title,
            link: link
          },
          function(err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              // Otherwise, log the inserted data
              console.log(inserted);
            }
          });
        }
      });
    });
  
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
  });
  
  
  // Listen on port 3000
  app.listen(3000, function() {
    console.log("App running on port 3000!");
  });



//Mongo DB connection to mongoose 
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//Solution from stack overflow to get rid of the warning message
mongoose.connect("mongodb://localhost:27017/scrapehw", { useNewUrlParser: true });;

