/// An excessively commented example.

// configuration
const port = 8888;

// libraries
const express = require('express');
const http = require('http');
const ws = require('ws');
const ip = require("ip");

// create an express application
// http://expressjs.com/en/api.html
const app = express();

// create an http server that uses express for handling requests
// https://nodejs.org/api/http.html
const server = http.createServer(app);

// Create a WebSocket Server and connect it to the http
// https://github.com/websockets/ws/blob/master/doc/ws.md
const wss = new ws.Server({ server: server });

// when a message is received, use the wss.clients
// list to loop over all connected clients, and
// if their connection is still open, send them a
// copy of the message.
function messageHandler(message) {
    wss.clients.forEach((client) => {
        if(client.readyState === client.OPEN) {
            try {
                client.send(message);
            } catch (err) {
              // errors are ignored
            }
        }
    });
}

// for any messages that arrive via the ws
// web socket, invoke the messageHandler
function connectionHandler(ws) {
  ws.on('message', messageHandler);
}

// When a new connection is received
// invoke the connection handler
wss.on('connection', connectionHandler);

// serve the client using
// express's default static middleware
app.use( express.static(`${__dirname }/webpages`) );

// start the server
server.listen(port, () => {
    console.log('Server started:', `http://${ip.address()}:${port}` )
});
