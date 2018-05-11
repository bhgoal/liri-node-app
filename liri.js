require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var logData;
// Create and open file for appending. Open new write stream
var stream = fs.createWriteStream("log.txt", {flags:'a'});

function writeToLog(input) {
    console.log(input);
    stream.write(input + "\u000d");
}

// Take in the command line arguments
var nodeArgs = process.argv;

// Create an empty string for holding the address
var searchInput = "";

// Capture all the words in the search (ignoring the first three Node arguments)
for (var i = 3; i < nodeArgs.length; i++) {
  // Build a string with the search words.
  searchInput = searchInput + nodeArgs[i] + " ";
}

var command = process.argv[2];
stream.write("Command: " + command + " " + searchInput + "\u000d");
runCommand(command, searchInput);

function runCommand(command, searchInput) {
    switch (command) {
        case "my-tweets":
            myTweets();
            break;
        case "spotify-this-song":
            if (searchInput !== "") {
                spotifyThisSong(searchInput);
            } else {
                searchInput = "No search entered, displaying default"
                spotifyThisSong("The Sign Ace of Base");
            }
            break;
        case "movie-this":
            if (searchInput !== "") {
                movieThis(searchInput);
            } else {
                searchInput = "No search entered, displaying default"
                movieThis("Mr. Nobody");
            }
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
        console.log("Invalid command")
        break;
    }
}


function myTweets() {
    client.get('statuses/user_timeline', {screen_name: 'gorbftw', count: 20}, function(error, tweets, response) {
        if(error) throw error;

        for (var i = 0; i < tweets.length; i++) {
            logData =
            writeToLog("Tweet: " + tweets[i].text);
            writeToLog("Created at: " + tweets[i].created_at); 
            writeToLog("-----------------------------------------------------------------------------");
        }
    });
}

function spotifyThisSong(input) {
    spotify.search({ type: 'track', query: input }, function(err, data) {
        writeToLog("Search Input: " + input);
        if (err) {
            return writeToLog('Error occurred: ' + err);
        }
        writeToLog("Name: " + data.tracks.items[0].name);
        writeToLog("Artist: " + data.tracks.items[0].artists[0].name); 
        writeToLog("Album: " + data.tracks.items[0].album.name); 
        writeToLog("Preview: " + data.tracks.items[0].preview_url); 
        writeToLog("-----------------------------------------------------------------------------"); 
    });
}

function movieThis(input) {
    var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + input;
    request(queryUrl, function(error, response, body) {
        writeToLog("Search Input: " + input);
        if (error) {
            writeToLog('Error occurred:', error); 
            writeToLog('statusCode:', response && response.statusCode);
        }
        writeToLog('Title: ' + JSON.parse(body).Title);
        writeToLog('Year: ' + JSON.parse(body).Year);
        writeToLog('IMDB Rating: ' + JSON.parse(body).Ratings[0].Value);
        writeToLog('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
        writeToLog('Country: ' + JSON.parse(body).Country);
        writeToLog('Language: ' + JSON.parse(body).Language);
        writeToLog('Plot: ' + JSON.parse(body).Plot);
        writeToLog('Actors: ' + JSON.parse(body).Actors);
        writeToLog("-----------------------------------------------------------------------------");
    });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return writeToLog("Error occurred: " + error);
        }
        var dataArr = data.split(",");
        console.log(dataArr);

        for (i = 0; i < dataArr.length; i += 2) {

            // Check if data value does not begin with " (and thus is a command)
            if (dataArr[i].charAt(0) !== '"') {
                // Check if subsequent data value begins with " (and thus is a search term")
                if (dataArr[i + 1].charAt(0) === '"') {
                    searchInput = dataArr[i + 1];
                    runCommand(dataArr[i], searchInput);
                } else {
                    runCommand(dataArr[i]);
                }
            }
        
        }
    });
}