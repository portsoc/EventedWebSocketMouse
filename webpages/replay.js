let ws = new WebSocket("ws://" + window.location.hostname + ":" + (window.location.port || 80) + "/");
let events = [];

let dataRequest = new XMLHttpRequest();
dataRequest.addEventListener('load', ev => {
  events = JSON.parse(ev.target.responseText);
});
dataRequest.open('GET', 'http://' + location.hostname + ':' + (location.port || 80) + '/replay.json');
dataRequest.send();
