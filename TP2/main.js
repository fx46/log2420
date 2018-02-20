$(document).ready(function(){
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
  //var suggests = ["hello", "world"];
  //$('#inputElem').autocomplete( "option", "delay" );

  var xmlhttp = new XMLHttpRequest();
  var map;
  initMap();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
    	  var myObj = JSON.parse(this.responseText);  
        var paragrapheTest = document.getElementById('test');
        paragrapheTest.innerHTML = "Premiere station dans le JSON: ";
        paragrapheTest.innerHTML += myObj.stations[0].s;
        console.log(myObj);
      }
  	
  };

  xmlhttp.open("GET", "https://secure.bixi.com/data/stations.json", true);
  xmlhttp.send();
});

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.51345, lng: -73.650674},
    zoom: 11
  });
}
