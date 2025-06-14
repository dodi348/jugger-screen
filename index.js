const field = document.getElementById('field');
const players = document.getElementsByClassName('player-wrapper');
let activeWrapper = null;
let offsetX = 0, offsetY = 0;

function getPos(e) {
  if (e.touches && e.touches[0]) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
}

function startDrag(e) {
  const handle = e.target.closest('.drag-handle');
  if (!handle) return;

  activeWrapper = handle.parentElement;
  activeWrapper.style.zIndex = 1000; // Bring to front

  const pos = getPos(e);
  offsetX = pos.x - activeWrapper.offsetLeft;
  offsetY = pos.y - activeWrapper.offsetTop;
  e.preventDefault();
}

function onDrag(e) {
  if (!activeWrapper) return;
  const pos = getPos(e);
  let x = pos.x - offsetX;
  let y = pos.y - offsetY;

  const maxX = field.clientWidth - activeWrapper.offsetWidth;
  const maxY = field.clientHeight - activeWrapper.offsetHeight;

  x = Math.max(0, Math.min(x, maxX));
  y = Math.max(0, Math.min(y, maxY));

  activeWrapper.style.left = `${x}px`;
  activeWrapper.style.top = `${y}px`;
}

function stopDrag() {
  if (!activeWrapper) return;
  activeWrapper.style.zIndex = 1; // Bring to front
  activeWrapper = null;
}

// Mouse
field.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', onDrag);
document.addEventListener('mouseup', stopDrag);

// Touch
field.addEventListener('touchstart', startDrag, { passive: false });
document.addEventListener('touchmove', onDrag, { passive: false });
document.addEventListener('touchend', stopDrag);

for (let i = 0; i < (players.length - 1) / 2; i++) {
  players[i].style.top = 'calc(' + ((i) * 10 + 25 + '%') + ' + ' + (parseInt(getComputedStyle(players[i]).width) * 1) + 'px )';
  players[i].style.left = 'calc(0' + (parseInt(getComputedStyle(players[i + 5]).width) * 1) + 'px )';
  players[i + 5].style.top = 'calc(' + ((i) * 10 + 25 + '%') + ' + ' + (parseInt(getComputedStyle(players[i + 5]).width) * 1) + 'px )';
  players[i + 5].style.left = 'calc(100% - ' + (parseInt(getComputedStyle(players[i + 5]).width) * 1) + 'px )';
}

function resetPositions() {

}

function savePositions() {
  alert('Positions saved!');

  const positions = Array.from(players).map(player => ({
    left: player.style.left,
    top: player.style.top,
    x: field.width ? (parseFloat(player.style.left) / field.clientWidth * 100).toFixed(2) + '%' : '0%',
    y:
    value: player.querySelector('.player').value,
  }));

  const jug = getComputedStyle(document.getElementById('jug'));

  positions.push({
    left: jug.left,
    top: jug.top,
  });

  const json = JSON.stringify(positions, null, 2); // Pretty print
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url); // Clean up

  console.log('Saved positions:', positions);
}

function loadPositions(positions) {
  resetPositions();

  var input = document.createElement('input');
input.type = 'file';

input.onchange = e => { 

   // getting a hold of the file reference
   var file = e.target.files[0]; 

   // setting up the reader
   var reader = new FileReader();
   reader.readAsText(file,'UTF-8');

   // here we tell the reader what to do when it's done reading...
   reader.onload = readerEvent => {
      var content = readerEvent.target.result; // this is the content!
      setPositions(JSON.parse(content))
   }


}

input.click();

}

function setPositions(positions) {
  positions.forEach((pos, index) => {
    if (index < players.length) {
      const player = players[index];
      player.style.left = pos.left || '0px';
      player.style.top = pos.top || '0px';
      player.querySelector('.player').value = pos.value || '';
    } else if (index === players.length) {
      const jug = document.getElementById('jug');
      jug.style.left = pos.left || '0px';
      jug.style.top = pos.top || '0px';
    }
  });
}

document.getElementById('reset').addEventListener('click', resetPositions);
document.getElementById('load').addEventListener('click', loadPositions);
document.getElementById('save').addEventListener('click', savePositions);

