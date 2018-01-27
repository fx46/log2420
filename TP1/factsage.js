$(document).ready(function(){

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);  
     	var noeud = document.getElementById('table');
       
		var headerRow = document.createElement('tr');
		noeud.appendChild(headerRow);       // Row pour le header
     	var header = document.createElement('th');
     	header.innerHTML = myObj.formule;   // On va chercher le header
		header.colSpan = "3";
		header.style = "color:cyan"
     	noeud.appendChild(header);
      
		var nbGasIdeal = 5;		//Selon le fichier data-output.json
	  
		//Pour chaque gas ideal, on ajoute les informations dans des nouvelles cases.
     	for (var i = 0; i < nbGasIdeal; i++){  
			var row = document.createElement('tr')
			noeud.appendChild(row);
			var par = document.createElement('td')
			par.style = "color:red; border-bottom:0px; border-top:0px;";
			row.appendChild(par);  //on cree une colonne vide
			 
			var par = document.createElement('td');
			if(i == 0) par.innerHTML += " ( ";
			else par.innerHTML += " + ";
			par.innerHTML += myObj.output1[i].concentration;
			par.innerHTML += " " + myObj.output1[i].libelle;
			if(i == nbGasIdeal - 1) par.innerHTML += ") ";
			row.appendChild(par);
			
			var par2 = document.createElement('td')
			par2.style = "color:red; border-bottom:0px; border-top:0px;";
			row.appendChild(par2);  //on cree une colonne vide
		}
		
		var row = document.createElement('tr')
		noeud.appendChild(row);
		var par = document.createElement('td')
		par.style = "color:red; border-bottom:0px; border-top:0px;";
		row.appendChild(par);  //on cree une colonne vide
		
		//Ajout des conditions
		var par = document.createElement('td');		
		par.innerHTML += "( " + myObj.output1[0].conditions.temperature.valeur;
		par.innerHTML += " " + myObj.output1[0].conditions.temperature.unite;
		par.innerHTML += ", " + myObj.output1[0].conditions.pression.valeur;
		par.innerHTML += " " + myObj.output1[0].conditions.pression.unite;
		par.innerHTML += ", " + myObj.output1[0].conditions.type;
		par.innerHTML += ", a = " + myObj.output1[0].conditions.a + ")";
		row.appendChild(par);
		par.style="padding:0 20px;";
		
		var par2 = document.createElement('td')
		par2.style = "color:red; border-bottom:0px; border-top:0px;";
		row.appendChild(par2);  //on cree une colonne vide
		
		//Ajout des autres éléments (pas gas parfait) dans le tableau
     	for (var j = nbGasIdeal; j < myObj.output1.length; j++){	
				if(myObj.output1[j].concentration.toFixed(4) != "0.0000"){
				var row = document.createElement('tr')
				noeud.appendChild(row);
				var par = document.createElement('td')
				par.style = "color:red; border-bottom:0px; border-top:0px;";
				row.appendChild(par);  //on cree une colonne vide
				 
				var par = document.createElement('td');
				par.innerHTML += " + ";
				par.innerHTML += myObj.output1[j].concentration.toFixed(4);
				par.innerHTML += " mol " + myObj.output1[j].libelle;
				row.appendChild(par);
				
				var par2 = document.createElement('td')
				par2.style = "color:red; border-bottom:0px; border-top:0px;";
				row.appendChild(par2);  //on cree une colonne vide
				
				var row = document.createElement('tr')
				noeud.appendChild(row);
				var par = document.createElement('td')
				par.style = "color:red; border-bottom:0px; border-top:0px;";
				row.appendChild(par);  //on cree une colonne vide
				
				//Ajout des conditions
				var par = document.createElement('td');		
				par.innerHTML += "( " + myObj.output1[j].conditions.temperature.valeur;
				par.innerHTML += " " + myObj.output1[j].conditions.temperature.unite;
				par.innerHTML += ", " + myObj.output1[j].conditions.pression.valeur;
				par.innerHTML += " " + myObj.output1[j].conditions.pression.unite;
				par.innerHTML += ", " + myObj.output1[j].conditions.type;
				par.innerHTML += ", a = " + myObj.output1[j].conditions.a.toFixed(4) + ")";
				row.appendChild(par);
				par.style="padding:0 20px;";
				
				var par2 = document.createElement('td')
				par2.style = "color:red; border-bottom:0px; border-top:0px;";
				row.appendChild(par2);  //on cree une colonne vide
			}
		}
		
		//On ajoute les informations de la deuxieme table du fichier data-output.json
		var noeud2 = document.getElementById('table2');
		
		var headerRow2 = document.createElement('tr');
		noeud2.appendChild(headerRow2);       // Row pour le header
     	var header2 = document.createElement('th');
     	header2.innerHTML = "The cutoff concentration has been specified to 1.000E-70. Data on 1 product species identified with 'X' have not been extrapolated in computing the phase assemblage";
		header2.colSpan = "7";
     	noeud2.appendChild(header2);
		
		
		
		var row = document.createElement('tr')
		noeud2.appendChild(row);
		var par = document.createElement('td');
		par.innerHTML = myObj.output2[0].valeur.toExponential();
		par.innerHTML += "(" + myObj.output2[0].unite + ") ";
		par.innerHTML += myObj.output2[0].libelle;
		row.appendChild(par);
		
		for (var i = 0; i < myObj.output2.length; i++){  
			var par = document.createElement('td');
			par.innerHTML = myObj.output2[i].valeur.toExponential();
			par.innerHTML += "(" + myObj.output2[i].unite + ") ";
			par.innerHTML += myObj.output2[i].libelle;
			row.appendChild(par);
		}
		
		//Ajustement des contours des cellules.
		noeud.rows[1].cells[0].style = "color:red; border-bottom:0px; border-top:0px;";
		noeud.rows[16].cells[0].style = "color:red; border-top:0px;";
		noeud.rows[16].cells[2].style = "color:red; border-top:0px;";
		noeud.rows[1].cells[0].innerText = "0.0000 mol";
		
		//ajout des commentaires:
		noeud.rows[3].cells[0].innerText = "0 mol denotes no";
		noeud.rows[4].cells[0].innerText = "product gas. ";
		noeud.rows[7].cells[0].innerText ="Note the pure stable ";
		noeud.rows[8].cells[0].innerText ="solids. activity = 1.0 ";
		noeud.rows[14].cells[0].innerText ="All phases are ";
		noeud.rows[15].cells[0].innerText ="ordered w.r.t. ";
		noeud.rows[16].cells[0].innerText ="activity. ";
		
		noeud.rows[2].cells[2].innerText ="These are mole fractions.";
		noeud.rows[3].cells[2].innerText ="Although no Fe(g) is formed.";
		noeud.rows[4].cells[2].innerText ="P(Fe)eq = 0.279e-63 atm. ";
		noeud.rows[5].cells[2].innerText ="Total P=0.21821e-19 atm.";
		noeud.rows[7].cells[2].innerText ="6 mol Cu ";
		noeud.rows[9].cells[2].innerText ="4.5 mol Fe ";
		noeud.rows[11].cells[2].innerText ="2 mol C ";
		noeud.rows[13].cells[2].innerText ="1 mol MgO  ";
		noeud.rows[15].cells[2].innerText ="0.5 mol Fe3O4 ";
    }
	
};

xmlhttp.open("GET", "data-output.json", true);
xmlhttp.send();

});

