/*********************************************************************
 *  Quand le document est prêt, cette fonction est active.
 *  Elle appelle toutes les autres fonction pour charger la page.
 *********************************************************************/
$(document).ready(function(){
	var socketClient = new WebSocket("ws://log2420-nginx.info.polymtl.ca/chatservice?username=FX");
	
	var channel;
	
	socketClient.onmessage = function(event){
		console.log(JSON.parse(event.data).data);
		channel = JSON.parse(event.data).data[0].id;
	}

	socketClient.onopen = function(e){
		console.log(e)
	}
	
	setTimeout(()=>{
		var message = new Message("onMessage",channel,"henlo",null,null);
		socketClient.send(JSON.stringify(message));
	}, 500);
})
