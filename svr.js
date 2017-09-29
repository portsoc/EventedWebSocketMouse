'use strict';

const http = require('http');
const wsserver = require('ws').Server;
const express = require('express');

const server = http.createServer();
const wss = new wsserver({ server: server });
const app = express();

server.on('request', app);

const events = [];
const allClients = {};
const replayClients = [];

const objectForEach = (obj, runnable) => {
  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    runnable.call(obj, keys[i], obj[keys[i]]);
  }
};

function ws_broadcast(message) {
  if (message.hasOwnProperty('replay') && message['replay']) {
    replayClients.push(message['id']);
  }
  else {
    events.push(message);
    objectForEach(allClients, (id, client) => {
      if (client.readyState === client.OPEN && replayClients.indexOf(id) === -1) {
        try {
          client.send(message);
        } catch (e) {
          console.warn(`Failed to send WebSocket message: ${e}`);
        }
      }
    });
  }
}

function ws_responder(ws) {
  let id = new Date().toString().replace(/[\W]+/g, "");
  ws.send(JSON.stringify({'your_id': id}));
  allClients[id] = ws;
	ws.on('message', ws_broadcast);
}


app.use(express.static(__dirname + '/webpages', { extensions: ['html', 'css', 'js'] }));
app.get('/replay', (req, res) => {
  res.sendFile(path.join(__dirname + '/webpages/replay.html'));
});

wss.on('connection', ws_responder);

server.listen(8080, function () { console.log('Server started.'); });
