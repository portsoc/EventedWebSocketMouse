var
    d,
    ws = new WebSocket("ws://"+window.location.hostname+":9090/"),
    myid = new Date().toString().replace(/[\W]+/g, ""),
    col = Math.random().toString(16).substring(2, 8),

    update = function(e) {
        ws.send(
            JSON.stringify(
                {
                    x: e.pageX * 100 / document.body.scrollWidth,
                    y: e.pageY * 100 / document.body.scrollHeight,
                    id: myid,
                    player: (player.value == "Who are you?" ? "Anon" : player.value),
                    col: col
                }
            )
        );
    }; //goodenough


// this is what happens when a messages is pushed from
// the sever to the websocket
ws.onmessage = function (e) {
    var q = JSON.parse(e.data);

    d = document.getElementById(q.id);
    if (!d) {
        d=document.createElement("div");
        d.classList.add("out");
        d.setAttribute("id", q.id);
        game.appendChild(d);
    }

    d.textContent = q.player;

    d.setAttribute(
        "style",
        "position: absolute; background: #"+q.col+";top:"+q.y+"%; left:"+q.x+"%;"
    );

};



document.addEventListener("mousemove", update );
player.addEventListener("keyup", update);
