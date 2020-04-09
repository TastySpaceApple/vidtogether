const uuid = require('uuid');

fakedb = {"clients": {}}
module.exports = {
  register: function(){
    id = uuid.v4()
    fakedb["clients"][id] = {"messages": []}
    return id
  },
  sendMessage: function(from, to, data){
    if(!fakedb["clients"][to]) return false;
    fakedb["clients"][to].messages.push({from, data})
    return true;
  },
  popMessages: function(to){
    if(!fakedb["clients"][to]) return [];
    msgs = fakedb["clients"][to].messages;
    fakedb["clients"][to].messages = []
    return msgs
  },
  broadcast: function(from, data){
    for(clientId in fakedb["clients"]){
      if(clientId != from)
        this.sendMessage(from, clientId, data);
    }
  },
  unregister: function(id){
    delete fakedb["clients"][id]
  }
}
