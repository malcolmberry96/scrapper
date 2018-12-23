const mongoose = require("mongoose");

//Refrence to the schema constructor 
const Schema = mongoose.Schema;

//Using the schema constructor a note schema object is created 
const NoteSchema = new Schema({
    title: String,
    body: String, 
});

//creates model using mongoose 
const Note = mongoose.model("Note", NoteSchema);

//Export the Note model 
module.export = Note;
