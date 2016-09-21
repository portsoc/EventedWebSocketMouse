var
	// used to serve the static page
	connect = require('connect'),
	serveStatic = require('serve-static'),
	ipaddr = require('os').networkInterfaces().en0[1].address,
  counter = 0,

	// used to handle the page interactions
	ws_svr = require('ws').Server,
	wss = new ws_svr(
		{
			port: 9090
		}
	),

	ws_responder = function(ws) {

    // on connection, send an init packet with a new id
    ws.send(
      JSON.stringify(
        {
          "type": "init",
          "myid": `${ws.upgradeReq.connection.remoteAddress}_${++counter}`
        }
      )
    );

		ws.on(
			'message',
			function(message) {
				for (var i = wss.clients.length - 1; i >= 0; i--) {
					wss.clients[i].send(message);
				}
			}
		);
	},

	start = function() {
		wss.on('connection', ws_responder);

		connect().use(serveStatic(".")).listen(8080);
		console.log("WS Listening on:", ipaddr + ":9090");
		console.log("Visit: http://"+ipaddr + ":" + 8080);

	};

start();
