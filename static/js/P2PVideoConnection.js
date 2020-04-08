class EventDispatcher{
  constructor(){
    this.event_listeners = {};
  }
	trigger(eventName, args){
		var l = this.event_listeners[eventName];
		if(!l) return;
		for(var i=0; i < l.length; i++){
			l[i](args);
		}
	}
	on(eventName, callback){
		if(!this.event_listeners[eventName]) this.event_listeners[eventName] = []
		this.event_listeners[eventName].push(callback);
	}
}

let config = { rtc : { "iceServers": [{ "urls": ["stun:stun.l.google.com:19302"] }] },
        sdpConstraints : {"offerToReceiveAudio":true,"offerToReceiveVideo":true }
        };

export class P2PVideoConnection extends EventDispatcher{
  constructor(localVideoStream){
    super()
  	this.rtcConnection = null;
    this.localVideoStream = localVideoStream
  }
  createConnection(){
    let RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    this.rtcConnection = new RTCPeerConnection(config.rtc);
    this.rtcConnection.addStream(this.localVideoStream);
    this.rtcConnection.onaddstream = (e) => {
      this.trigger('remoteVideo', {stream:e.stream});
      console.log('stream received');
    }
    this.rtcConnection.onicecandidate = (e) => {
      if (!this.rtcConnection || !e || !e.candidate) return;
        let candidate = e.candidate;
        this.trigger("rtc-negotiation-msg-prepared", {"iceCandidate": candidate});
    }
  }
  offer(){
    this.createConnection();
    let offer = this.rtcConnection.createOffer(sdp => { // start negotiation with the remote peer
      this.rtcConnection.setLocalDescription(sdp);
      this.trigger("rtc-negotiation-msg-prepared", {"offer": sdp});
    }, function(err){console.log(err); }, {"offerToReceiveAudio":true,"offerToReceiveVideo":true });
  }
  close(){
  	if(this.rtcConnection) this.rtcConnection.close();
  	this.rtcConnection = null;
  }
  handleNegotationMessage(message){
    console.log(message);
    if('iceCandidate' in message)
      this.rtcConnection.addIceCandidate(new RTCIceCandidate(message.iceCandidate));
    if('answer' in message)
      this.rtcConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
    if('offer' in message){
      this.createConnection();
      this.rtcConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
      this.rtcConnection.createAnswer((sdp) => { // send an answer
        this.rtcConnection.setLocalDescription(sdp);
        this.trigger("rtc-negotiation-msg-prepared", {"answer": sdp});
      }, function(err){console.log(err); }, { mandatory: { OfferToReceiveAudio: true, OfferToReceiveVideo: true } });
    }
  }

}
