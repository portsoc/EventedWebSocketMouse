const ws = new WebSocket("ws://" + window.location.hostname + ":" + (window.location.port || 80) + "/");
const myid = Math.random().toString(36).substring(2);

const LIFETIME = 5000; // milliseconds to live

const shiftingColour = {
  saturation: Math.floor(50+50*Math.random()),
  lightness: Math.floor(50+10*Math.random()),
  hue: Math.floor(360*Math.random()),

  shift() {
    this.hue = (this.hue+0.1) % 360;
  },

  get css() {
    this.shift();
    return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
  },
}


function theMouseWasMoved(e) {
  const x = (e.pageX * 100 / document.body.scrollWidth).toFixed(2);
  const y = (e.pageY * 100 / document.body.scrollHeight).toFixed(2);
  const message = {
    x,
    y,
    id: myid,
    player: window.player.value || "Anon",
    col: shiftingColour.css,
  };
  ws.send(JSON.stringify(message));
};


// this should run in response to any message
// received over the websocket
function receivedMessageFromServer(e) {

  // we receive a JSON string, need to parse it into an object
  const msg = JSON.parse( e.data );

  // find the element for the received ID
  let el = document.getElementById( msg.id );

  // if we don't already have an element
  // with that ID, we should create it
  if (!el) {
    el = document.createElement("div");
    el.classList.add("out");
    el.setAttribute("id", msg.id);
    window.game.appendChild(el);
  }

  // modify the content and position of the element to reflect
  // the current status sent from the server
  el.dataset.lastUpdated = Date.now();
  el.textContent = msg.player;
  el.setAttribute(
    "style",
    `position: absolute; background:${msg.col}; top:${msg.y}%; left:${msg.x}%;`
  );

};


function sweepForDeadPlayers() {
  let allOut = document.querySelectorAll(".out");
  let deadTime = Date.now() - LIFETIME;
  for (const node of allOut) {
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
