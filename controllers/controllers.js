//Dependendencies 
const express = require("express");
const router = express.Router();
const path = require("path");

//require request and cheerio to scrape 
const request = require("request");
const cheerio = require("cheerio");

//Require models 
const Comment = require("../models/Comment.js");
const Article = require("../models/Article.js");

//index 
router.get("/", function(req,res){
    res.redirect("/articles");
});

// router.get('/test-scrape', function(req, res) {
//   request(result.link, function(error, response, html) {
//     var $ = cheerio.load(html);

//     $('.l-col__main').each(function(i, element){
//       var result = {};

//       console.log($(this).children('.c-entry-content').children('p').text());
//     });
//   });
// });

//GET request to scrape the verge website 
router.get("/scrape", function(req,res){
    //grab the body of html with request 
    request("http://www.theverge.com/tech", function(error,response,html) {
    const $ = cheerio.load(html);
    const titlesArray = [];
    //Grab articles by the class 
    $(".c-hub-entry__title").each(function(i,element){
        //Save an empty object 
    const result = {};

    //Add the text and href of all links and save them as properties 
    result.title = $(this).children("a").text();
    result.link = $(this).children("a").attr("href");

    //ensures that no empty title or links are sent to the mongodb 
    if(result.title !== "" && result.link !== ""){
        //check for duplicates
        if(titlesArray.indexOf(result.title) == -1){

            //Push the saved title to the array 
            titlesArray.push(result.title);

    //only add the article if it is not already there 
    Article.count({ title: result.title}, function (err,test){
        //if the test is 0, the entry is unique and good to save 
    if(test == 0){
        
        //Using article model, create new object 
        const entry = new Article (result);

        //Save entry to mongodb 
        entry.save(function(err, doc){
            if(err){
                console.log(err);    
            }else{
                console.log(doc);   
            }
        });
    }
});
        }
        //Log that scrape is working 
        else{
            console.log('Article already exists.')
        }

    }
    //Log working but not missing data 
    else{
        console.log('Note saved to DB, missing data')
    }
});
//after the scrape, redirects to the index 
res.redirect("/");
    });
});
//this will grab every article an populate the DOM 
router.get("/articles", function(req, res){
    //allows newer articles to be on top 
    Article.find().sort({_id: -1})
    //send to handlebars 
    .exec(function(err,doc){
        if(err){
            console.log(err);
        }else{
            const artcl = {article: doc};
            res.render('index', artcl);
        }
    });
});
//This will get the articles scraped from mongoDB to the json
router.get("/articles-json", function(req,res){
    Article.find({}, function(err, doc){
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});
//clear articles for viewing/testing purposes 
router.get('/clearAll', function(req,res){
    Article.remove({}, function(err,doc){
        if (err){
            console.log(err);
        }else{
            console.log("removed all articles");
        }
    });
    res.redirect("/article-json");
});
//read article
router.get("/readArticle/:id", function(req,res){
    const articleId = req.params.id;
    const hbsObj = {
        article: [],
        body: []
    };
    // find the article at the id
    Article.findOne({_id: articleId}, function(err, doc){
        if(err){
            console.log("Error: " + err);
        }else{
            hbsObj.article = doc;
            const link = doc.link;
        //grab article from link
        request(link, function(err, response,html){
            const $ = cheerio.load(html);

        $(".l-col_main").each(function(i,element){
            hbsObj.body = $(this).children(".c-entry-content").children("p").text();
            //send article body and comments to article.handlebars through hbObj
            res.render("article", hbsObj);
            //prevent loop through so it doesn't return an empty hbsObj.body
            return false;
        });
        });
        }
    });
});
//Create a new comment 
router.post("/comment/:id", function(req, res){
    const user = req.body.name;
    const content = req.body.test;
    const articleId = req.params.id;
});
//submitted form 
const result = {
    name: user,
    body: content
};
console.log('Comment: ' + result);
//Using the comment model, create a new comment
const newComment = new Comment(result);

newComment.save(function(err,doc){
    if (err) {
        console.log(err);
    } else {
        Article.findOneAndUpdate({"_id": articleId},{$push :{"comments":doc._id}}, {new: true})
        //execute everything
        .exec(function(err, doc){
            if (err) {
                console.log(err);
            } else {
                res.redirect("/readArticle/" + articleId);
            }
        });
    }
});
    
module.exports = router;
