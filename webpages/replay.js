let events = [];

const renderEvent = evt => {
  let el = document.getElementById(evt[2]);
  if (!el) {
    el = document.createElement('div');
    el.id = evt[2];
    el.classList.add('out');
    document.getElementById('game').appendChild(el);
  }
  el.textContent = evt[3];
  el.setAttribute(
      "style",
      "position: absolute; background:" + evt[4] + "; top:" + evt[1] + "%; left:" + evt[0] + "%;"
  );
};

const runReplay = () => {
  if (events.length < 1) {
    // There's nothing to simulate here. Returning allows the rest of the code to assume
    // there's data in the array without doing the error checks every time.
    return;
  }

  // Doing this gets us relative timestamps instead of absolute, which makes timing easier.
  const firstEventTimestamp = events[0][5];
  events.forEach(x => x[5] = x[5] - firstEventTimestamp);

  const simulationStart = Date.now();
  events.forEach(x => {
    const runAt = simulationStart + x[5];
    const millisUntilRun = runAt - Date.now();
    setTimeout(() => {
      renderEvent(x);
    }, millisUntilRun);
  });
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
