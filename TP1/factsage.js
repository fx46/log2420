$(document).ready(function(){

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);  
      var table = document.getElementById("table");
     	var noeud = document.getElementById('table');
     	var header = document.createElement('th');
       
     	header.innerHTML = myObj.formule; <!-- Va chercher le header -->
     	noeud.appendChild(header);

     	for (var i = 0; i < myObj.output1.length; i++){
     		var par = document.createElement('tr');
      	par.innerHTML = myObj.output1[i].libelle;
      	noeud.appendChild(par);
  	  }
    }
};
xmlhttp.open("GET", "data-output.json", true);
xmlhttp.send();

});

