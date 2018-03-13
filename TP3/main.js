/*********************************************************************
 *  Quand le document est prêt, cette fonction est active.
 *  Elle appelle toutes les autres fonction pour charger la page.
 *********************************************************************/
$(document).ready(function(){
	var socketClient = new WebSocket("ws://log2420-nginx.info.polymtl.ca/chatservice?username=Jacob est ma pute");
	
	socketClient.onmessage = function(event){
		console.log(event);
		console.log(event.data);
	}

	socketClient.onopen = function(e){
		console.log(e)
	}
	
})

