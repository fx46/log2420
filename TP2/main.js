var jsonFile;
var map;

/*********************************************************************
 *  Quand le document est prêt, cette fonction est active.
 *  Elle appelle toutes les autres fonction pour charger la page.
 *********************************************************************/
$(document).ready(function(){
	getJsonAndSetData();
	$("#ContenuListeStation").css("display", "none");
	pageAcceuil();
	changerOnglet();
	initMap();
})

/*********************************************************************
 *  Fonction qui fait une demande d'information (fichier .json).
 * 	Elle appelle ensuite les fonctions qui ont besoins de ces informations.
 *********************************************************************/
function getJsonAndSetData(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			jsonFile = JSON.parse(this.responseText);  
			var suggests = [jsonFile.stations.length];
			for(var i = 0; i < jsonFile.stations.length; i++){
				suggests[i] = jsonFile.stations[i].s;
			}
			initAutocomplete(suggests);
			initDataTable();
		}
	};
	xmlhttp.open("GET", "https://secure.bixi.com/data/stations.json", true);
	xmlhttp.send();
}

/*********************************************************************
 *  Fonction qui initialise la dataTable.
 *********************************************************************/
function initDataTable(){
	$('#tableau2').DataTable({
		data: jsonFile.stations, 
		columns: [
			{"data": "id"},
			{"data": "s"},
			{"data": "ba"},
			{"data": "da"},
			{"data": "b"},
			{"data": "su"}
		],
		language: {
			processing:     "Traitement en cours...",
			search:         "Rechercher&nbsp;:",
			lengthMenu:    "Afficher _MENU_ &eacute;l&eacute;ments",
			info:           "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
			infoEmpty:      "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
			infoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
			infoPostFix:    "",
			loadingRecords: "Chargement en cours...",
			zeroRecords:    "Aucun &eacute;l&eacute;ment &agrave; afficher",
			emptyTable:     "Aucune donnée disponible dans le tableau",
			paginate: {
				first:      "Premier",
				previous:   "Pr&eacute;c&eacute;dent",
				next:       "Suivant",
				last:       "Dernier"
			},
			aria: {
				sortAscending:  ": activer pour trier la colonne par ordre croissant",
				sortDescending: ": activer pour trier la colonne par ordre décroissant"
			}
		}
	});
	columns.adjust();
}

/*********************************************************************
 *  Fonction qui s'occupe de l'affichage de la page d'acceuil
 *********************************************************************/
function pageAcceuil(){
	$("#Velo,#Accueil").bind("click", function(){
	var carte = $(".Carte");
	var liste = $(".Liste");
	carte.addClass("select");
	carte.removeClass("non-select");
	liste.addClass("non-select");
	liste.removeClass("select");
	$("#ContenuCarteStation").css("display", "inline");
	$("#ContenuListeStation").css("display", "none");
	})
}

/*********************************************************************
 *  Fonction qui gère le changement d'onglet quand un des boutons 
 8	est cliqué.
 *********************************************************************/
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

/*********************************************************************
 *  Fonction qui initialise les suggestions (autocompletion) quand 
 *	on écrit des lettres dans la boite de recherche. 
 *********************************************************************/
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
					changeMapCenter(jsonFile.stations[i].la, jsonFile.stations[i].lo, jsonFile.stations[i].s);
					
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

/*********************************************************************
 *  Fonction qui initialise la map (Google Map).
 *********************************************************************/
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 45.51345, lng: -73.650674},
		zoom: 11
	});
}

/*********************************************************************
 *  Fonction qui change la position de centre sur la map, selon
 * 	une lattitude et longitude. Elle Place ensuite un marqueur 
 *	à cette position.
 *********************************************************************/
function changeMapCenter(lat, lng, name) {
	initMap();
	var myLatLng = {lat, lng};
	var name = name;
	map.setCenter(new google.maps.LatLng(myLatLng));
    map.setZoom(16);
	var marker = new google.maps.Marker({
		position: myLatLng,
        map: map,
        title: name,
    });
}
