

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


function displayArtist (tag, A){
   var divTag = $("<div>");
   var aTag = $("<div>");
   if (A.twitter !== "") {
       aTag = $("<div>").text("twitter:  ");
       aTag.append($("<a>").attr("href", A.twitter).text(A.twitter).attr("target", "_blank"));
   }
   $(divTag).append(
      $("<div>").text(A.name) ,
      aTag,
      $("<img>").attr("src", A.img)
   )
   var list = $("<ul>");
   A.albums.forEach(function (e) {
      list.append($("<li>").text(e.name + " release:" + e.relDate));
      console.log(e);
   })

   $(divTag).append(list);
   $(tag).prepend(divTag);

   var aa = artistsBase.findIndex(obj => obj.id === A.id);
   var visit1= -1;

   if (aa >= 0 ) {  // updating 
       visit1 = artistsBase[aa].visits - 1;
       database.ref().child(artistsBase[aa].key).remove();
       artistsBase.splice(aa,1);    
   }
     
   var k = database.ref().push({
      name: A.name,
      id: A.id,
      visits: visit1
   })   
   
   // artistsBase.push({
   //     key: k.key,
   //     name: A.name,
   //    id: A.id,
   //    visits: visit1
   // })

}
  
  
   function addTopArtist (artistName) {
      console.log("<==================================>");
      alert(artistName);
      var rating = 0;
      $.ajax( {
       // url: "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/artist.search?q_artist=Prodigy&page_size=5&apikey=5eafbf6ac992f091396b3310ca394d21",
       url: corsUrl + artistUrl + artistName + "&apikey=" + APIKey, 
       method: "GET",
       dataType: "json"
       }).then( function (response) {
          console.log("<==================================>", response);
           var artists = response.message.body.artist_list;
           alert(artists[0].artist.artist_name)
           
           // console.log(artists);
           artists.forEach( function (e) {
   
                 if (parseInt(e.artist.artist_rating) >= rating) {
                     rating = e.artist.artist_rating;
                     topArtist =  {
                         id: e.artist.artist_id,
                         rating: rating,
                         name: e.artist.artist_name.trim(),
                         twitter: e.artist.artist_twitter_url,
                         img: "xxx",
                         albums: []
                     }
                 }
               //   console.log(topArtist);   
           })//  end of loop all artists
           if (rating > 20) { 
              var name1 = topArtist.name.replace(" ", "+");
              $.ajax( {
                url: corsUrl + giphyUrl + name1 + "&api_key=" + giphyKey ,
                method: "GET",
                dataType: "json"
              }).then(function (gResponse) {
                topArtist.img = gResponse.data[0].images.fixed_height_still.url;
              
             $.ajax({
                url: corsUrl + albumUrl + topArtist.id + "&apikey=" + APIKey,
                method: "GET",
                dataType: "json"
             }).then(function (aResponse) {
               var albums = aResponse.message.body.album_list;
               albums.forEach(function(albm) {
                     albmName = albm.album.album_name;
                     albmRel = albm.album.album_release_date;
                     topArtist.albums.push({
                        name: albmName,
                        relDate: albmRel
                     });
                }); 
                displayArtist("#image-view", topArtist );  
                $("#status").text("Top Artist: " + topArtist.name);  
                if (artists_A.indexOf(topArtist.name) < 0) {
                   artists_A.push(topArtist.name);
                   $("#showBtn").prepend($("<button>").addClass("TopArtist")
                                 .val(topArtist.name).text(topArtist.name));
   
                   console.log("array==>" , artists_A);
                }    
                                   
              }); //end of albums
             
           }); // end of giphy 
                        
           } else {
               $("#status").text("No artist found");
               // alert("Not there");
           }
            console.log(topArtist);
   
       });  //end of ajax call for all artists
   } // end of Function


$(document).ready(function() { //  Beginning of jQuery


   $("#add-artist").on("click", function () {
      
      var artistName = $("#input-artist").val().trim();
      topCount = topNum
      $("#status").text("Searching " + artistName +" ....");
      addTopArtist(artistName);
  })

  $(document).on("click", ".TopArtist", function () {
      var name = $(this).val();
      addTopArtist(name);

  })

  database.ref().orderByChild("visits").on("child_added", function (snapshot){
     console.log("snapshot==>", snapshot.val());
   //   artistInfo.key = snapshot.key;
   //   artistInfo.name = snapshot.val().name;
   //   artistInfo.id = snapshot.val().id;
   //   artistInfo.visits = snapshot.val().visits;
     artistsBase.push( {
           key: snapshot.key,
           name: snapshot.val().name,
           id: snapshot.val().id,
           visits: snapshot.val().visits
     });
     console.log(artistsBase); 
     if (topCount < topNum) {
         topCount++;
         // $("#topList").append($("<li>").text("hhhk"));
         $("#showBtn").append($("<li>").text(snapshot.val().name + " -- " + snapshot.val().visits*(-1)));
     }   
  })

  // Add Top 5 buttons
  
//   for (i = (artistsBase.length -1); (i>=0) && (i > artistsBase.length - 5) ; i -- ) {

     
      

//   }

   //   // Find all artists   
   //   $("#add-artist").on("click", function () {
   //  addTopArtist(); 
   //   })

}) // end of document ready

