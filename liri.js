require("dotenv").config();

var fs = require("fs");
var Movie = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var keys = require('./keys.js');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var cmdName = process.argv[2];
var inputArgs = process.argv;

var inputInfo = "";

for (var i = 3; i < inputArgs.length; i++) {
    inputInfo += inputArgs[i] + "+";
}

inputInfo = inputInfo.substring(0, inputInfo.length - 1);

checkCmd();




function checkCmd() {
    // console.log(cmdName);
    // console.log(inputInfo);

    if (cmdName === "my-tweets") {
        twitterCmd()

    } else if (cmdName === "spotify-this-song") {
        spotifyCmd();

    } else if (cmdName === "movie-this") {
        movieCmd();

    } else if (cmdName === "do-what-it-says") {
        randomCmd();
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
};

function twitterCmd() {
    console.log("Entered Tweets")
    var params = { screen_name: 'realDonaldTrump', tweet_mode: 'extended' };
    client.get("statuses/user_timeline", params, function (error, tweets, response) {
        if (!error) {
            console.log(tweets);
            for (var i = 0; i < tweets.length; i++) {
                console.log("===================================================");
                // console.log(i + 1);
                console.log("Created: " + tweets[i]["created_at"]);
                console.log("Message: " + tweets[i]["full_text"]);
                console.log("By: " + tweets[i]["user"]["name"]);

                var appendLine = "\n ===================================================";
                var appendCreated = "\n Created: " + tweets[i]["created_at"];
                var appendMessage = "\n Message: " + tweets[i]["full_text"];
                var appendBy = "\n By: " + tweets[i]["user"]["name"];

                fs.appendFile("log.txt", appendLine + appendCreated + appendMessage + appendBy + "\n\n", function (error) {
                    if (error) {
                        return console.log(error);
                    }
                });

            }
        }
    })

};

function spotifyCmd() {
    if (inputInfo === "") {
        //Avoiding search due to possibility of endless loop if the sign does not exist as a result.
        //Also the spotify search only takes 1 parameter author or song track. No guarantee of both "The Sign" and "Ace of Base".
        console.log("===================================================");
        console.log("Song Name: " + "The Sign");
        console.log("Song Artist :" + "Ace of Base");
        console.log("Song URL: " + "https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE");

    } else {
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

                var appendName = "";
                var appendArtist = "";

                for (var h = 0; h < dataTracks.length; h++) {
                    console.log("===================================================");
                    console.log("Song Name: " + dataTracks[h]["name"]);
                    appendName = "\n Song Name: " + dataTracks[h]["name"];

                    // Resetting appendArtists for each song.
                    appendArtist = "";
                    for (var i = 0; i < dataTracks[h]["artists"].length; i++) {
                        console.log("Song Artist " + (i + 1) + ": " + dataTracks[h]["artists"][i]["name"]);
                        appendArtist += "\n Song Artist " + (i + 1) + ": " + dataTracks[h]["artists"][i]["name"];
                    }

                    console.log("Song URL: " + dataTracks[h]["external_urls"]["spotify"]);

                    var appendLine = "\n ===================================================";
                    var appendURL = "\n Song URL: " + dataTracks[h]["external_urls"]["spotify"];

                    fs.appendFile("log.txt", appendLine + appendName + appendArtist + appendURL + "\n\n", function (error) {
                        if (error) {
                            return console.log(error);
                        }
                    });
                }
            } else {
                console.log("Sorry no results.")
            }
        });
    }
};

function movieCmd() {
    if (inputInfo === "") {
        inputInfo = "Mr. Nobody"
    }
    var queryURL = "http://www.omdbapi.com/?t=" + inputInfo + "&apikey=Trilogy"

    Movie(queryURL, function (error, response, body) {
        console.log("\n===================================================");

        if (!error && response.statusCode === 200) {
            var bodyInfo = JSON.parse(body);

            if (bodyInfo["Response"] === "True") {
                var bodyRating = bodyInfo["Ratings"];
                var bodyNoRating = true;
                console.log("Title: " + bodyInfo["Title"]);
                console.log("Release Year: " + bodyInfo["Year"]);

                var appendLine = "\n ===================================================";
                var appendTitle = "\n Title: " + bodyInfo["Title"];
                var appendYear = "\n Release Year: " + bodyInfo["Year"];
                var appendRatingIMDB = "";
                var appendRatingRT = "";

                //Getting the ratings for IMDB or RT
                for (var i = 0; i < bodyRating.length; i++) {
                    if (bodyRating[i]["Source"] === "Internet Movie Database") {
                        bodyNoRating = false;
                        console.log("IMDB Rating: " + bodyRating[i]["Value"]);
                        appendRatingIMDB = "\n IMDB Rating: " + bodyRating[i]["Value"];
                    } else if (bodyRating[i]["Source"] === "Rotten Tomatoes") {
                        bodyNoRating = false;
                        console.log("Rotten Tomatoes Rating: " + bodyRating[i]["Value"]);
                        appendRatingRT = "\n Rotten Tomatoes Rating: " + bodyRating[i]["Value"];
                    };


                };
                if (bodyNoRating === true) {
                    console.log("Sorry no rating available.");
                };

                console.log("Country Produced: " + bodyInfo["Country"]);
                console.log("Language: " + bodyInfo["Language"]);
                console.log("Plot: " + bodyInfo["Plot"]);
                console.log("Actors: " + bodyInfo["Actors"]);

                var appendCountry = "\n Country Produced: " + bodyInfo["Country"];
                var appendLanguage = "\n Language: " + bodyInfo["Language"];
                var appendPlot = "\n Plot: " + bodyInfo["Plot"];
                var appendActors = "\n Actors: " + bodyInfo["Actors"];

                fs.appendFile("log.txt", appendLine + appendTitle + appendYear + 
                appendRatingIMDB + appendRatingRT + appendCountry + 
                appendLanguage + appendPlot + appendActors + "\n\n", function (error) {
                    if (error) {
                        return console.log(error);
                    }
                });

            } else {
                console.log(bodyInfo["Error"]);
            };
        };
    });
};

function randomCmd() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        } else {
            // console.log(data);
            var dataObj = JSON.parse(data);

            //Selecting a random command for input.
            var randomCmd = function () {
                var keys = Object.keys(dataObj);
                return keys[Math.floor(Math.random() * keys.length)];
            };

            cmdName = randomCmd();

            // console.log(cmdName);
            // console.log(dataObj[cmdName]);
            //Getting a random input for the command.
            var randomInput = function () {
                var possibleInputs = dataObj[cmdName];
                var string = possibleInputs[Math.floor(Math.random() * possibleInputs.length)];
                return string;
            }

            // Setting input to be empty
            inputArgs = randomInput();

            inputInfo = inputArgs.replace(/ /g, "+");
            // console.log(inputInfo);

            checkCmd()

        }
    })

}