let
    ws = new WebSocket("ws://" + window.location.hostname + ":" + (window.location.port || 80) + "/"),
    myid = null,
    col = generateRandomColor();

function generateRandomColor() {
  let hue = Math.floor(Math.random() * 360);
  let saturation = Math.floor((1-Math.pow(1-Math.random(), 2)) * 100);
  let lumens = Math.floor(Math.sqrt(Math.sqrt(Math.random())) * 50);
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
}


// this should run in response to any message
// received over the websocket
function receivedMessageFromServer(e) {
    // extract the ID from the received packet
    let q = JSON.parse( e.data );

    // If the server is telling us our ID, set it and then
    // ignore the rest of this function.
    if (q.hasOwnProperty('your_id') && q['your_id']) {
      myid = q.your_id;
      return;
    }

    let d = document.getElementById( q.id );

    // if we don't already have an element
    // with that ID, we shoudl create it.
    if (!d) {
        d = document.createElement("div");
        d.classList.add("out");
        d.setAttribute("id", q.id);
        d.dataset.lastUpdated = Date.now();
        window.game.appendChild(d);
    }

    // modify the content and position to reflect the current status
    // sent from the server.
    d.textContent = q.player;
    d.setAttribute(
        "style",
        "position: absolute; background:" + q.col + "; top:" + q.y + "%; left:" + q.x + "%;"
    );

}

//
function sweepForDeadPlayers() {
  let allOut = document.querySelectorAll(".out");
  let deadTime = Date.now() - (1000 * 5);
  for (let node of allOut) {
    if (node.dataset.lastUpdated < deadTime) {
      node.remove();
    }
  }

}


function connectListeners() {
  document.addEventListener("mousemove", theMouseWasMoved );
  ws.addEventListener("message", receivedMessageFromServer );
  setInterval(sweepForDeadPlayers, 1000);
}

window.addEventListener("load", connectListeners );
