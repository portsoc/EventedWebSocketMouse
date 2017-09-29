'use strict';

const http = require('http');
const wsserver = require('ws').Server;
const express = require('express');

const server = http.createServer();
const wss = new wsserver({ server: server });
const app = express();

server.on('request', app);

const events = [];

function ws_broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      try {
        client.send(message);
      } catch (e) {
        console.warn(`Failed to send WebSocket message: ${e}`);
      }
    }
  });
  events.push(Object.assign(JSON.parse(message), { 'timestamp': Date.now() }));
}

function ws_responder(ws) {
  let id = new Date().toString().replace(/[\W]+/g, "");
  ws.send(JSON.stringify({'your_id': id}));
  ws.on('message', ws_broadcast);
}


app.use(express.static(__dirname + '/webpages', { extensions: ['html', 'css', 'js'] }));
app.get('/replay.json', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.end(JSON.stringify(events));
});

wss.on('connection', ws_responder);

server.listen(8080, function () { console.log('Server started.'); });
