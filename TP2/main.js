$(document).ready(function(){
	var jsonFile;
	getJson();
	
	$("#ContenuListeStation").css("display", "none");
	changerOnglet();
	
	var map;
	initMap();
	
	$('#tableau2').DataTable();
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
					document.getElementById('velosDisponibles').innerHTML = jsonFile.stations[i].ba;
					document.getElementById('veloIndisponibles').innerHTML = jsonFile.stations[i].bx;
					document.getElementById('bornesDisponibles').innerHTML = jsonFile.stations[i].da;
					document.getElementById('borneIndisponibles').innerHTML = jsonFile.stations[i].dx;
					
					if(jsonFile.stations[i].ba == 0) 
						document.getElementById('velosDisponibles').style.backgroundColor = "red";
					else	
						document.getElementById('velosDisponibles').style.backgroundColor = "#4CAF50";
					
					if(jsonFile.stations[i].da == 0) 
						document.getElementById('bornesDisponibles').style.backgroundColor = "red";
					else	
						document.getElementById('bornesDisponibles').style.backgroundColor = "#4CAF50";
					
					if(jsonFile.stations[i].su){
						document.getElementById('suspendue').innerHTML = "Oui";
						document.getElementById('suspendue').style.backgroundColor = "red";
					}
					else{
						document.getElementById('suspendue').innerHTML = "Non";
						document.getElementById('suspendue').style.backgroundColor = "#4CAF50";
					}
					
					if(jsonFile.stations[i].m){
						document.getElementById('horsService').innerHTML = "Oui";
						document.getElementById('horsService').style.backgroundColor = "red";
					}
					else{
						document.getElementById('horsService').innerHTML = "Non";
						document.getElementById('horsService').style.backgroundColor = "#4CAF50";
					}
					
					if(jsonFile.stations[i].b){
						document.getElementById('bloquee').innerHTML = "Oui";
						document.getElementById('bloquee').style.backgroundColor = "red";
					}
					else{
						document.getElementById('bloquee').innerHTML = "Non";
						document.getElementById('bloquee').style.backgroundColor = "#4CAF50";
					}
					
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
