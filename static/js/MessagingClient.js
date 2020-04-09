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

export class MessagingClient extends EventDispatcher{
  constructor(basePath, pollingInterval){
    super()
    this.basePath = basePath;
    this.pollingInterval = pollingInterval || 2000;
  }
  register(){
    return this.post(this.basePath + '/register').then(response => {
      this.id = response.id;
      this.trigger('ready')
      this.callPoll = () => {this.poll()}
      this.timer = setInterval(this.callPoll, this.pollingInterval)
    })
  }
  send(to, data){
    return this.post(this.basePath + '/send', {from: this.id, to, data:data})
  }
  broadcast(data){
    return this.post(this.basePath + '/broadcast', {from: this.id, data:data})
  }
  unregister(){
    return this.post(this.basePath + '/unregister', {id: this.id})
  }

  poll(){
    return this.post(this.basePath + '/pop', {id: this.id}).then(msgs => {
      this.trigger("messages", msgs)
      return msgs
    })
  }
  post(path, data){
    data = data || {}
    return new Promise((resolve, reject) => {
      let req = new XMLHttpRequest()
      req.addEventListener('load', () => resolve(JSON.parse(req.responseText)))
      req.open('POST', path)
      req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      req.send(JSON.stringify(data))
    })
  }
}
