let ws = new WebSocket("ws://" + window.location.hostname + ":" + (window.location.port || 80) + "/");
let events = [];

let dataRequest = new XMLHttpRequest();
dataReqest.addEventListener('load', ev => {
  events = JSON.parse(ev.responseText);
  console.log(events);
});
dataReqest.open('GET', 'http://' + location.hostname + ':' + (location.port || 80) + '/replay.json');
dataReqest.send();
