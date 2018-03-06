const ws = new WebSocket("ws://" + window.location.hostname + ":" + (window.location.port || 80) + "/");
const myid = Math.random().toString(36).substring(2);
const lifetime = 5000; // milliseconds to live
const saturation = Math.floor(50+50*Math.random());
const lumens = Math.floor(50+10*Math.random());
let hue = Math.floor(360*Math.random());

function color() {
  hue = (hue+0.1) % 360;
  return `hsl(${hue}, ${saturation}%, ${lumens}%)`;
}


function theMouseWasMoved(e) {
  ws.send(
    JSON.stringify(
      {
        x: (e.pageX * 100 / document.body.scrollWidth).toFixed(2),
        y: (e.pageY * 100 / document.body.scrollHeight).toFixed(2),
        id: myid,
        player: window.player.value || "Anon",
        col: color()
      }
    )
  );
};


// this should run in response to any message
// received over the websocket
function receivedMessageFromServer(e) {

    // extract the ID from the received packet
    const q = JSON.parse( e.data );

    let d = document.getElementById( q.id );

    // if we don't already have an element
    // with that ID, we should create it.
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

};

//
function sweepForDeadPlayers() {
  let allOut = document.querySelectorAll(".out");
  let deadTime = Date.now() - lifetime;
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
