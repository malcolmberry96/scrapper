//Dependencies 
const express = require("express");
const logger = require("logger");
const mongoose = require("mongoose");

//scrapping tools 
const cheerio = require("cherrio");
const axios = require("axios");

//models 
const db = require("./models");

const PORT = 3000;

//Initialize express 

const express = require("express");

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
    axios.get("/https://hypebeast.com/").then(function(response){
        //we load into a shorthand selector 
        const $ = cheerio.load(response.data);

        //Now grab the h2 
        $("h2").each(function(i, element){
            //Save results in an empty object 
            const result = {};

            result.title = $(this)
                .children("a")

        })


    })

    })
})

