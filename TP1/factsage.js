$(document).ready(function(){

//$("#table").html("lel");

var json = '{ "formule": "Mg +  3 Cu2O +  2 Fe3C = ?"}';
//var json = loadJSON(data-output.json);
var obj = JSON.parse(json);
document.getElementById("table").innerHTML = obj.formule;

/*
$(document).ready(function(){
    $("#formule").load("data-output.json");
});
*/

/*
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        document.getElementById("table").innerHTML = myObj.formule;
    }
};
xmlhttp.open("GET", "data-output.json", true);
xmlhttp.send();
*/

});

