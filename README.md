# EventedWebSocketMouse
Event Driven Web-Socket Mouse Sharing Thing

A (hopefully remarkably small) JavaScript-only curiosity.
A client and server written in JS with the express puspose of realtime mouse position sharing.

Each user's mouse it represented by a `div`.
Each div is individually re-positioned using the style attribute.

## To use

1. Clone the source:
```
git clone https://github.com/portsoc/EventedWebSocketMouse.git
```
2. Install the dependencies
```
npm install
```
3. Start the server
```
npm test
```
4. Visit the client address as prompted.  If it says `Visit: http://10.128.112.216:8080
` then point your browser at `http://10.128.112.216:8080`
