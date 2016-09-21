var
    d,
    ws = new WebSocket("ws://" + window.location.hostname + ":9090/"),
    myid = new Date().toString().replace(/[\W]+/g, ""),
    col = "hsl(" +
              (Math.random()*360) + ", " + // random hue
              ((1-Math.pow(1-Math.random(), 2))*100) + "%, " + // random (likely high) saturation
              (Math.sqrt(Math.sqrt(Math.random()))* 50) + "%)", // random (likely high) lightness up to 50%

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
    }; //goodenough


// this is what happens when a messages is pushed from
// the sever to the websocket
ws.onmessage = function(e) {
    var q = JSON.parse(e.data);

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
        "position: absolute; background:" + q.col + "; top:" + q.y + "%; left:" + q.x + "%;"
    );

};


function connectListeners() {
  document.addEventListener("mousemove", update );
}

window.addEventListener("load", connectListeners );
