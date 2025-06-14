const field = document.getElementById('field');
const redTeam = document.querySelectorAll('#red-team .player-wrapper');
const blueTeam = document.querySelectorAll('#blue-team .player-wrapper');
const jug = document.getElementById('jug');

let activeWrapper = null;
let offsetX = 0, offsetY = 0;
let fieldWidth = field.clientWidth, fieldHeight = field.clientHeight;
let playerWidth = blueTeam[0].clientWidth, playerHeight = blueTeam[0].clientHeight; // Assuming each player has a width of 50px

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

function resetPositions() {
  redTeam.forEach((player, i) => {
    player.style.left = fieldWidth - playerWidth  + 'px';
    player.style.top = i * (fieldHeight / 10) + fieldHeight / 3.4 + 'px';
  });
  blueTeam.forEach((player, i) => {
    player.style.left = 30 + 'px';
    player.style.top = i * (fieldHeight / 10) + fieldHeight / 3.4 + 'px';
  });
  jug.style.left = (fieldWidth / 2 - playerWidth / 2) + 'px';
  jug.style.top = (fieldHeight / 2 - playerHeight / 2) + 'px';
  console.log('Positions reset');
}

resetPositions();
document.getElementById('reset').addEventListener('click', resetPositions);

document.getElementById('save').addEventListener('click', savePositions);
function savePositions() {
  //alert('Positions saved!');

  const blueTeamPositions = Array.from(blueTeam).map(player => ({
    left: player.style.left,
    top: player.style.top,
    x: parseInt(player.style.left) / fieldWidth,
    y: parseInt(player.style.top) / fieldHeight,
    value: player.querySelector('.player').value,
  }));

  const redTeamPositions = Array.from(redTeam).map(player => ({
    left: player.style.left,
    top: player.style.top,
    x: parseInt(player.style.left) / fieldWidth,
    y: parseInt(player.style.top) / fieldHeight,
    value: player.querySelector('.player').value,
  }));

  const jugPosition = ({
    left: jug.style.left,
    top: jug.style.top,
    x: parseInt(jug.style.left) / fieldWidth,
    y: parseInt(jug.style.top) / fieldHeight,
  });

  const positions = {
    blueTeam: blueTeamPositions,
    redTeam: redTeamPositions,
    jug: jugPosition,
  };
  
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

document.getElementById('load').addEventListener('click', loadPositions);

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
  /*if (index < players.length) {
    const player = players[index];
    player.style.left = pos.left || '0px';
    player.style.top = pos.top || '0px';
    player.querySelector('.player').value = pos.value || '';
  } else if (index === players.length) {
    const jug = document.getElementById('jug');
    jug.style.left = pos.left || '0px';
    jug.style.top = pos.top || '0px';
  }*/

  positions.blueTeam.forEach((pos, index) => {
    blueTeam[index].style.left = pos.x * fieldWidth + 'px';
    blueTeam[index].style.top = pos.y * fieldHeight + 'px';
    blueTeam[index].querySelector('.player').value = pos.value || '';
  });

  positions.redTeam.forEach((pos, index) => {
    redTeam[index].style.left = pos.x * fieldWidth + 'px';
    redTeam[index].style.top = pos.y * fieldHeight + 'px';
    redTeam[index].querySelector('.player').value = pos.value || '';
  });

  jug.style.left = positions.jug.x * fieldWidth + 'px';
  jug.style.top = positions.jug.y * fieldHeight + 'px';
}