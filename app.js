

// var artURL = "https://musixmatchcom-musixmatch.p.rapidapi.com/wsr/1.1/artist.search?s_artist_rating=desc&q_artist=coldplay&page=1&page_size=5";

var APIKey = "5eafbf6ac992f091396b3310ca394d21";
var corsUrl = "https://cors-anywhere.herokuapp.com/";
var artistUrl = "https://api.musixmatch.com/ws/1.1/artist.search?q_artist=";
var albumUrl = "https://api.musixmatch.com/ws/1.1/artist.albums.get?artist_id=";

// giphy Example: http://api.giphy.com/v1/gifs/search?q=pig&api_key=453HTooEbMcLLHXzAyh12R3VvCGhpBWI
var giphyKey = "453HTooEbMcLLHXzAyh12R3VvCGhpBWI";
var giphyUrl = "https://api.giphy.com/v1/gifs/search?q=";
var artists_A = [];


function displayArtist (tag, A){
   var divTag = $("<div>");
   $(divTag).append(
      $("<div>").text(A.name) ,
      $("<div>").text("twitter: " +  A.twitter),
      $("<img>").attr("src", A.img)
   )
   var list = $("<ul>");
   A.albums.forEach(function (e) {
      list.append($("<li>").text(e.name + " ~ " + e.relDate));
      console.log(e);
   })

   $(divTag).append(list);
   $(tag).prepend(divTag);

}

$(document).ready(function() { //  Beginning of jQuery
   var topArtist = {};
   $("#add-artist").on("click", function () {
       artistName = $("#input-artist").val().trim();
       $("#status").text("Searching " + artistName +" ....");
   })

// Find all artists   
$("#add-artist").on("click", function () {
   var rating = 0;
   $.ajax( {
    // url: "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/artist.search?q_artist=Prodigy&page_size=5&apikey=5eafbf6ac992f091396b3310ca394d21",
    url: corsUrl + artistUrl + artistName + "&apikey=" + APIKey, 
    method: "GET",
    dataType: "json"
    }).then( function (response) {
        var artists = response.message.body.artist_list;
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
             url: corsUrl + giphyUrl + name1 + "+music"+ "&api_key=" + giphyKey ,
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

     
}) // End Of Click

}) // end of document ready



// //  Another ajax call to get an image
//         setTimeout( function () {
//          for(var i=0; i<artists_A.length; i++) {
//             setTimeout(function () {

//             var name1 = artists_A[i].name.replace(" ", "+");
//            $.ajax( {
//                  url: giphyUrl + name1 + "&api_key=" + giphyKey ,
//                  method: "GET",
//                  dataType: "json"
//            }).then(function (gResponse) {
//                 artists_A[i].img = gResponse.data[0].images.fixed_height_small_still.url;
//            }); // end of giphy
//         }, 500); 
//         } // for loop
//         }, 500);
                


//             //    console.log(artId, artName, artTwitter);
// // Get picturebfrom giphy
//                $.ajax( {
//                    url: giphyUrl + artName1 + "&api_key=" + giphyKey ,
//                    method: "GET",
//                    dataType: "json"
//                }).then(function (gResponse) {
//                    imgUrl = gResponse.data[0].images.fixed_height_small_still.url;
//                    artist_O.img = "hhhhhhhh"
//                    console.log("===>url", imgUrl);
//                }); // end of giphy 
               
               
// // find Albums from Artist ID
// //        url: "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/artist.albums.get?artist_id=13816&apikey=5eafbf6ac992f091396b3310ca394d21"
//                 artist_O.albums=[];      
//                 $.ajax({
//                    url: corsUrl + albumUrl + artId + "&apikey=" + APIKey,
//                    method: "GET",
//                    dataType: "json"
//                }).then(function (aResponse) {
//                     var albums = aResponse.message.body.album_list;
//                     albums.forEach(function(albm) {
//                         albmName = albm.album.album_name;
//                         albmRel = albm.album.album_release_date;
//                         artist_O.albums.push({
//                                   name: albmName,
//                                   relDate: albmRel
//                                 });
//                         console.log(albmName, albmRel);
//                     }); 
//                     // artist_O.albums = albums;
//                     console.log(albums);
//                }); //end of albums
//                artists_A.push(artist_O);
//         })
//    })

//    console.log("Final==>", artists_A);