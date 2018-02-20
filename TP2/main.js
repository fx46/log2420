$(document).ready(function(){
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj = JSON.parse(this.responseText);  
			var suggests = [myObj.stations.length];
			for(var i = 0; i < myObj.stations.length; i++){
				suggests[i] = myObj.stations[i].s;
			}
			initAutocomplete(suggests);
		}
	};

	xmlhttp.open("GET", "https://secure.bixi.com/data/stations.json", true);
	xmlhttp.send();

	var map;
	initMap();
});

function initAutocomplete(suggests) {
	$('#inputElem').autocomplete({
		source : suggests
		//select : function(event, ui){ // lors de la sélection d'une proposition
		//	
		//},
		//maxShowItems : 5,
		//minLength : 3
	});
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.51345, lng: -73.650674},
    zoom: 11
  });
}