$(document).ready(function(){













































var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        
var table = document.getElementById("table");
for(var i = 1; i < table.rows.length; i++){
  table.rows[i].cells[1].innerHTML = 
    myObj.output1[i].concentration + " " + myObj.output1[i].libelle;
}

table.rows[0].cells[0].innerHTML = myObj.formule;
table.rows[1].cells[0].innerHTML = "0.00000     mol";

    }
};
xmlhttp.open("GET", "data-output.json", true);
xmlhttp.send();

});

