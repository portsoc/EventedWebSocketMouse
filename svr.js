/// An excessively commented example.

// configuration
const port = process.env.PORT || 8080;

// libraries
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import ip from 'ip';

// create an express application
// http://expressjs.com/en/api.html
const app = express();

// create an http server that uses express for handling requests
// https://nodejs.org/api/http.html
const server = createServer(app);

// Create a WebSocket Server and connect it to the http server
// https://github.com/websockets/ws/blob/master/doc/ws.md
const wss = new WebSocketServer({ server });

// when a message is received, use the wss.clients
// list to loop over all connected clients, and
// if their connection is still open, send them a
// copy of the message.
function messageHandler(message, isBinary) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        // Forward the message to all connected clients
        client.send(message, { binary: isBinary });
      } catch (err) {
        // errors are ignored
      }
    }
  });
}

// When a connection is made a web socket object
// is passed (ws).  For any messages that arrive
// via ws, we wish to invoke a messageHandler
function connectionHandler(ws) {
  ws.on('message', messageHandler);
}

// When a new connection is received
// invoke the connection handler
wss.on('connection', connectionHandler);

// serve the client using
// express's default static middleware
app.use(express.static(`${process.cwd()}/webpages`));

// start the server
server.listen(port, () => {
  console.log('Server started:', `http://${ip.address()}:${port}`);
});
