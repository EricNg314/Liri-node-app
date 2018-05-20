require("dotenv").config();

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var keys = require('../javascript/keys.js');


// var keys = "keys.js";

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var commandName = process.argv[2];
var inputArgs = process.argv;

var inputInfo = "";

for (var i = 3; i < inputArgs.length; i++) {
    inputInfo += inputArgs[i] + "+";
}

inputInfo = inputInfo.substring(0, inputInfo.length - 1);

console.log(commandName);
console.log(inputInfo);

if (commandName === "my-tweets") {
    console.log("Entered Tweets")
    var params = { screen_name: 'Omens68390424' };
    // client.get("statuses/user_timeline", params, function(error, tweets, response){
    //     if (!error) {
    //         console.log(tweets);
    //         console.log(response);
    //     }
    //     console.log(error);
    // })

} else if (commandName === "spotify-this-song") {

    if (inputInfo === "") {
        inputInfo = "Complicated";
        console.log("Default input: " + inputInfo);
    };

    spotify.search({
        // limit: "10",
        type: 'track',
        query: inputInfo
    }, function (err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        } else if (data["tracks"]["total"] != 0) {

            // var tracks = data["tracks"]["items"];
            // console.log(data);
            var dataTracks = data["tracks"]["items"];

            for (var h = 0; h < dataTracks.length; h++) {
                console.log("===================================================");
                console.log("Song Name: " + dataTracks[h]["name"]);

                for (var i = 0; i < dataTracks[h]["artists"].length; i++) {
                    console.log("Song Artist " + (i + 1) + ": " + dataTracks[h]["artists"][i]["name"]);
                }

                console.log("Song URL: " + dataTracks[h]["external_urls"]["spotify"]);
            }
        } else {
            //Avoiding another search due to possibility of endless loop if the sign does not exist as a result.
            console.log("===================================================");
            console.log("Song Name: " + "The Sign");
            console.log("Song Artist " + "Ace of Base");
            console.log("Song URL: " + "https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE");
        }
    });

} else if (commandName === "movie-this") {



} else if (commandName === "do-what-it-says") {

} else {
    console.log("===================================================");
    console.log("Sorry that is not a proper command");
    console.log("Please use one of the below: ");
    console.log("my-tweets");
    console.log("spotify-this-song");
    console.log("movie-this");
    console.log("do-what-it-says");
    console.log("===================================================");
}


