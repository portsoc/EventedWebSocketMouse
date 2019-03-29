const wsurl = "ws://" + window.location.hostname + ":" + (window.location.port || 80) + "/";
const TAU = 2*Math.PI;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const width=1000;
const height=1000;
const widthmult = width/100;
const heightmult = height/100;

const ID_TIMEOUT = 5000;
const idCounts = {};
let players = 1;
function countIDs(id) {
  const now = Date.now();
  if (id) idCounts[id] = Date.now() + ID_TIMEOUT;
  for (const key of Object.keys(idCounts)) {
    if (idCounts[key] < now) delete idCounts[key];
  }
  return Object.keys(idCounts).length || 1;
}


// this should run in response to any message
// received over the websocket
function receivedMessageFromServer(e) {
  // extract the ID from the received packet
  const q = JSON.parse( e.data );

  players = countIDs(q.id);

  ctx.beginPath();
  ctx.arc(q.x * widthmult, q.y*heightmult, 20/Math.log(players+1), 0, TAU);
  ctx.closePath();
  ctx.fillStyle = q.col;
  ctx.fill();
};


window.addEventListener("load", () => {
  canvas.width = width;
  canvas.height = height;
  window.game.appendChild(canvas);

  const ws = new WebSocket(wsurl);
  ws.addEventListener("message", receivedMessageFromServer );
  step();
});



function xyToArr(x, y) {
  return (y * height + x) * 4;
}

function jiggle(x) {
  const shiftProbability = 1/8;
  const r = Math.random();
  if (r < shiftProbability && x > 0) x -= 1;
  if (r >= 1 - shiftProbability && x < width - 1) x += 1;
  return x;
}

function swapPixels(data, a, b) {
  const tmp0 = data[b];
  const tmp1 = data[b + 1];
  const tmp2 = data[b + 2];
  const tmp3 = data[b + 3];
  data[b] = data[a];
  data[b + 1] = data[a + 1];
  data[b + 2] = data[a + 2];
  data[b + 3] = data[a + 3];
  data[a] = tmp0;
  data[a + 1] = tmp1;
  data[a + 2] = tmp2;
  data[a + 3] = tmp3;
}

function step() {
  let img = ctx.getImageData(0, 0, width,height);

  // loop from the bottom to the top
  // moving the upper pixel down if it is
  // non transparent and the pixel below is transparent.
  for (let y = height-2; y >= 0; y--) {
    for (let x = width-1; x >= 0; x--) {
      const above = xyToArr(x, y);
      const below = xyToArr(jiggle(x), y+1);
      if (img.data[below + 3] === 0 && img.data[above + 3] !== 0) {
        swapPixels(img.data, above, below);
      }
      if (img.data[above + 3] > 0) {
        img.data[above + 3] -= players;
      }
    }
  }
  ctx.putImageData(img, 0, 0, 0, 0, width, height);
  window.requestAnimationFrame(step);
}
