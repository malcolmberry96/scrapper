
$.getJSON("/article", function(data){
    //Fore each article 
    for (const i = 0; i < data.length; i++){
        //Display the article on the page
        $("#articles").append("<p data-id=" + data[i]._id + ">" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

//Whenever someone clicks a p-tag
$document.on("click", "p", function(){
    //Empty the notes from the note section 
    $("#notes").empty();
    //Save the id from the p tag 
    const thisId = $(this).attr("data-id");

//Now make an ajax call for the Article 
$.ajax({
    method:"GET",
    url: "/articles" + thisId
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
        $("#notes").append("button data-id=' " + data._id + " 'id='savenote'>>")
    })
})

