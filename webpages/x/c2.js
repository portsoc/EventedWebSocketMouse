const wsurl = "ws://" + window.location.hostname + ":" + (window.location.port || 80) + "/";
const TAU = 2*Math.PI;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// this should run in response to any message
// received over the websocket
function receivedMessageFromServer(e) {
    // extract the ID from the received packet
    const q = JSON.parse( e.data );

    ctx.beginPath();
    ctx.arc(q.x*10, q.y*10, 10, 0, TAU);
    ctx.closePath();
    ctx.fillStyle = q.col;
    ctx.fill();
};

function diminish() {
  ctx.rect(0,0,1000,1000);
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fill();
}

window.addEventListener("load", () => {
  canvas.width = 1000;
  canvas.height = 1000;
  window.game.appendChild(canvas);

  const ws = new WebSocket(wsurl);
  ws.addEventListener("message", receivedMessageFromServer );

  window.setInterval(diminish, 100);
});
