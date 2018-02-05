
    var map;
    var markers = [];

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
     	        // Create a styles array to use with the map.
    
       
        var uluru = {lat: 40.7413549, lng: -73.99802439999996};
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: uluru,
      
          title:"Google office"

        });
        var geocoder = new google.maps.Geocoder();

        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < all_locations.length; i++) {
          // Get the position from the location array.
          var position =  geocodeAddress(all_locations[i].place, geocoder);

          var title = all_locations[i].place;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            //icon: defaultIcon,
            id: i
          });
          // Push the marker to our array of markers.
          markers.push(marker);
/*          // Create an onclick event to open the large infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
          // Two event listeners - one for mouseover, one for mouseout,
          // to change the colors back and forth.
          marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
          marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });*/
        }


        

     }

      function geocodeAddress(address, geocoder) {
        //var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            return results[0].geometry.location;
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
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

	this.selectedLocation = function(selectedPlace){
		self.currentLocation(selectedPlace);
	}

}
ko.applyBindings(new ViewModel());