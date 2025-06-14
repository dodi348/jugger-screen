const field = document.getElementById('field');
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
  e.preventDefault();
  e.stopPropagation();
}

function stopDrag() {
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