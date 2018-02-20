$(document).ready(function(){
	
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
    	  var myObj = JSON.parse(this.responseText);  
        //var paragrapheTest = document.getElementById('test');
        //paragrapheTest.innerHTML = "Premiere station dans le JSON: ";
        //paragrapheTest.innerHTML += myObj.stations[0].s;
        //console.log(myObj);
      }
  };

  xmlhttp.open("GET", "https://secure.bixi.com/data/stations.json", true);
  xmlhttp.send();
  
  var suggests = ["hello", "world", "mots", "test", "sdfsdf"];
  initAutocomplete(suggests);
  
  var map;
  initMap();
  
});

function initAutocomplete(suggests) {
	$('#inputElem').autocomplete({
		source : suggests
	});
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.51345, lng: -73.650674},
    zoom: 11
  });
}