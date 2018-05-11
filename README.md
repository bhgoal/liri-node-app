# liri-node-app

#About
LIRI is a Node command line application that allows users to search for songs on Spotify, movies on IMDB, or tweets from Twitter, and return information on the results in the console. 

#Usage:
node liri.js *command* *searchTerm*

##Command:
*my-tweets* retrieves the 20 most recent tweets from your Twitter account. No *searchTerm* is necessary.
*spotify-this-song* searches the Spotify catalog and returns song information including title, artist, album, and a link to an mp3 preview.
*movie-this* searches the IMDB database and returns movie information including title, year, user ratings, plot, and more.
*do-what-it-says* allows users to run a custom bulk sequence of commands stored in the random.txt file. Commands must be comma separated, with double quotes around *searchTerms*.

##searchTerm:
*searchTerm* is the content that the user wants to search for, and can be a single word or multiple.

##Notes:
Output will be logged to the console as well as to the log.txt file.