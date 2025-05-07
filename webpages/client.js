// An over-commented teaching example.

// Establish a web socket connection with the server from
// which this page was served.
const ws = new WebSocket('ws://' + window.location.hostname + ':' + (window.location.port || 80) + '/');

// milliseconds to live
const LIFETIME = 5000;

// this ID is a base 36 string the substring(2) removes the '0.' prefix
// we add the x to ensure it's a valid CSS selector which is useful.
const myid = "x"+Math.random().toString(36).substring(2);

const el = {};

const shiftingColour = {
  saturation: Math.floor(50 + 50 * Math.random()),
  lightness: Math.floor(50 + 10 * Math.random()),
  hue: Math.floor(360 * Math.random()),

  get css() {
    this.hue = (this.hue +0.2) % 360;
    return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
  },
};

function theMouseWasMoved(e) {
  // get the mouse x and y position and convert them to a
  // percentage of the document body width and height.
  // This accounts for simultaneous users with
  // different screen sizes.
  const x = (e.pageX * 100 / document.body.scrollWidth).toFixed(2);
  const y = (e.pageY * 100 / document.body.scrollHeight).toFixed(2);
  const message = {
    x,
    y,
    id: myid,
    player: el.player.value || 'Anon',
    col: shiftingColour.css,
  };
  ws.send(JSON.stringify(message));
}

// this should run in response to any message
// received over the websocket
function receivedMessageFromServer(e) {
  // we receive a JSON string, need to parse it into an object
  const msg = JSON.parse(e.data);

  // find the element for the received ID
  let user = document.getElementById(msg.id);

  // if we don't already have an element
  // with that ID, we should create it
  if (!user) {
    user = document.createElement('div');
    user.classList.add('out');
    user.setAttribute('id', msg.id);
    window.game.append(user);
  }

  // modify the content and position of the element to reflect
  // the current status sent from the server.  the x and y values
  // are percentages so must be multiplied out by the width and
  // height of this page document body.
  user.dataset.lastUpdated = Date.now();
  user.textContent = msg.player;
  const x = msg.x * document.body.scrollWidth / 100;
  const y = msg.y * document.body.scrollHeight / 100;
  user.setAttribute(
    'style',
    `background:${msg.col}; transform:translate(${x}px,${y}px);`,
  );
}

function sweepForDeadPlayers() {
  const allOut = document.querySelectorAll('.out');
  const deadTime = Date.now() - LIFETIME;
  for (const node of allOut) {
    if (node.dataset.lastUpdated < deadTime) {
      node.remove();
    }
  }
}

function connectListeners() {
  el.player = document.querySelector('#player');
  document.addEventListener('mousemove', theMouseWasMoved);
  ws.addEventListener('message', receivedMessageFromServer);
  setInterval(sweepForDeadPlayers, 1000);
}

window.addEventListener('load', connectListeners);
