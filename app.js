// var artURL = "https://musixmatchcom-musixmatch.p.rapidapi.com/wsr/1.1/artist.search?s_artist_rating=desc&q_artist=coldplay&page=1&page_size=5";
// var APIKey  = "06c8a00ef2d73494bffa451b45e887bc";   Jason's API key
var APIKey = "5eafbf6ac992f091396b3310ca394d21";
var corsUrl = "https://cors-anywhere.herokuapp.com/";
var artistUrl = "https://api.musixmatch.com/ws/1.1/artist.search?q_artist=";
var albumUrl = "https://api.musixmatch.com/ws/1.1/artist.albums.get?artist_id=";

//
// proxy on my system --- zane
// corsUrl = 'http://localhost:8080/';
//
// giphy Example: http://api.giphy.com/v1/gifs/search?q=pig&api_key=453HTooEbMcLLHXzAyh12R3VvCGhpBWI
var giphyKey = "453HTooEbMcLLHXzAyh12R3VvCGhpBWI";
var giphyUrl = "https://api.giphy.com/v1/gifs/search?q=";

// https://www.youtube.com/results?search_query=Lady+Gaga+music
var youTubeUrl = "https://www.youtube.com/results?search_query=";

// https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&q=lady+gaga+music&type=video+&videoDefinition=high&key=AIzaSyDDw868uWMQLgWbAeDORWY1sE9W2e_43fU
// jason's YouTube API    AIzaSyCWrgUE53Bca3gl5m-8RxiCXJXwhU0pwE4

youTubeSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&q=";
// youTubeAPI = "&type=video+&videoDefinition=high&key=AIzaSyDDw868uWMQLgWbAeDORWY1sE9W2e_43fU";
youTubeAPI = "&type=video+&videoDefinition=high&key=AIzaSyCWrgUE53Bca3gl5m-8RxiCXJXwhU0pwE4"         //jason

var artists = [];
var topArtist = {};


var topNum = 12;
var topCount = 0;
var numCol = 3;
var iAdded = 0;

var ref = 'zane/'
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

var artists = [];
var artistInfo = {
  key: "",
  name: "",
  id: "",
  visits: ""
};


function updateArtist(artist) {
  var i = artists.findIndex(obj => obj.id === artist.id);
  //
  // if not new update
  if (i >= 0) {
    console.log(artists[i]);
    artist.visits = --artists[i].visits;  // need to update artist also for firebase
    
    database.ref(ref).child(artists[i].key).remove();
    artists.splice(i, 1);
  } else {
    //
    // newly created
    //
    artist.visits = -1;   
    i = artists.length;
    artists.push(artist);
  }

  var k = database.ref(ref).push(
    artist
  );
}

function displayArtist(tag, artist) {
  nameSearched = artist.name + "(" + -artist.visits + ")";

  var twt = ""
  if (artist.twitter !== "") {

    twt = "twitter:  " +
      "<a href=" + artist.twitter + "  target = _blank>" + artist.twitter + "</a>";
  }
  var albumList = "";
  artist.albums.forEach(function(e) {
    if (e.relDate.trim() !== "") {
      albumList = albumList + "<li>" + e.name + "(" + e.relDate + ")</li>";
    } else {
      albumList = albumList + "<li>" + e.name + "</li>";
    }
    
  })

  if ((iAdded % numCol) === 0) { // add a new row
    newTag = $(`<div class="row" id="program-added-${iAdded}">`);
    $(tag).append(newTag);
  } else {
    newTag = $(`#program-added-${parseInt(iAdded/numCol)*numCol}`);
  }
  iAdded++;
  var htmlCode = `
  <div class="col-md-4">
                    <div class="card">
                        <img class="card-img-top"
                            src="${artist.img}"
                            alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title">${nameSearched}</h5>
                            <p class="card-text">${twt}</p>
                            <ul>
                            ${albumList}
                            </ul>
                            <a href="${artist.youTube}" target="popup" class="btn btn-primary">Play</a>
                        </div>
                    </div>
                </div>
  `;
  // check out button , no use now
  // <a href="#" class="btn btn-primary">Play</a>
  $(newTag).prepend($(htmlCode));
}


async function getYouTube(topArtist) {
  return $.ajax({
    url: corsUrl + youTubeSearch + topArtist.name.replace(" ", "+") + "+music" + youTubeAPI,
    method: "GET",
    dataType: "json"
  })
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
  albums.forEach(function(albm) {
    albmName = albm.album.album_name;

    if (topArtist.albums.findIndex(o => o.name === albmName) < 0) { // Album Name not found
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

  if (artists.indexOf(topArtist.name) < 0) {
    artists.push(topArtist.name);
    // var myBtn = ($("<button>").addClass("TopArtist")
    //   .val(topArtist.name).text(topArtist.name));
    var aTag = $("<a>").addClass("dropdown-item").attr("target", "_blank")
      .attr("href", youTubeUrl + topArtist.name.replace(" ", "+") + "+music")
      .text(topArtist.name)

    // $("#favorite").prepend(myBtn);
    $("#dropDown").prepend(aTag);
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
  });
  return topArtist.rating;
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

async function addArtist(artistName) {
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

    var youTubeUrl;
    try {
      response = await getYouTube(topArtist);
      youTubeUrl = response.items[0].id.videoId;
    } catch (error) {
      //
      // safety when api limit reached
      //
      youTubeUrl = 'https://www.youtube.com/watch?v=aEb5gNsmGJ8';
    }


    topArtist.youTube = "https://www.youtube.com/watch?v=" + youTubeUrl;


    topArtist.visits = -1;

    updateArtist(topArtist);
    displayArtist("#image-view", topArtist);
    updateStatus(topArtist);

  } catch (error) {
    console.log("ERROR: ", error)
  };
}



$(document).ready(function() { //  Beginning of jQuery

  // YouTube Video

  $("#add-artist").on("click", function(event) {
    event.preventDefault();
    var artistName = $("#input-artist").val().trim();
    topCount = topNum
    $("#status").text("Searching " + artistName + " ....");
    addArtist(artistName);
  })

  $(document).on("click", ".TopArtist", function() {
    var name = $(this).val();
    addTopArtist(name);

  })

  database.ref(ref).orderByChild("visits").on("child_added", function(snapshot) {
    var artist = snapshot.val();

    artist.key = snapshot.key;
    artists.push(artist);

    if (topCount < topNum) {
      displayArtist("#image-view", artist);

      topCount++;

      var aTag = $("<a>").addClass("dropdown-item").attr("target", "_blank")
        .attr("href", youTubeUrl + snapshot.val().name.replace(" ", "+") + "+music")
        .text(snapshot.val().name)

      $("#topList").append($("<li>").text(snapshot.val().name + "(" + snapshot.val().visits * (-1) + " searches)"));

      // Jason Added
      
      console.log(snapshot.val());
      var topArtist = {
        name: snapshot.val().name,
        twitter: snapshot.val().twitter,
        visits: snapshot.val().visits,
        img: snapshot.val().img,
        youTube: snapshot.val().youTube,
        albums: snapshot.val().albums
      } 

      // displayArtist("#image-view", topArtist);
      updateStatus(topArtist);
      artists.push(topArtist);

    }
  });
});
