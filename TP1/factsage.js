$(document).ready(function(){

//$("#table").html("lel");
/*
var json = '{ "formule": "Mg +  3 Cu2O +  2 Fe3C = ?"}';
//var json = loadJSON(data-output.json);
var obj = JSON.parse(json);
document.getElementById("table").innerHTML = obj.formule;
*/
/*
$(document).ready(function(){
    $("#formule").load("data-output.json");
});
*/


var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
       	var noeud = document.getElementById('table');

       	var header = document.createElement('th');
       	header.innerHTML = myObj.formule; <!-- Va chercher le header -->
       	noeud.appendChild(header);

       	for (var i = 0; i < 3; i++){
       		var par = document.createElement('tr');
        	par.innerHTML = myObj.output1[i].libelle;
        	noeud.appendChild(par);
    	}


    }
};
xmlhttp.open("GET", "data-output.json", true);
xmlhttp.send();


});

