'use strict';

const http = require('http');
const wsserver = require('ws').Server;
const express = require('express');

const server = http.createServer();
const wss = new wsserver({ server: server });
const app = express();

server.on('request', app);

function ws_broadcast(message) {
    wss.clients.forEach( (client) => {
      if(client.readyState === client.OPEN){
        try {
          client.send(message);
        } catch (e) {
        }
      }
    });
}

function ws_responder(ws) {
	ws.on( 'message', ws_broadcast );
}


app.use(express.static(__dirname + '/webpages', { extensions: ['html', 'css', 'js'] }));

wss.on('connection', ws_responder);

server.listen(8080, function () { console.log('Server started.'); });
