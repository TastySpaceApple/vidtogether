# Web Conferencing With WebRTC

This is a WebRTC based video conferencing app (client + server). The server side is node.js, and the client side is plain javascript.

## Architecture

To create a conferencing app using just P2P connections, we need to create a lot of connections! One connection to each participant from each participant, and a connection to the messaging server which allows them to negotiate the P2P connection.

![a sketch of the architecture for the webRTC based video conferencing webapp](https://github.com/TastySpaceApple/vidtogether/raw/master/webrtcvideoconference-sketch.jpg "a sketch of the architecture for the webRTC based video conferencing webapp")

## Thanks

thank you! <3
