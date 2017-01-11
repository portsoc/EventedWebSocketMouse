var
    ws = new WebSocket("ws://" + window.location.hostname + ":" + (window.location.port || 80) + "/");
    myid = new Date().toString().replace(/[\W]+/g, ""),
    col = generateRandomColor();


function generateRandomColor() {
  var hue = Math.random() * 360;
  var saturation = (1-Math.pow(1-Math.random(), 2)) * 100;
  var lumens = Math.sqrt(Math.sqrt(Math.random())) * 50;
  return "hsl("+hue+", "+saturation+"%,"+lumens+"%)";
}


function theMouseWasMoved(e) {
  ws.send(
    JSON.stringify(
      {
        x: e.pageX * 100 / document.body.scrollWidth,
        y: e.pageY * 100 / document.body.scrollHeight,
        id: myid,
        player: window.player.value || "Anon",
        col: col
      }
    )
  );
};


// this should run in response to any message
// received over the websocket
function receivedMessageFromServer(e) {
    // extract the ID from the received packet
    var q = JSON.parse( e.data );
    var d = document.getElementById( q.id );

    // if we don't already have an element
    // with that ID, we shoudl create it.
    if (!d) {
        d = document.createElement("div");
        d.classList.add("out");
        d.setAttribute("id", q.id);
        window.game.appendChild(d);
    }

    // modify the content and position to reflect the current status
    // sent from the server.
    d.textContent = q.player;
    d.setAttribute(
        "style",
        "position: absolute; background:" + q.col + "; top:" + q.y + "%; left:" + q.x + "%;"
    );

};

function connectListeners() {
  document.addEventListener("mousemove", theMouseWasMoved );
  ws.addEventListener("message", receivedMessageFromServer );
}

window.addEventListener("load", connectListeners );
