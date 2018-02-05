
    var map;
    var markers = [];
    var bounds;

	var all_locations = [
		{place : 'Discovery Docks Apartments'},
		{place : 'Nandos Restaurant'},
		{place : 'Canary Wharf Tube Station'},
		{place : 'One Canada Square'},
		{place : 'The O2'},
		{place : 'Tesco Express'},
		{place : 'Firezza Pizza'},
		{place : 'The Breakfast Club'},
		{place : 'Shake Shack'},
		{place : 'Asda Superstore'},
		{place : 'Pizza Express'}
	];

function initMap() {
   	bounds = new google.maps.LatLngBounds();

    // Create a styles array to use with the map.
    
       
    var uluru = {lat: 40.7413549, lng: -73.99802439999996};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: uluru,
      
        title:"Google office"

    });

}



var Location = function(data) {

	this.place = ko.observable(data.place);

}

var ViewModel = function() {
	self = this;
	
	this.placesList = ko.observableArray([]);


	all_locations.forEach( function (placeDtls) {
		self.placesList().push(new Location(placeDtls));
		//geocodeAddress(placeDtls.place);
		//console.log(placeDtls);
	});
	
	this.currentLocation = ko.observable(this.placesList()[0]);

	
	/*this.selectedLocation = function(selectedPlace){
		self.currentLocation(selectedPlace);
	}*/

}
ko.applyBindings(new ViewModel());