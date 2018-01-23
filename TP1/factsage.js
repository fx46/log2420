$(document).ready(function(){

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);  
     	var noeud = document.getElementById('table');
       
     	var header = document.createElement('th');
       
     	header.innerHTML = myObj.formule;   // Va chercher le header
     	noeud.appendChild(header);
      
     	for (var i = 0; i < myObj.output1.length; i++){  
        noeud.appendChild(document.createElement('tr'));
        noeud.appendChild(document.createElement('td'));  //on cree une colonne vide
         
     		var par = document.createElement('td');
      	par.innerHTML = myObj.output1[i].libelle;
      	noeud.appendChild(par);
  	  }
      
      console.log(noeud);
      noeud.childNodes[3].innerHTML = "test";
      
    }
};
xmlhttp.open("GET", "data-output.json", true);
xmlhttp.send();

});

