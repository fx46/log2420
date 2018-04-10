var socketClient;
var channels = [];
var currentChannel;
var username = "FX";

/*********************************************************************
 *  Quand le document est prêt, cette fonction est active.
 *  Elle appelle toutes les autres fonction pour charger la page.
 *********************************************************************/
$(document).ready(function(){
	document.getElementById("status").innerHTML = "Status: Connecting...";
	socketClient = new WebSocket("ws://log2420-nginx.info.polymtl.ca/chatservice?username=" + username);
	document.getElementById("UserNameTitre").innerHTML = username;
	
	socketClient.onmessage = function(event){
		receiveMessage(event);
	}	
})

$(function sendMessage() {
	$('form').on('submit', function (event) {
		event.preventDefault();
		var messageBox = document.getElementById('message');
		var message = new Message("onMessage", currentChannel, messageBox.value, null, null);
		socketClient.send(JSON.stringify(message));

		//clear message entry after send
		messageBox.value = "";
	});
});

function receiveMessage(event) {
	console.log(JSON.parse(event.data));
	
	if (JSON.parse(event.data).eventType == "updateChannelsList") {
		updateChannelsList(event);
	}
	
	else if ( JSON.parse(event.data).sender == username ) {
		showSentMessage(event);
	}
	
	else {
		showReceivedMessage(event) 
	}

	//scroll to bottom
	$('#messageHistory').stop ().animate ({
		scrollTop: $('#messageHistory')[0].scrollHeight
	});
}

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

function leaveChannel() {
	//on rejoint le channel par defaut (général)
	changeChannel(0);
}

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
