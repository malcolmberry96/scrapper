//Dependencies 
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

//scrapping tools 
const cheerio = require("cheerio");
const axios = require("axios");

//models 
const db = require("./models");

const PORT = 3000;

const app = express();


//Use morgan logger for logging requests 
app.use(logger("dev"));
//Parse request body as JSON 
app.use(express.urlencoded({ extended:true }));
app.use(express.json());
//Make public a static folder 
app.use(express.static("public"));

//Connect to the MONGO DB 
mongoose.connect("mongodb://localhost/scrapperhw", { useNewUrlParser: true });

//Routes 

//A GET route for scraping the Hypebeast website 
app.get("/scrape",function(req, res){
    //Grab the body of the html with axios 
    axios.get("http://www.echojs.com/").then(function(response){
        //we load into a shorthand selector 
        const $ = cheerio.load(response.data);

        //Now grab the h2 
        $("h2").each(function(i, element){
            //Save results in an empty object 
            const result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
        //New article created using the result object built from scraping
        db.Article.create(result)
            .then(function(dbArticle){
                //View the added result in the console 
            console.log(dbArticle);
            })
            .catch(function(err){
                //If any error occured, catch and log
            console.log(err);
            });
        });

        //Send message 
        res.send("Scrape Complete");
    });
});

//Route for grabbing the articles 
app.get("/articles", function(req,res){
    db.Article.find({})
        .then(function(dbArticle){
            //Send articles back to client
            res.json(dbArticle);
        })
        .catch(function(err){
            //If an error occured send it to the client 
            res.json(err);
        });
});

//Route for grabbing a specific article by id, populate it 
app.get("/articles/:id", function(req, res){
    //Using the id passed in the id paramater, query that finds the matching one in the db
    db.Article.findOne({_id: req.params.id })
    //and populate all of the notes associated with it 
    .populate("note")
    .then(function(dbArticle){
        //If able to successfully find an article with a good id, send it back to the client
        res.json(dbArticle); 
    })
    .catch(function(err){
        res.json(err);
    });
});

//Route for saving/updating an article's associated Note
app.post("/articles/:id", function(req,res){
    //Create a new note and pass it to the req.body entry 
    db.Note.create(req.body)
    .then(function(dbNote){
        //If a note was created successfuly, find one article with an '_id' equal to 'req.params.id'
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
    return db.Article.findOneAndUpdate({_id: req.paramas.id }, {note: dbNote._id}, {new:true});
    })
    .then(function(dbArticle){
        //If the article was successfully updated send it back to the client 
        res.json(dbArticle);
    })
    .catch(function(err){
        //If an error occured, send it to the client
        res.json(err);
    });
});

//Server start 
app.listen(PORT, function(){
    console.log("App running on port " + PORT + "!");
});


