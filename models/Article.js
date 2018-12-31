const mongoose = require("mongoose");

//Save a reference for the schema constructor 
const Schema = mongoose.Schema;

//Using the schema constructor, create a new UserSchema object 
const ArticleSchema = new Schema({
    //required link and type of string
    title: {
        type: String,
        required: true
    },
    //required link and type of string 
    link: {
        type: String, 
        required: true
    },
    //note is an object that stores the not id 
    //the ref property links the objectid to the not model 
    //allows to populate with the associated note 
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

const Article = mongoose.model("Article", ArticleSchema);

//Export the model
module.exports = Article;