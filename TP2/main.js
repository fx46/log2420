$(document).ready(function(){
	var jsonFile;
	getJson();
	
	$("#ContenuListeStation").css("display", "none");
	changerOnglet();
	
	var map;
	initMap();
});

function getJson(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			jsonFile = JSON.parse(this.responseText);  
			var suggests = [jsonFile.stations.length];
			for(var i = 0; i < jsonFile.stations.length; i++){
				suggests[i] = jsonFile.stations[i].s;
			}
			initAutocomplete(suggests, jsonFile);
		}
	};
	xmlhttp.open("GET", "https://secure.bixi.com/data/stations.json", true);
	xmlhttp.send();
}

function changerOnglet(){
	$(".select,.none-select").bind("click", function() {
		var noneSelect = $(".select");
		var select = $(this);
		noneSelect.addClass("none-select") 
		noneSelect.removeClass("select");
		select.addClass("select");
		select.removeClass("none-select");

		if($(this).html() == "Carte des stations"){
			$("#ContenuCarteStation").css("display", "inline");
			$("#ContenuListeStation").css("display", "none");
		}
		else {
			$("#ContenuListeStation").css("display", "inline");
			$("#ContenuCarteStation").css("display", "none");
		}
	})	
}

function initAutocomplete(suggests) {
	$('#inputElem').autocomplete({
        source: function( request, response ) {
            var results = $.ui.autocomplete.filter(suggests, request.term);
			response(results.slice(0, 20));
        },
        select: function( event, ui ) {
			$("#Localisation").text(ui.item.label);
			for (var i = 0; i < jsonFile.stations.length; i++) {	
				//Cherche la station dans le JSON par son nom
				if (ui.item.label == jsonFile.stations[i].s) {
					changeMapCenter(jsonFile.stations[i].la, jsonFile.stations[i].lo);
					document.getElementById('idStation').innerHTML = jsonFile.stations[i].id;
					break;
				}
			}
        }
	});
}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 45.51345, lng: -73.650674},
		zoom: 11
	});
}

function changeMapCenter(lat, lng) {
	var myLatLng = {lat, lng};
	map.setCenter(new google.maps.LatLng(myLatLng));
    map.setZoom(16);
	var marker = new google.maps.Marker({
		position: myLatLng,
        map: map,
    });
}
