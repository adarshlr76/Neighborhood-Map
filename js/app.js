
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
// Foursquare API Url parameters in global scope
var baseUrl = "https://api.foursquare.com/v2/venues/",
	fsParam = "venues/search?ll=",
    fsClient_id = "client_id=0W2YAEP0XHAE554XVKJQFI0TRCKI2DZMJR5L5VHZ1ZGZCWMP",
    fsClient_secret = "&client_secret=3PDIQU1WQEZKOODKMP0KUJRJZE3A0KPRLAZ35P5UJL05ECL2",
	fsVersion = "&v=20161507";
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13
    });


    var bounds = new google.maps.LatLngBounds();
    var contentString;
    var largeInfowindow;
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < all_locations.length; i++) {
        // Get the position from the location array.
        var position = all_locations[i].location;
        var title = all_locations[i].place;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        

        largeInfowindow = new google.maps.InfoWindow();
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
          bounds.extend(markers[i].position);
    }
        // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
}



// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {

        infowindow.marker = marker;
        infowindow.setContent('<div id="info-window-content">' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
        	infowindow.setMarker = null;
        });

    }
}

var Location = function(data) {

	this.place = ko.observable(data.place);
	this.visible = ko.observable(true);

	/*this.showMarker = ko.computed(function() {
		if(this.visible() === true) {
			this.marker.setMap(map);
		} else {
			this.marker.setMap(null);
		}
		return true;
	}, this);*/

}

var ViewModel = function() {
	self = this;
	this.searchTerm = ko.observable("");
	this.placesList = ko.observableArray([]);
	
//		this.markerId = ko.observable(0);

	//this.currentLocation = ko.observable(this.placesList()[0]);

	this.filteredList = ko.computed( function() {
		var filter = self.searchTerm().toLowerCase();
		if (!filter) {
			self.placesList().forEach(function(locationItem){
				locationItem.visible(true);
			});
			return self.placesList();
		} else {
			return ko.utils.arrayFilter(self.placesList(), function(locationItem) {
				console.log(locationItem.place());

				var string = locationItem.place().toLowerCase();
				var result = (string.search(filter) >= 0);
				locationItem.visible(result);
				return result;
			});
		}
	}, self);

	this.itemClick = function (location) {
		for (var i = 0; i < all_locations.length; i++) {
			if(location.place() === all_locations[i].place) {
				//console.log(i);

	 			google.maps.event.trigger(markers[i], "click");

				//this.markerId(i);
				break;
			}
		}

		//this.markerId(this.count() + 1);
	
	}
	// Creating click for the list item
    


	for (var i = 0; i < all_locations.length; i++) {

		self.placesList().push(new Location(all_locations[i]));


	}
	//$("#info-window-content").html("Hello World");





	
	/*self.getFoursquareData = ko.computed(function(){
	 	all_locations.forEach(function(x) {
	 	 	//console.log(x.location.lat);
	 	 	var foursquareUrl = baseUrl 
	 	 	 					+ fsParam 
	 	 	 					+ x.location.lat + "," + x.location.lng 
	 	 	 					+ fsClient_id 
	 	 	 					+ fsClient_secret 
	 	 	 					+ fsVersion;
	 	 	$.ajax({
          		type: "GET",
          		url: foursquareUrl,
          		dataType: "json",
          		cache: false,
          		success: function(data) {
	            	var response = data.response ? data.response : "";
	            	var venue = response.venue ? data.venue : "";
	            	console.log(response.venue["name"]);
	            	//return response.venue["name"];
	            	self.fsList().push(response.venue["name"]);

	                x.name = response.venue["name"];
	                x.shortUrl = response.venue["shortUrl"];
	                x.photoUrl = response.venue.bestPhoto["prefix"] + "height150" +
	                response.venue.bestPhoto["suffix"];
          		}
			});
	 	});
	 });
*/

}
ko.applyBindings(new ViewModel());