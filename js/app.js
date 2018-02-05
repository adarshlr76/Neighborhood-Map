
var map;
var markers = [];
var geocoder;

var all_locations = [
    {place: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
    {place: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
    {place: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
    {place: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
    {place: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
    {place: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];
/*
var all_locations = [
	{place : 'Statue of Liberty'},
	{place : ' Central Park'},
	{place : ' Rockefeller Center and Top of the Rock Observation Deck'},
	{place : 'Metropolitan Museum of Art'},
	{place : 'Broadway and the Theater District'},
	{place : 'Empire State Building'},
	{place : ' 9/11 Memorial and Museum'},
	{place : 'Times Square'},
	{place : 'Brooklyn Bridge'},
	{place : 'Fifth Avenue'},
	{place : 'Grand Central Terminal'}
];
*/
function initMap() {
    var bounds = new google.maps.LatLngBounds();
    var position ;
    var title ;

    //var bounds = window.mapBounds;            // current boundaries of the map window

    // Create a styles array to use with the map.
    
       

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
    });
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('filter-to-area-text'));
    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);



   /*
   for an array of locations 
   fires off Google place searches for each location. 
   */
   // Iterates through the array of locations, creates a search object for each location


    for (var i = 0; i < all_locations.length; i++) {
    	position = all_locations[i].location;
    	title = all_locations[i].place;

       	createMarker(position,title);
       	//console.log(all_locations[i].place);
 		bounds.extend(markers[i].position);
      
    }
    map.fitBounds(bounds);

  

}


function createMarker(position,title) {



  	var largeInfowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        title : title,
        position: position,
        animation: google.maps.Animation.DROP,
        map: map
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
    });
    
}

function displayInfoWindow(marker) {
	var largeInfowindow = new google.maps.InfoWindow();
	populateInfoWindow(marker,largeInfowindow);


}


// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
        });
    }
}

var Location = function(data) {

	this.place = ko.observable(data.place);

}

var ViewModel = function() {
	self = this;
	
	this.placesList = ko.observableArray([]);
		this.markerId = ko.observable(0);

	this.currentLocation = ko.observable(this.placesList()[0]);

	this.itemClick = function (Location) {
		for (var i = 0; i < all_locations.length; i++) {
			if(Location.place() === all_locations[i].place) {
				console.log(i);
				displayInfoWindow(markers[i]);

				//this.markerId(i);
				break;
			}
		}

		//this.markerId(this.count() + 1);
	
	}
	// Creating click for the list item
    


	for (var i = 0; i < all_locations.length; i++) {

	//all_locations.forEach( function (placeDtls) {
		self.placesList().push(new Location(all_locations[i]));
		//geocodeAddress(placeDtls.place);
		//console.log(placeDtls);
	}


}
ko.applyBindings(new ViewModel());