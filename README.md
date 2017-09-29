# EventedWebSocketMouse
Event Driven Web-Socket Mouse Sharing Thing

A (hopefully remarkably small) JavaScript-only curiosity.
A client and server written in JS with the express puspose of realtime mouse position sharing.

Each user's mouse it represented by a `div`.
Each div is individually re-positioned using the style attribute.

## To use

Clone the source:
```
git clone https://github.com/portsoc/EventedWebSocketMouse.git
```

Change into the newly created folder:
```
cd EventedWebSocketMouse
```

Install the dependencies
```
npm install
```

Start the server
```
npm test
```
Visit the client address as prompted.  If it says `Visit: http://10.128.112.216:8080
` then point your browser at `http://10.128.112.216:8080`
