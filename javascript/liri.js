require("dotenv").config();

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var keys = require('../javascript/keys.js');


// var keys = "keys.js";

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var commandName = process.argv[2];


console.log(commandName);

if (commandName === "my-tweets") {


} else if (commandName === "spotify-this-song") {
    spotify.search({
        type: 'track',
        query: 'All the Small Things'
    }, function (err, data) {
        if(err){
            return console.log("Error occurred: " + err);
        }
        console.log(data);
    });

} else if (commandName === "movie-this") {

} else if (commandName === "do-what-it-says") {

} else {
    console.log("==========================================");
    console.log("Sorry that is not a proper command");
    console.log("Please use one of the below: ");
    console.log("my-tweets");
    console.log("spotify-this-song");
    console.log("movie-this");
    console.log("do-what-it-says");
    console.log("==========================================");
}


