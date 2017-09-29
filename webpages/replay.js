let ws = new WebSocket("ws://" + window.location.hostname + ":" + (window.location.port || 80) + "/");
let events = [];

const runReplay = () => {
  console.log(events);
};

// /replay.json gives us a list of all the mousemove events that the server holds.
// If this was long-running production, this would be a problem, but... it's a gimmick. We're fine.
let dataRequest = new XMLHttpRequest();
dataRequest.addEventListener('load', ev => {
  events = JSON.parse(ev.target.responseText);
  runReplay();
});
dataRequest.open('GET', 'http://' + location.hostname + ':' + (location.port || 80) + '/replay.json');
dataRequest.send();
