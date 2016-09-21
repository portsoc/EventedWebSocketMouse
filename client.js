var
    d,
    ws = new WebSocket("ws://"+window.location.hostname+":9090/"),
    myid = new Date().toString().replace(/[\W]+/g, ""),
    col = Math.random().toString(16).substring(2, 8),

    update = function(e) {
        ws.send(
            JSON.stringify(
                {
                    x: e.clientX,
                    y: e.clientY,
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

    d.innerHTML = "";
    d.appendChild(
        document.createTextNode(q.player)
    );

    d.setAttribute(
        "style",
        "position: absolute; background: #"+q.col+";top:"+(q.y-20)+"px; left:"+q.x+"px;"
    );

};



document.addEventListener("mousemove", update );
player.addEventListener("keyup", update);
