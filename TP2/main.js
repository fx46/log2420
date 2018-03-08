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
	
	$("#ContenuListeStation").css("display", "none");
  	$(".select,.none-select")
  		.bind("click", function() {
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
		
	var map;
	initMap();
});

function initAutocomplete(suggests) {
	$('#inputElem').autocomplete({
		/*
		source: function(request, response) {
			var results = $.ui.autocomplete.filter(suggests, request.term);
			response(results.slice(0, 20));
			//select: function( event, ui ) {} // lors de la sélection d'une proposition
			$("#Localisation").update(request.term);
		}
		*/
        source: function( request, response ) {
            var results = $.ui.autocomplete.filter(suggests, request.term);
			response(results.slice(0, 20));
        },
        select: function( event, ui ) {
			$("#Localisation").text(ui.item.label);
        }
	});
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.51345, lng: -73.650674},
    zoom: 11
  });
}
