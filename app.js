// var artURL = "https://musixmatchcom-musixmatch.p.rapidapi.com/wsr/1.1/artist.search?s_artist_rating=desc&q_artist=coldplay&page=1&page_size=5";

var APIKey = "5eafbf6ac992f091396b3310ca394d21";
var corsUrl = "https://cors-anywhere.herokuapp.com/";
var artistUrl = "https://api.musixmatch.com/ws/1.1/artist.search?q_artist=";
var albumUrl = "https://api.musixmatch.com/ws/1.1/artist.albums.get?artist_id=";

// giphy Example: http://api.giphy.com/v1/gifs/search?q=pig&api_key=453HTooEbMcLLHXzAyh12R3VvCGhpBWI
var giphyKey = "453HTooEbMcLLHXzAyh12R3VvCGhpBWI";
var giphyUrl = "https://api.giphy.com/v1/gifs/search?q=";

// https://www.youtube.com/results?search_query=Lady+Gaga+music
var youTubeUrl = "https://www.youtube.com/results?search_query=";


var artists_A = [];
var topArtist = {};

var topNum = 10;
var topCount = 0;
var numCol = 4;
var iAdded = 0;

var defaultIds = [];

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
var artistInfo = {
  key: "",
  name: "",
  id: "",
  visits: ""
};


function displayArtist(tag, A) {
    var twt = ""
    if (A.twitter !== "") {

       twt = "twitter:  " + 
             "<a href=" + A.twitter + "  target = _blank>" + A.twitter +"</a>" ;
    }
    var albumList = "";
    A.albums.forEach(function(e) {
       albumList = albumList + "<li>" + e.name + "(" + e.relDate + ")</li>";
    })
    
   if ((iAdded % numCol) === 0 ) {  // add a new row
     newTag = $(`<div class="row" id="program-added-${iAdded}">`);
     $(tag).prepend(newTag);
   } else {
      newTag = $(`#program-added-${parseInt(iAdded/numCol)*numCol}`);
   }
   iAdded++;
  var htmlCode = `
  <div class="col-md-3">
                    <div class="card">
                        <img class="card-img-top"
                            src="${A.img}"
                            alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title">${A.name}</h5>
                            <p class="card-text">${twt}</p>
                            <ul>
                            ${albumList}
                            </ul>
                            <a href="#" class="btn btn-primary">Check out</a>
                        </div>
                    </div>
                </div>
  `;

   
$(newTag).prepend($(htmlCode));

// Updating the array
var aa = artistsBase.findIndex(obj => obj.id === A.id);
  var visit1 = -1;

  if (aa >= 0) { // updating
    visit1 = artistsBase[aa].visits - 1;
    database.ref().child(artistsBase[aa].key).remove();
    artistsBase.splice(aa, 1);
  }

  var k = database.ref().push({
    name: A.name,
    id: A.id,
    visits: visit1
  })

}


