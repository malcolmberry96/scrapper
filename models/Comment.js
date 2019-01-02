const mongoose = require("mongoose");

//Refrence to the schema constructor 
let Schema = mongoose.Schema;

//Using the schema constructor a note schema object is created 
let CommentSchema = new Schema({
    name: {
        type: String
    },
    body: {
        type: String,
        required: true
    }
});

//creates model using mongoose 
let Comment = mongoose.model("Comment", CommentSchema);

//Export the Comment model 
module.export = Comment;
