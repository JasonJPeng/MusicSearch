alert("kkkk");

// var artURL = "https://musixmatchcom-musixmatch.p.rapidapi.com/wsr/1.1/artist.search?s_artist_rating=desc&q_artist=coldplay&page=1&page_size=5";

var APIKey = "5eafbf6ac992f091396b3310ca394d21";
var corsUrl = "https://cors-anywhere.herokuapp.com/";
var artistUrl = "https://api.musixmatch.com/ws/1.1/artist.search?q_artist=";
var albumUrl = "https://api.musixmatch.com/ws/1.1/artist.albums.get?artist_id=";

// giphy Example: http://api.giphy.com/v1/gifs/search?q=pig&api_key=453HTooEbMcLLHXzAyh12R3VvCGhpBWI
var giphyKey = "453HTooEbMcLLHXzAyh12R3VvCGhpBWI";
var giphyUrl = "https://api.giphy.com/v1/gifs/search?q=";

var artists_A = [];
var topArtist = {};

var topNum = 5;
var topCount = 0;

var config = {
   apiKey: "AIzaSyAvGvG1R22E4ByFmpVdnZKGA2FZzqizswc",
   authDomain: "musearch-7ffde.firebaseapp.com",
   databaseURL: "https://musearch-7ffde.firebaseio.com",
   projectId: "musearch-7ffde",
   storageBucket: "",
   messagingSenderId: "258919187131",
   appId: "1:258919187131:web:8aa7d0509b6ba628"
 };

firebase.initializeApp(config);
var database = firebase.database();

var artistsBase = [];
var artistInfo = { key: "", name: "", id: "", visits: ""};


$.ajax( {
    // url: "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/artist.search?q_artist=Prodigy&page_size=5&apikey=5eafbf6ac992f091396b3310ca394d21",
    url: corsUrl + artistUrl + "jason" + "&apikey=" + APIKey, 
    method: "GET",
    dataType: "json"
    }).then( function (response) {
        alert("Jjjj");
    }) 