function displayArtist1(tag, A) {
  var divTag = $("<div>").addClass("card").attr("style", "width: 18rem;");
  var aTag = $("<div>");
  if (A.twitter !== "") {
    aTag = $("<div>").text("twitter:  ");
    aTag.append($("<a>").attr("href", A.twitter).text(A.twitter).attr("target", "_blank"));
  }

  var imgTag = $("<img>").addClass("card-img-top").attr("src", A.img);
  
  
  

  var albumTag = $("<ul>");
      A.albums.forEach(function(e) {
        var relD = "";
        if (e.relDate.trim() !== "") {
          relD = "<br>(" + e.relDate + ")";
       }
        albumTag.append($("<li>").html(e.name + relD));  
     
  })

  divTag.append(
      imgTag, $("<h5>").addClass("card-title").text(A.name),
      $("<p>").addClass("card-text").append(aTag), albumTag
  );

  $(tag).prepend(divTag);


  // $(divTag).append(
  //   $("<div>").text(A.name),
  //   aTag,
  //   $("<img>").attr("src", A.img)
  // )
  // var list = $("<ul>");
  // A.albums.forEach(function(e) {
  //   list.append($("<li>").text(e.name + " release:" + e.relDate));
  //   console.log(e);
  // })

  // $(divTag).append(list);
  

  var aa = artistsBase.findIndex(obj => obj.id === A.id);
  var visit1 = -1;

  if (aa >= 0) { // updating
    visit1 = artistsBase[aa].visits - 1;
    database.ref().child(artistsBase[aa].key).remove();
    artistsBase.splice(aa, 1);
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

async function getAlbums(topArtist) {
  return $.ajax({
    url: corsUrl + albumUrl + topArtist.id + "&apikey=" + APIKey,
    method: "GET",
    dataType: "json"
  });
}

async function saveAlbumInfo(response) {
  var albums = response.message.body.album_list;
  console.log("====",albums);
  albums.forEach(function(albm) {
    albmName = albm.album.album_name;
    
    if (topArtist.albums.findIndex(o => o.name === albmName ) < 0) {  // Album Name not found
       albmRel = albm.album.album_release_date;
       topArtist.albums.push({
       name: albmName,
       relDate: albmRel
     });
    } // end If 
  });
}

async function updateStatus(topArtist) {
  $("#status").text("Top Artist: " + topArtist.name);

  if (artists_A.indexOf(topArtist.name) < 0) {
    artists_A.push(topArtist.name);
    // var myBtn = ($("<button>").addClass("TopArtist")
    //   .val(topArtist.name).text(topArtist.name));
    var aTag = $("<a>").addClass("dropdown-item").attr("target", "_blank")
                       .attr("href", youTubeUrl + topArtist.name.replace(" ", "+") + "+music")
                       .text(topArtist.name)  

      // $("#favorite").prepend(myBtn);
      $("#dropDown").prepend(aTag);

    console.log("array==>", artists_A);
  }
}

async function getArtistRating(artists) {
  var rating = 0;
  artists.forEach(function(e) {

    if (parseInt(e.artist.artist_rating) >= rating) {
      rating = parseInt(e.artist.artist_rating);
      topArtist = {
        id: e.artist.artist_id,
        rating: rating,
        name: e.artist.artist_name.trim(),
        twitter: e.artist.artist_twitter_url,
        img: "xxx",
        albums: []
      }
    }
    //   console.log(topArtist);
  }) //  end of loop all artists
  return rating;

}

async function getGiphy(topArtist) {
  var name1 = topArtist.name.replace(" ", "+");
  return $.ajax({
    url: corsUrl + giphyUrl + name1 + "&api_key=" + giphyKey,
    method: "GET",
    dataType: "json"
  });
}

async function getArtist(artistName) {
  return $.ajax({
    // url: "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/artist.search?q_artist=Prodigy&page_size=5&apikey=5eafbf6ac992f091396b3310ca394d21",
    url: corsUrl + artistUrl + artistName + "&apikey=" + APIKey,
    method: "GET",
    dataType: "json"
  });
}

async function addTopArtist(artistName) {
  try {
    var rating = 0;
    var response = await getArtist(artistName);
    var artists = response.message.body.artist_list;
    //
    // get artist rating, bail if < 20
    //
    rating = await getArtistRating(artists);
    
    if (rating < 20) {
      $("#status").text("No artist found");
      return;
    } 
    response = await getGiphy(topArtist);
    topArtist.img = response.data[0].images.fixed_width_still.url;
    //
    // get albums
    //
    response = await getAlbums(topArtist);
    //
    // save album info
    //
    saveAlbumInfo(response);
    //
    // display stuff
    //
    displayArtist("#image-view", topArtist);
    updateStatus(topArtist);
    
  } catch (error) {
    alert(error);
  };
}



$(document).ready(function() { //  Beginning of jQuery


  $("#add-artist").on("click", function(event) {
    event.preventDefault();
    var artistName = $("#input-artist").val().trim();
    topCount = topNum
    $("#status").text("Searching " + artistName + " ....");
    addTopArtist(artistName);
  })

  $(document).on("click", ".TopArtist", function() {
    var name = $(this).val();
    addTopArtist(name);

  })

  database.ref().orderByChild("visits").on("child_added", function(snapshot) {
      artistsBase.push({
      key: snapshot.key,
      name: snapshot.val().name,
      id: snapshot.val().id,
      visits: snapshot.val().visits
    });
    // console.log(artistsBase);
    if (topCount < topNum) {
      defaultIds.push({
          id:snapshot.val().id,
          name: snapshot.val().name
      })   
      topCount++;
      
      var aTag = $("<a>").addClass("dropdown-item").attr("target", "_blank")
                       .attr("href", youTubeUrl + snapshot.val().name.replace(" ", "+") + "+music")
                       .text(snapshot.val().name)  

      // $("#favorite").prepend(myBtn);
      $("#dropDown").prepend(aTag);
      
      // displayArtist("#image-view", snapshot.val);
      // $("#topList").append($("<li>").text("hhhk"));

      $("#topList").append($("<li>").text(snapshot.val().name + "(" + snapshot.val().visits * (-1) +" searches)"));
    } 
  })

     setTimeout( async function() {
     console.log(defaultIds);
     topArtist.name = defaultIds[2].name;
     topArtist.id = defaultIds[2].id;
     response = await getGiphy(topArtist);
     topArtist.img = response.data[0].images.fixed_width_still.url;
     console.log(topArtist);
     response = await getAlbums(topArtist);
     saveAlbumInfo(response);
     displayArtist("#image-view", topArtist);
     updateStatus(topArtist);
  
  }, 2000)


  
   

  // Add Top 5 buttons

  //   for (i = (artistsBase.length -1); (i>=0) && (i > artistsBase.length - 5) ; i -- ) {




  //   }

  //   // Find all artists
  //   $("#add-artist").on("click", function () {
  //  addTopArtist();
  //   })

}) // end of document ready
