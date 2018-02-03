var Location = function(data) {

	this.place = ko.observable(data.place);

}

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
var ViewModel = function() {
	self = this;
	
	this.placesList = ko.observableArray([]);
	all_locations.forEach( function (placeDtls) {
		self.placesList().push(new Location(placeDtls));
		//console.log(placeDtls);
	});
	
	this.currentLocation = ko.observable(this.placesList()[0]);

	this.selectedLocation = function(selectedPlace){
		self.currentLocation(selectedPlace);
	}

}
ko.applyBindings(new ViewModel());