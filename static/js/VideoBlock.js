import {P2PVideoConnection} from '/js/P2PVideoConnection.js';

export class VideoBlock {
  constructor(options){
      this.options = options || {};
      this.createDOM();
  }
  createDOM(){
    this.element = document.createElement("div")
    this.element.className = "video-block";
    this.element.innerHTML = ["lt","rt","rb","lb"].map(cornerName => {
      return `<span class="corner corner--${cornerName}"></span>`
    }).join('');
    let videoEl = document.createElement("video");
    //videoEl.srcObject = e.stream;
    if(this.options.muted)
      videoEl.setAttribute("muted", "true");
    //videoEl.play()
    this.element.appendChild(videoEl)
    document.body.appendChild(this.element)
    this.element.addEventListener('mousedown', e => this.startDrag(e))
  }

  startDrag(e){
    //rect = this.element.getBoundingClientRect()
    this.dragStartX = this.element.offsetLeft;
    this.dragStartY = this.element.offsetTop;
    this.dragStartWidth = this.element.offsetWidth;
    this.dragStartHeight = this.element.offsetHeight;
    this.dragStartMouseX = e.clientX;
    this.dragStartMouseY = e.clientY;
    this.callMoveDrag = e => this.moveDrag(e);
    this.callEndDrag = e => this.endDrag(e);
    if(e.target.classList.contains("corner")){
      this.dragType = e.target.classList[1].substring("corner--".length);
    } else {
      this.dragType = "move"
    }
    document.addEventListener("mousemove", this.callMoveDrag)
    document.addEventListener("mouseup", this.callEndDrag)
  }
  moveDrag(e){
    let moveX = e.clientX - this.dragStartMouseX;
    let moveY = e.clientY - this.dragStartMouseY;
    if(this.dragType == "move") {
      this.element.style.left = this.dragStartX + moveX + "px";
      this.element.style.top = this.dragStartY + moveY + "px";
    } else {
      if(this.dragType[0] == "r"){
        this.element.style.width = moveX + this.dragStartWidth + "px";
      }
      if(this.dragType[0] == "l"){
        this.element.style.left = this.dragStartX + moveX + "px";
        this.element.style.width = -moveX + this.dragStartWidth + "px";
      }
      if(this.dragType[1] == "b"){
        this.element.style.height = moveY + this.dragStartHeight + "px";
      }
      if(this.dragType[1] == "t"){
        this.element.style.top = this.dragStartY + moveY + "px";
        this.element.style.height = -moveY + this.dragStartHeight + "px";
      }
    }
  }
  endDrag(e){
    document.removeEventListener("mousemove", this.callMoveDrag)
    document.removeEventListener("moseup", this.callEndDrag)
  }

  setStream(stream){
    this.element.querySelector("video").srcObject = stream;
    this.element.querySelector("video").play()
  }
  remove(){
    this.element.remove();
    this.conn.close();
  }
  createP2PConnection(to, messagingClient){
    this.conn = new P2PVideoConnection(window.localVideoStream)
    this.conn.on('rtc-negotiation-msg-prepared', message => {
      messagingClient.send(to, {"type":"rtc-negotiation-msg", "negotiation-msg":message})
    })
    this.conn.on("remoteVideo", e => {
      this.setStream(e.stream);
    })
    this.conn.on("disconnected", e => {
      this.remove();
    })
  }

  handleP2PNegotationMessage(message){
    this.conn.handleNegotationMessage(message);
  }

  startP2PNegotiation(){
    this.conn.offer();
  }
}
