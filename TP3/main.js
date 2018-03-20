var channel;
var socketClient;

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

function sendMessage(){
	var messageBox = document.getElementById('message');
	var message = new Message("onMessage", channel, messageBox.value, null, null);
	socketClient.send(JSON.stringify(message));
}

function receiveMessage(event){
	console.log(JSON.parse(event.data));
	if (JSON.parse(event.data).eventType == "updateChannelsList"){
		channel = JSON.parse(event.data).data[0].id;
		document.getElementById("status").innerHTML = "Status: Connected!";
	}
	else{
		$('#messageHistory').append(
			'<div class="message">' 
			+ JSON.parse(event.data).sender 
			+ ": \t"
			+ JSON.parse(event.data).data
			+ '</div>');
	}
}