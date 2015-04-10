// Google Maps map object:
var map;
// Array to hold all past events markers:
var pastEventsMarkers = [];
// Array to hold all upcoming events markers:
var upcomingEventsMarkers = [];


// Function to run upon DOM load:
var initialize = function() {

  // Add event handling to the submit button:
  $("#search-form").submit(function(event) {
      // Prevent the default behavior of the button, hijack it for our use:
      event.preventDefault();
      // Send off processing of the form's values:
      processSubmit();
      // Clear the map every submit:
      deleteMarkers(pastEventsMarkers);
      deleteMarkers(upcomingEventsMarkers);
    }
  );

  // Add special event handling for the button group to control the map overlays:
  $("#overlay-past-btn").bind("click", function() {
    // Show only past event markers:
    clearMarkers(upcomingEventsMarkers);
    showMarkers(pastEventsMarkers);
  });

  $("#overlay-both-btn").bind("click", function() {
    // Show both type of markers:
    showMarkers(pastEventsMarkers);
    showMarkers(upcomingEventsMarkers);
  });

  $("#overlay-upcoming-btn").bind("click", function() {
    // Show only upcoming event markers:
    clearMarkers(pastEventsMarkers);
    showMarkers(upcomingEventsMarkers);
  });  

  // Google Maps intitial objects:
  var myOptions = {        
    center: new google.maps.LatLng(30.44, 7.73),
    zoom: 2,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  // Attach map object to canvas div
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
};


// This function will get the values held in the form's fields and send their values to
// an AJAX function which will query the last.fm API server:
function processSubmit() {
  // Get the forms values:
  var artist = $("#artist-query").val();

  // Send artist and query options off to getEvents function for further handling:
  getEvents(artist);
};

/**
 * Queries the last.fm API servers for a JSON object containing the past and upcoming events for the given artist
 * @access  public
 * @param   string  The name of the artist to be queried
 * @return  none
 */
var getEvents = function(a){

  var artist = a;

  // Object literal to hold the GET data for artist.getpastevents query:
  var get_data = {
    // Requested format
    format: 'json',
    // API method to be called:
    method: 'artist.getpastevents',
    // last.fm API key:
    api_key: '723395f5cba286de53607cb701ea1ce1',
    // Artist we want to get info on:
    artist: artist,
    // Autocorrect artist name so that the last.fm API deals with getting the closest matching artist:
    autocorrect: 1
  };

  // AJAX call to last.fm API servers for past events
  $.ajax({
    type: 'GET',
    url: 'http://ws.audioscrobbler.com/2.0/',
    data: get_data,
    format: 'json',
    success: function(data){
      parseEvents(data, 1);
    }
  });

  // Object literal to hold the GET data for artist.getevents query:
  var get_data = {
    // Requested format
    format: 'json',
    // API method to be called:
    method: 'artist.getevents',
    // last.fm API key:
    api_key: '723395f5cba286de53607cb701ea1ce1',
    // Artist we want to get info on:
    artist: artist,
    // Autocorrect artist name so that the last.fm API deals with getting the closest matching artist:
    autocorrect: 1
  };

  // AJAX call to last.fm API servers for upcoming events
  $.ajax({
    type: 'GET',
    url: 'http://ws.audioscrobbler.com/2.0/',
    data: get_data,
    // Send the JSON object off to be parsed, flag of 2 means parse for upcoming events
    success:  function(data){
      parseEvents(data, 2);
    }
  });
}; // End function getEvents


/**
 * Function parses a JSON object returned from the last.fm API servers
 * @access  public
 * @param   object  JSON object containing the requested events
 * @param   int     flag to determine whether it is upcoming, or past events which are being parsed. 1 = past, 2 = upcoming.
 *                  
 */
var parseEvents = function(data, flag){
    var timer = 1; // Variable to be used with timeout function:
    console.log(data);

    /**
    * Iterate through the events object finding the desired data for each event object
    */
    $.each(data.events.event, function(i,event){
        var latitude = event.venue.location["geo:point"]["geo:lat"];
        var longitude = event.venue.location["geo:point"]["geo:long"];
        /**s
         * Only create a new marker if the event has latitude and longitude data.
         */
        if(latitude && longitude) {
            var googleMapsLocation = new google.maps.LatLng(latitude, longitude);
            var eventCity = event.venue.location.city;
            var eventDate = event.startDate;
            var eventVenueName = event.venue.name;
            var eventUrl = event.url;
            var eventImageUrl = event.image[3]['#text'];

            // Make use of set timeout to stagger the dropping of the markers:
            setTimeout(function() {
                // If flag is 1, add marker to past events, else if it's 2, add to upcoming events:
                if( flag === 1 ) {
                    addMarker(pastEventsMarkers, flag, googleMapsLocation, eventCity, eventDate, eventVenueName, eventUrl, eventImageUrl);
                } else if( flag === 2 ) {
                    addMarker(upcomingEventsMarkers, flag, googleMapsLocation, eventCity, eventDate, eventVenueName, eventUrl, eventImageUrl);
                }
            },(timer*100));
        }
        // Increment timer to space the time to wait to drop markers out sufficiently:
        timer = timer + 1;
    
        
    });
}; // End function parseEvents


/**
 * Adds a new marker to the map and animates it dropping
 * @access  public
 * @param   array   The specified array of markers to add the new marker to.
 * @param   int     Flag for whether a past event or upcoming event is being added
 * @param   object  A google maps location object
 * @param   string  City where the event is taking place
 * @param   string  Date of the event
 * @param   string  Venue of the event
 * @param   string  URL of the last.fm page for the event
 * @param   string  URL of the an image of the event
 */
var addMarker = function(markerArray, flag, location, city, date, venue, url, image){
    // Stores the location of the image data:
    var eventImage = image;
    // Stores the marker image to be used:
    var markerImage;
    // Stores the hover text for each marker:
    var titleText;
    // Google Maps Marker object:
    var marker;
    // Google Maps Infowindow object:
    var infowindow;


    // If the flag is set to 1, we want to create blue icons for past events
    // Else if it's two we want to set 
    if(flag === 1) {
        markerImage = 'img/music_live_blue.png';
    } else if(flag === 2){
        markerImage = 'img/music_live_orange.png';
    }
    // Create marker hover title text:
    titleText =  venue + ' ' + date;
    // Create new marker:
    marker = new google.maps.Marker({
        map: map,
        position: location,
        icon: markerImage,
        animation: google.maps.Animation.DROP,
        title: titleText
    });

    // The HTML markup for the Infowindow:
    var infowindowContent = '<div class="infowindow well">' +
                            '<img class="infowindow-thumbnail" src="' +eventImage+ '"/>' +
                            '<div infowindow-information>' +
                              '<h3><i class="icon-headphones"></i> '+venue+'</h3>' +
                              '<h4><i class="icon-calendar"></i> '+date+'</h4>' + 
                              '<a class="btn btn-info" href="' +url+ '" target="_blank">Last.fm event page</a>' +
                            '</div>' +
                            '</div>';

    // Create the Infowindow object:
    var infowindow = new google.maps.InfoWindow({
        content: infowindowContent
    });

    // Add the click event listener to the marker:
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
    });

    // Add a listener to the map object so that all infowindows are closed upon clicking it:
    google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
    });

    // Push onto appropriate markers array:
    markerArray.push(marker);
};


// Function to clear the markers of a given array from the Google maps object: 
var clearMarkers = function(markerArray){
  // Check if the array exists:
  if(markerArray){
    // Set the map attribute of each marker to 'null', clearing it from the map:
    for(i in markerArray){
      markerArray[i].setMap(null);
    }
  }
};


// Function to show the markers of a given array from the Google maps object: 
var showMarkers = function(markerArray){
    // Check if the array exists:
    if(markerArray){
        // Set the map attribute of each marker to the map object, showing it on the map:
        for(i in markerArray){
            markerArray[i].setMap(map);
        }
    }
};


// Function to delete the markers of a given array and from the Google maps object: 
var deleteMarkers = function(markerArray){
    // Check if the array exists:
    if(markerArray){
        // Set the map attribute of each marker to 'null', clearing it from the map:
        for(i in markerArray){
            markerArray[i].setMap(null);
        }
        // Delete array:
        markerArray.length = 0;
    }
};

