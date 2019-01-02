const mongoose = require("mongoose");

//Refrence to the schema constructor 
const Schema = mongoose.Schema;

//Using the schema constructor a note schema object is created 
const CommentSchema = new Schema({
    name: {
        type: String
    },
    body: {
        type: String,
        required: true
    }
});

//creates model using mongoose 
const Comment = mongoose.model("Comment", CommentSchema);

//Export the Note model 
module.export = Comment;
