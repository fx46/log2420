$(document).ready(function(){

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);  
     	var noeud = document.getElementById('table');
       
      var headerRow = document.createElement('tr');
      noeud.appendChild(headerRow);       // Row pour le header
     	var header = document.createElement('th');
     	header.innerHTML = myObj.formule;   // Va chercher le header
     	noeud.appendChild(header);
       
      var emptyHeader = document.createElement('th');
     	noeud.appendChild(emptyHeader);
      
     	for (var i = 0; i < myObj.output1.length; i++){  
        var row = document.createElement('tr')
        noeud.appendChild(row);
        row.appendChild(document.createElement('td'));  //on cree une colonne vide
         
     		var par = document.createElement('td');
      	par.innerHTML = myObj.output1[i].libelle;
      	row.appendChild(par);
  	  }
      
      console.log(noeud);
      noeud.childNodes[3].childNodes[0].innerHTML = "test";
      
    }
};
xmlhttp.open("GET", "data-output.json", true);
xmlhttp.send();

});

