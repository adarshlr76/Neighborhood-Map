var map;
var markers = [];
var infowindow;
//var geocoder;



// Foursquare API Url parameters in global scope
var baseUrl = "https://api.foursquare.com/v2/",
    fsParam = "venues/search?ll=",
    fsClient_id = "&client_id=0W2YAEP0XHAE554XVKJQFI0TRCKI2DZMJR5L5VHZ1ZGZCWMP",
    fsClient_secret = "&client_secret=3PDIQU1WQEZKOODKMP0KUJRJZE3A0KPRLAZ35P5UJL05ECL2",
    fsVersion = "&v=20180206";



var Location = function(data) {

    this.place = ko.observable(data.place);
    this.markerId = ko.observable(0);



};

var ViewModel = function() {
    self = this;
    this.searchTerm = ko.observable("");
    this.placesList = ko.observableArray([]);

    // get response from four sqaure api, to be populated in the infowindow.
    this.getFoursquareData = function(data, iw) {

        var name = data.place;
        var lat = data.location.lat;
        var long = data.location.lng;
        var URL = "";
        var street = "";
        var city = "";
        var contentString = "";

        var foursquareUrl = baseUrl + fsParam + lat + "," + long + fsClient_id + fsClient_secret + fsVersion;
        $.getJSON(foursquareUrl).done(function(data) {
            var results = data.response.venues[0];
            URL = results.url;
            if (typeof URL === 'undefined') {
                URL = "";
            }
            street = results.location.formattedAddress[0];
            city = results.location.formattedAddress[1];
            //used template literals feature of ES6
            contentString = `<div class="info-window-content"><div class="title"><b> ${name} </b></div><div class="content"><a href="${URL}"> ${URL} </a></div><div class="content"> ${street}</div><div class="content"> ${city} </div>`;
            infowindow.setContent(contentString);


        }).fail(function() {
            alert("There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.");
        });



    };


    // function to filter details in input box. knockoutjs functions are used.
    this.filteredList = ko.computed(function() {
        var filter = self.searchTerm().toLowerCase();
        if (!filter) {
            self.placesList().forEach(function(locationItem) {
                markers[locationItem.markerId()].setMap(map);
            });
            return self.placesList();
        } else {
            return ko.utils.arrayFilter(self.placesList(), function(locationItem) {

                var string = locationItem.place().toLowerCase();
                var result = (string.search(filter) >= 0);
                if (result === true) {
                    markers[locationItem.markerId()].setMap(map);
                } else {
                    markers[locationItem.markerId()].setMap(null);
                }
                return result;
            });
        }
    }, self);

    // code to handle click event in te item list.
    this.itemClick = function(location) {
        for (var i = 0; i < all_locations.length; i++) {
            if (location.place() === all_locations[i].place) {
                google.maps.event.trigger(markers[i], "click");
                break;
            }
        }
    };

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    this.populateInfoWindow = function() {

        var index = this.id;

        markers[index].setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            markers[index].setAnimation(null);
        }, 2100);

        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != this) {

            infowindow.marker = this;
            infowindow.setContent('<div>' + this.title + '</div>');
            self.getFoursquareData(all_locations[index], infowindow);


            infowindow.open(this.map, this);

            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.setMarker = null;
            });

        }
    };

    this.initMap = function() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 40.7413549,
                lng: -73.9980244
            },
            zoom: 13
        });


        var bounds = new google.maps.LatLngBounds();
        var marker;

        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < all_locations.length; i++) {
            // Get the position from the location array.
            var position = all_locations[i].location;
            var title = all_locations[i].place;
            // Create a marker per location, and put into markers array.
            marker = new google.maps.Marker({
                map: map,
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: i
            });

            infowindow = new google.maps.InfoWindow();

            // Push the marker to our array of markers.
            markers.push(marker);
            google.maps.event.addListener(marker, "click", self.populateInfoWindow);
            bounds.extend(markers[i].position);
        }
        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);
    };

    // Creating click for the list item



    for (var i = 0; i < all_locations.length; i++) {

        self.placesList().push(new Location(all_locations[i]));
        self.placesList()[i].markerId(i);


    }
    this.initMap();
};

function start() {
    ko.applyBindings(new ViewModel());
}
// Ehandling errors while loading te map from google api
function googleMapsErrorHandler() {
    console.log('Error: Google maps API has not loaded');
    $('body').prepend('<p id="map-error">Sorry we are having trouble loading google maps API, please try again in a moment.</p>');
}

function toggleNav() {
    var x = document.getElementById("list-sidebar");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }

}