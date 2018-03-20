var channel;
var socketClient;
//TODO: creer tableau de channels

/*********************************************************************
 *  Quand le document est prêt, cette fonction est active.
 *  Elle appelle toutes les autres fonction pour charger la page.
 *********************************************************************/
$(document).ready(function(){
	document.getElementById("status").innerHTML = "Status: Connecting...";
	socketClient = new WebSocket("ws://log2420-nginx.info.polymtl.ca/chatservice?username=FX");
	
	socketClient.onmessage = function(event){
		receiveMessage(event);
	}	
})

$(function sendMessage() {
	$('form').on('submit', function (event) {
		event.preventDefault();
		var messageBox = document.getElementById('message');
		var message = new Message("onMessage", channel, messageBox.value, null, null);
		socketClient.send(JSON.stringify(message));

		//clear message entry after send
		messageBox.value = "";
	});
});

function receiveMessage(event) {
	console.log(JSON.parse(event.data));
	if (JSON.parse(event.data).eventType == "updateChannelsList"){
		channel = JSON.parse(event.data).data[0].id;
		for(var i = 0; i < JSON.parse(event.data).data.length; i++) {
			var channelFromList = '<div class="channel">' 
								+ JSON.parse(event.data).data[i].name
								+ '</div>';
			$('#channelsWrapper').append(channelFromList);
			
			//update affichage du channel courrant
			if (JSON.parse(event.data).data[i].joinStatus) {
				document.getElementById('currentChannel').innerHTML = "Current channel: " + JSON.parse(event.data).data[i].name;
			}
			//TODO: ajouter le channel au tableau de channels
		}
		document.getElementById("status").innerHTML = "Status: Connected!";
	}
	
	else {
		var message = '<div class="message">' 
					+ JSON.parse(event.data).sender 
					+ ": \t"
					+ JSON.parse(event.data).data
					+ '<div class=date>'
					+ Date().toString().substring(0,25);
					+ '</div>'
					+ '</div>';
		$('#messageHistory').append(message);
	}
	
	//scroll to bottom
	$('#messageHistory').stop ().animate ({
		scrollTop: $('#messageHistory')[0].scrollHeight
	});
}

function joinChannel(adresse) {
	var message = new Message("onJoinChannel ", adresse, null, null, null);
	socketClient.send(JSON.stringify(message));
}

var channelButton = document.getElementsByClassName("channel")[0]
document.getElementsByClassName("channel")[0].onclick = function() {
	alert("test");
	//TODO: se servir du tableau de channels pour obtenir l'adresse
};
