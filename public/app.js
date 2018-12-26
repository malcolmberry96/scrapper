
$.getJSON("/articles", function(data){
    //Fore each article 
    for (let i = 0; i < data.length; i++){
        //Display the article on the page
        $("#articles").append("<p data-id=" + data[i]._id + ">" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

//Whenever someone clicks a p-tag
$(document).on("click", "p", function(){
    //Empty the notes from the note section 
    $("#notes").empty();
    //Save the id from the p tag 
    const thisId = $(this).attr("data-id");

//Now make an ajax call for the Article 
$.ajax({
    method:"GET",
    url: "/articles/" + thisId
})
    //With that done, add the note information to the page 
    .then(function(data){
        console.log(data);
        //The title of the article 
        $("#notes").append("<h2>" + data.title + "<h2>")
        //An input to enter a new title 
        $("#notes").append("<input id='titleinput' name='title' >");
        //A textarea to add a new note body 
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea");
        //A button to submit a new text 
        $("#notes").append("<button data-id='" + data._id + "'id='savenote'>Save Note</button>");

        //If there's a note in the article 
        if (data.note) {
            //Place the title of the note in the title input 
            $("#titleinput").val(data.note.title);
            //Place the body of the note in the body textarea 
            $("#bodyinput").val(data.note.body);
        }
    });
});
//When you click the savenote button 
$(document).on("click", "#savenote", function(){
    //Grab the associated id to enable the click 
    const thisId = $(this).attr("data-id");

    //Run a POST request to change the note, using what's entered in the inputs 
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            //Value taken from title input 
            title: $("#titleinput").val(),
            //Value from note textarea 
            body: $("#bodyinput").val()
        }
    })
    //Log response 
    .then(function(data){
        console.log(data);
        //Empty the notes section 
        $("notes").empty();
    });

    //Remove the values entered in the input and textarea for not entry 
    $("#tittleinput").val("");
    $("#bodyinput").val("");
});

