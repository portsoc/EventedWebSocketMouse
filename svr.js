'use strict';

const http = require('http');
const wsserver = require('ws').Server;
const express = require('express');

const server = http.createServer();
const wss = new wsserver({ server: server });
const app = express();

server.on('request', app);

/**
 * Events schema:
 * 2D array. Each element (el):
 *  el[0] - x - client mouse X position, in % of page width
 *  el[1] - y - client mouse Y position, in % of page height
 *  el[2] - id - server-assigned ID based on date
 *  el[3] - player - player username
 *  el[4] - col - player indicator background color
 *  el[5] - timestamp - Unix timestamp for event
 */
const events = [];

const dataKeys = ['x', 'y', 'id', 'player', 'col', 'timestamp'];
const clientDataToArray = obj => {
  let ary = [];
  for (let key of dataKeys) {
    ary.push(obj[key]);
  }
  return ary;
};

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
  events.push(clientDataToArray(Object.assign(JSON.parse(message), { 'timestamp': Date.now() })));
}

let idCounter = 0;
function ws_responder(ws) {
  ws.send(JSON.stringify({'your_id': ++idCounter}));
  ws.on('message', ws_broadcast);
}


app.use(express.static(__dirname + '/webpages', { extensions: ['html', 'css', 'js'] }));
app.get('/replay.json', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.end(JSON.stringify(events));
});

wss.on('connection', ws_responder);

server.listen(8080, function () { console.log('Server started.'); });
