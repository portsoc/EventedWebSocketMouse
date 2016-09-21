var
    d,
    myid,
    ws = new WebSocket("ws://" + window.location.hostname + ":9090/"),
    col = Math.random().toString(16).substring(2, 8),

    update = function(e) {
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


// this is what happens when a messages is pushed from
// the sever to the websocket
ws.onmessage = function(e) {

    var q = JSON.parse(e.data);

    if (q.type === "init") {
      myid = q.myid;
    } else {

      d = document.getElementById(q.id);
      if (!d) {
          d = document.createElement("div");
          d.classList.add("out");
          d.setAttribute("id", q.id);
          window.game.appendChild(d);
      }

      d.textContent = q.player;
      d.setAttribute(
          "style",
          "position: absolute; background: #"+q.col+";top:"+q.y+"%; left:"+q.x+"%;"
      );
    }
};


function connectListeners() {
  document.addEventListener("mousemove", update );
}

window.addEventListener("load", connectListeners );
