// Dependencies

//add code to read and set any environment variables with the dotenv package
require("dotenv").config();

// import the npm package for node-spotify-api
var Spotify = require ("node-spotify-api");

// Import API keys
var keys = require("./keys");

// Import axios npm
var axios = require("axios");

//Import moment npm
var moment = require ("moment");

//Import fs package for read and write
var fs = require("fs");

// Initialize spotify API credentials
var spotify = new Spotify(keys.spotify);

// Get artist name
var artistNames = function(artist) {
    return artist.name;
}

// Search spotify 
var searchSpotify = function (songName) {
    if (songName === undefined) {
        songName = "What is my age again?";
    }
    spotify.search(
        {
            type: "track",
            query: songName
        },
        function(err, data) {
            if (err){
                console.log ("Error" + err);
                return;
            }
            var songs = data.tracks.items;
            for (var i = 0; i < songName.length; i++){
                console.log (i);
                console.log ("Artist: " + songs[i].artists.map(artistNames));
                console.log ("Song Name: " + songs[i].name);
                console.log ("Preview Song: " + songs[i].preview_url);
                console.log ("Album: " + songs[i].album.name);
                console.log ("--------------------------------------------------");
            }
        }
    );
};

var myBands = function (artist){
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(
        function(response) {
            var jsonData = response.data;
            if (!jsonData.length){
                console.log ("No results for " + artist);
                return;
            }
            console.log("Upcoming concerts for " + artist + ":");
            for (var i = 0; i< jsonData.length; i++) {
                var show = jsonData[i];
// display the data for each concert. Use country if no region available, format date via moment 
                console.log(
                    show.venue.city + "," +(show.venue.region || show.venue.country) + " at " + show.venue.name + " " + moment(show.datetime).format("MM/DD/YYYY")
                );
            }
        }
    );
};

// OMDB Movie search 
var movie = function (movieName){
    if (movieName === undefined){
        movieName = "Mr Nobody";
    }

    var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

    axios.get(url).then(
        function(response){
            var jsonData = response.data;

     console.log("Title: " + jsonData.Title);
     console.log("Year: " + jsonData.Year);
     console.log("Rated: " + jsonData.Rated);
     console.log("IMDB Rating: " + jsonData.imdbRating);
     console.log("Country: " + jsonData.Country);
     console.log("Language: " + jsonData.Language);
     console.log("Plot: " + jsonData.Plot);
     console.log("Actors: " + jsonData.Actors);
     console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
        }
    );
};

// Function for running a command based on text file
var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);
   
      var dataArr = data.split(",");
   
      if (dataArr.length === 2) {
        pick(dataArr[0], dataArr[1]);
      } else if (dataArr.length === 1) {
        pick(dataArr[0]);
      }
    });
   };
   
   // determining which command is executed
   var pick = function(caseData, functionData) {
    switch (caseData) {
    case "concert-this":
      myBands(functionData);
      break;
    case "spotify-this-song":
      searchSpotify(functionData);
      break;
    case "movie-this":
      movie(functionData);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("LIRI doesn't know that");
    }
   };
   
   // Function which takes in command line arguments and executes correct function accordingly
   var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
   };
   
   // MAIN PROCESS
   // =====================================
   runThis(process.argv[2], process.argv.slice(3).join(" "));


