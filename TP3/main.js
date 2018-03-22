var socketClient;
var channels = [];
var currentChannel;

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
		var message = new Message("onMessage", currentChannel, messageBox.value, null, null);
		socketClient.send(JSON.stringify(message));

		//clear message entry after send
		messageBox.value = "";
	});
});

function receiveMessage(event) {
	
	console.log(JSON.parse(event.data));
	
	if (JSON.parse(event.data).eventType == "updateChannelsList"){
		updateChannelsList(event);
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

function changeChannel(i) {
	if(currentChannel!= channels[i]){
		//leave old channel
		var message = new Message("onLeaveChannel", currentChannel, null, null, null);
		socketClient.send(JSON.stringify(message));
		
		//delete old messages
		var el = document.getElementById('messageHistory');
		while ( el.firstChild ) el.removeChild( el.firstChild );

		//join new channel
		currentChannel = channels[i];
		message = new Message("onJoinChannel", currentChannel, null, null, null);
		socketClient.send(JSON.stringify(message));
	}
}

function updateChannelsList(event) {
	//delete old channels list
	var el = document.getElementById('channelsWrapper');
	while ( el.firstChild ) el.removeChild( el.firstChild );
	
	//add channels to channels list
	for(var i = 0; i < JSON.parse(event.data).data.length; i++) {
		var channelFromList = '<div class="channel" onclick="changeChannel(' + i + ')">' 
							+ JSON.parse(event.data).data[i].name + '</div>';
		$('#channelsWrapper').append(channelFromList);
		
		//update affichage du channel courrant
		if (JSON.parse(event.data).data[i].joinStatus) {
			currentChannel = JSON.parse(event.data).data[i].id;
			console.log("lel");
			document.getElementById('currentChannel').innerHTML = "Current channel: " + JSON.parse(event.data).data[i].name;
		}
		channels.push(JSON.parse(event.data).data[i].id);
	}
	document.getElementById("status").innerHTML = "Status: Connected!";
}
