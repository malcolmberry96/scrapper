//Dependencies 
const express = require("express");
const mongojs = require("mongojs");
//Require axios and cheerio. Makes the scrapping possible 
const axios = require("axios");
const cheerio = require("cheerio");

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

})



//Mongo DB connection to mongoose 
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

