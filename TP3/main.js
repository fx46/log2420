var socketClient;
var channels = [];
var currentChannel;
var username = "";

/*********************************************************************
 *  Quand le document est prêt, cette fonction est active.
 *  Elle appelle toutes les autres fonction pour charger la page.
 *********************************************************************/
$(document).ready(function(){
	login();
	setupWebSocket();
})

/*********************************************************************
 *  Demande à l'utilisateur de rentrer son nom d'utilisateur.
 *	L'utilisateur peut changer son nom d'utilisateur s'il clique sur
 *	l'icone de profil.
 *********************************************************************/
function login() {
	document.getElementById("status").innerHTML = "Status: Connecting...";
	
	username = prompt("Please enter your user name.");
	
	while(!username.replace(/\s/g, '').length){	
		//Tant que l'username ne contient rien d'autre que des espaces.
		username = prompt("Please enter a valid user name.");
	}
}

/*********************************************************************
 *  Initialise le WebSocket avec le nom d'utilisateur. Quand le socketClient
 *	recoit un message, la fonction receiveMessage sera appellé avec l'évennement.
 *********************************************************************/
function setupWebSocket() {
	socketClient = new WebSocket("ws://log2420-nginx.info.polymtl.ca/chatservice?username=" + username);
	document.getElementById("UserNameTitre").innerHTML = username;
	
	socketClient.onmessage = function(event){
		receiveMessage(event);
	}	
}

/*********************************************************************
 *  Permet à l'utilisateur d'envoyer un message au serveur lorsqu'il a 
 *	écrit un message et appuyé sur la touche entrer.
 *********************************************************************/
$(function sendMessage() {
	$('form').on('submit', function (event) {
		event.preventDefault();
		var messageBox = document.getElementById('message');		
		if (messageBox.value.replace(/\s/g, '').length) {
			//On vérifie que le message ne contient pas seulement des espaces 
			//ou n'est pas vide.
			var message = new Message("onMessage", currentChannel, messageBox.value, null, null);
			socketClient.send(JSON.stringify(message));
		}

		//clear message entry after send
		messageBox.value = "";
	});
});

/*********************************************************************
 *  Permet à l'utilisateur de voir les messages que d'autres 
 *	utilisateurs ont envoyés, ou les messages envoyés par le serveur.
 *	Si le message concerne l'utilisateur, une notification sera jouée.
 *********************************************************************/
function receiveMessage(event) {
	console.log(JSON.parse(event.data));
	
	if (JSON.parse(event.data).eventType == "updateChannelsList") {
		//Si on doit mettre à jour la liste des channels.
		updateChannelsList(event);
	}
	
	else if (JSON.parse(event.data).eventType == "onError") {
		//En cas d'une erreur.
		alert(JSON.parse(event.data).data);
	}
	
	else if ( JSON.parse(event.data).sender == username ) {
		//Message envoyé par l'utilisateur.
		showSentMessage(event);
	}
	
	else if (JSON.parse(event.data).eventType == "onMessage"){
		//Message envoyé par un autre utilisateur.
		showReceivedMessage(event);
		notification();
	}

	//scroll to bottom
	$('#messageHistory').stop ().animate ({
		scrollTop: $('#messageHistory')[0].scrollHeight
	});
}

/*********************************************************************
 *  Affiche à l'utilisateur un message qu'un autre utilisateur 
 *	a envoyé.
 *********************************************************************/
function showReceivedMessage(event) {
	var message = '<div class="messageReceived">' 
				+ '<div class="sender">'
				+ JSON.parse(event.data).sender 
				+ '</div>'
				+ '<div class="message bubbleReceived">'
				+ JSON.parse(event.data).data
				+ '</div>'
				+ '<div class=date>'
				+ Date().toString().substring(0,25);
				+ '</div>'
				+ '</div>';
	$('#messageHistory').append(message);
}

/*********************************************************************
 *  Affiche à l'utilisateur un message qu'il a lui-même envoyé.
 *********************************************************************/
function showSentMessage(event) {
	var message = '<div class="messageSent">' 
				+ '<div class="message bubbleSent" style="float: right;">'
				+ JSON.parse(event.data).data
				+ '</div>'
				+ '<div class="date" style="float: right; clear:both;">'
				+ Date().toString().substring(0,25);
				+ '</div>'
				+ '</div>';
	$('#messageHistory').append(message);
}

/*********************************************************************
 *  Joue une notification sonore, est appellée lorsqu'on recoit
 *	un message concernant l'utilisateur.
 *********************************************************************/
function notification(){
	var notification = new Audio("sounds/notification.mp3");
	notification.play();
}

/*********************************************************************
 *  Permet à l'utilisateur de changer de channel.
 *********************************************************************/
function changeChannel(i) {
	if(currentChannel != channels[i]){
		//leave old channel
		var message = new Message("onLeaveChannel", currentChannel, null, null, null);
		socketClient.send(JSON.stringify(message));
		
		//delete old messages
		var el = document.getElementById('messageHistory');
		while ( el.firstChild ) el.removeChild( el.firstChild );
		
		//join new channel
		message = new Message("onJoinChannel", channels[i], null, null, null);
		socketClient.send(JSON.stringify(message));
	}
}

/*********************************************************************
 *  Quitte le channel courant et rejoint le channel par défaut (général)
 *********************************************************************/
function leaveChannel() {
	//on rejoint le channel par defaut (général)
	changeChannel(0);
}

/*********************************************************************
 *  Permet à l'utilisateur de créer un nouveau channel, puis rejoint
 *	ce channel automatiquement après sa création.
 *********************************************************************/
function addChannel() {
	leaveChannel();
	
    var newChannel = "";
	newChannel = prompt("Please enter the channel's name");
	
	if(!newChannel.replace(/\s/g, '').length){	
		alert("This is not a valid name for a channel.");
		return;
	}
	
	//essaye d'ajouter le channel
	message = new Message("onCreateChannel", null, newChannel, null, null);
	socketClient.send(JSON.stringify(message));
}

/*********************************************************************
 *  Met à jour la liste des différents channels avec les informations
 *	que le serveur envoit dans un message de type "updateChannelsList".
 *	Ajoute du code HTML pour ajouter une image à côté du nom du 
 *	channel pour permettre à l'utilisateur de le quitter ou de le 
 *	rejoindre.
 *********************************************************************/
function updateChannelsList(event) {
	var table = document.getElementById('channelsTable');
	
	//delete old channels list
	document.getElementById('channelsTable').innerHTML = "";
	channels = [];
	
	//add channels to channels list
	for(var i = 0; i < JSON.parse(event.data).data.length; i++) {
		
		var row = table.insertRow(i);
		var cell = row.insertCell(0);
		
		if (i == 0) {
			//channel général par defaut
			cell.innerHTML = '<img src="images/icon-star.png" alt="Rejoindre le channel" class="iconeChannel" onclick="changeChannel(' 
						+ i + ')">'
						+ '<div class="channel" >' 
						+ JSON.parse(event.data).data[i].name
						+ '<div id="defaultChannel" >' 
						+ "defaut"
						+ '</div>'
						+ '</div>';
		}
		
		else if (JSON.parse(event.data).data[i].joinStatus){
			cell.innerHTML = '<img src="images/icon-subtract.png" alt="Rejoindre le channel" class="iconeChannel" onclick="leaveChannel()">'
							+ '<div class="channel" >' 
							+ JSON.parse(event.data).data[i].name
							+ '</div>';
		}
		
		else if (!JSON.parse(event.data).data[i].joinStatus){
			cell.innerHTML = '<img src="images/icon-plus.png" alt="Rejoindre le channel" class="iconeChannel" onclick="changeChannel(' 
							+ i + ')">'
							+ '<div class="channel" >' 
							+ JSON.parse(event.data).data[i].name
							+ '</div>';
		}
		
		//update affichage du channel courrant
		if (JSON.parse(event.data).data[i].joinStatus) {
			currentChannel = JSON.parse(event.data).data[i].id;
			document.getElementById('currentChannel').innerHTML = "Current channel: " + JSON.parse(event.data).data[i].name;
		}
		
		channels.push(JSON.parse(event.data).data[i].id);
	}
	
	document.getElementById("status").innerHTML = "Status: Connected!";
}
