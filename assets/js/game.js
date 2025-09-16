import { CONFIG, HOUSE_IMAGES, BACKGROUND_SRC } from './config.js';
import { TAU, clamp, createImage } from './utils.js';

const MOVEMENT_KEYS = new Set([
  'z',
  'q',
  's',
  'd',
  'arrowup',
  'arrowdown',
  'arrowleft',
  'arrowright',
]);

export function createVillageGame({ canvasId = 'game', promptId = 'prompt' } = {}) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas?.getContext('2d');

  if (!canvas || !ctx) {
    throw new Error('Village game initialisation failed: canvas not found.');
  }

  const background = createImage(BACKGROUND_SRC);
  const playerImage = createImage(CONFIG.player.image);
  const houseImages = HOUSE_IMAGES.map((src) => createImage(src));

  let viewport = { width: CONFIG.world.width, height: CONFIG.world.height };
  let scale = 1;
  let houses = [];
  let animationFrame = null;
  let resizeFrame = null;
  let scaleInitialised = false;
  let resizeListenerAttached = false;

  const pressedKeys = new Set();
  const prompt = document.getElementById(promptId) || null;

  const player = {
    position: { x: CONFIG.player.start.x, y: CONFIG.player.start.y },
    radius: CONFIG.player.size,
    speed: CONFIG.player.speed,
  };

  const resetPressedKeys = () => {
    pressedKeys.clear();
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState !== 'visible') {
      resetPressedKeys();
    }
  };

  function clampPlayerToViewport() {
    player.position.x = clamp(player.position.x, player.radius, viewport.width - player.radius);
    player.position.y = clamp(player.position.y, player.radius, viewport.height - player.radius);
  }

  function generateHouses() {
    const entries = [];
    const { center, circleRadius, houseCount, house } = CONFIG;
    const scaledRadius = circleRadius * scale;
    const scaledHouseSize = house.size * scale;
    const cx = center.x * scale;
    const cy = center.y * scale;

    for (let index = 0; index < houseCount; index += 1) {
      const angle = (index / houseCount) * TAU - Math.PI / 2;
      const x = cx + Math.cos(angle) * scaledRadius;
      const y = cy + Math.sin(angle) * scaledRadius;
      const image = houseImages[index % houseImages.length];

      entries.push({
        id: index + 1,
        x,
        y,
        width: scaledHouseSize,
        height: scaledHouseSize,
        image,
      });
    }

    return entries;
  }

  function applyScale(nextScale) {
    const ratio = scaleInitialised ? nextScale / scale : nextScale;
    scale = nextScale;

    player.radius = CONFIG.player.size * scale;
    player.speed = CONFIG.player.speed * scale;

    if (scaleInitialised) {
      player.position.x *= ratio;
      player.position.y *= ratio;
    } else {
      player.position.x = CONFIG.player.start.x * scale;
      player.position.y = CONFIG.player.start.y * scale;
      scaleInitialised = true;
    }

    houses = generateHouses();
    clampPlayerToViewport();
  }

  function updateCanvasDimensions() {
    const aspect = CONFIG.world.width / CONFIG.world.height;
    const margin = 32;
    const availableWidth = Math.max(window.innerWidth - margin, 320);
    const availableHeight = Math.max(window.innerHeight - margin, 240);

    let width = Math.min(availableWidth, Math.round(availableHeight * aspect));
    let height = Math.round(width / aspect);

    if (height > availableHeight) {
      height = availableHeight;
      width = Math.round(height * aspect);
    }

    viewport = { width, height };

    const devicePixelRatio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.round(width * devicePixelRatio);
    canvas.height = Math.round(height * devicePixelRatio);
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    applyScale(width / CONFIG.world.width);
    resetPressedKeys();
  }

  function handleResize() {
    if (resizeFrame !== null) {
      return;
    }

    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = null;
      updateCanvasDimensions();
    });
  }

  function handleKeydown(event) {
    const key = event.key.toLowerCase();

    if (MOVEMENT_KEYS.has(key)) {
      event.preventDefault();
      pressedKeys.add(key);
      return;
    }

    if (key === 'e') {
      event.preventDefault();
      interactWithHouse();
    }
  }

  function handleKeyup(event) {
    const key = event.key.toLowerCase();
    if (MOVEMENT_KEYS.has(key)) {
      pressedKeys.delete(key);
    }
  }

  function interactWithHouse() {
    const house = findNearbyHouse();
    if (!house) {
      return;
    }

    const link = CONFIG.links.map[house.id];
    if (!link) {
      return;
    }

    window.open(link, '_blank');
  }

  function findNearbyHouse() {
    let nearest = null;
    let minDistance = Number.POSITIVE_INFINITY;

    for (const house of houses) {
      const distance = Math.hypot(player.position.x - house.x, player.position.y - house.y);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = house;
      }
    }

    if (minDistance < CONFIG.house.size * scale * 0.6) {
      return nearest;
    }

    return null;
  }

  function updatePrompt() {
    if (!prompt) {
      return;
    }

    const house = findNearbyHouse();
    if (house && CONFIG.links.map[house.id]) {
      prompt.style.display = 'block';
      prompt.textContent = CONFIG.names[house.id] || 'Bâtiment';
    } else {
      prompt.style.display = 'none';
    }
  }

  function computeNextPosition() {
    let deltaX = 0;
    let deltaY = 0;

    if (pressedKeys.has('z') || pressedKeys.has('arrowup')) {
      deltaY -= 1;
    }

    if (pressedKeys.has('s') || pressedKeys.has('arrowdown')) {
      deltaY += 1;
    }

    if (pressedKeys.has('q') || pressedKeys.has('arrowleft')) {
      deltaX -= 1;
    }

    if (pressedKeys.has('d') || pressedKeys.has('arrowright')) {
      deltaX += 1;
    }

    if (deltaX === 0 && deltaY === 0) {
      return { ...player.position };
    }

    const length = Math.hypot(deltaX, deltaY) || 1;
    const scaledX = (deltaX / length) * player.speed;
    const scaledY = (deltaY / length) * player.speed;

    return {
      x: clamp(player.position.x + scaledX, player.radius, viewport.width - player.radius),
      y: clamp(player.position.y + scaledY, player.radius, viewport.height - player.radius),
    };
  }

  function drawBackground() {
    if (background.complete && background.naturalWidth > 0) {
      ctx.drawImage(background, 0, 0, viewport.width, viewport.height);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, viewport.width, viewport.height);
    }
  }

  function drawHouse(house) {
    if (!house.image.complete || house.image.naturalWidth === 0) {
      return;
    }

    const aspectRatio = house.image.naturalWidth / house.image.naturalHeight;
    let drawWidth;
    let drawHeight;

    if (aspectRatio >= 1) {
      drawWidth = house.width;
      drawHeight = house.width / aspectRatio;
    } else {
      drawHeight = house.height;
      drawWidth = house.height * aspectRatio;
    }

    ctx.drawImage(
      house.image,
      house.x - drawWidth / 2,
      house.y - drawHeight / 2,
      drawWidth,
      drawHeight,
    );
  }

  function drawPlayer() {
    if (playerImage.complete && playerImage.naturalWidth > 0) {
      ctx.drawImage(
        playerImage,
        player.position.x - player.radius,
        player.position.y - player.radius,
        player.radius * 2,
        player.radius * 2,
      );
      return;
    }

    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, player.radius, 0, TAU);
    ctx.fillStyle = CONFIG.player.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = CONFIG.player.outline;
    ctx.stroke();
  }

  function render() {
    ctx.clearRect(0, 0, viewport.width, viewport.height);
    drawBackground();
    for (const house of houses) {
      drawHouse(house);
    }
    drawPlayer();
  }

  function loop() {
    const nextPosition = computeNextPosition();
    player.position.x = nextPosition.x;
    player.position.y = nextPosition.y;

    render();
    updatePrompt();

    animationFrame = window.requestAnimationFrame(loop);
  }

  function start() {
    if (animationFrame !== null) {
      return;
    }

    updateCanvasDimensions();
    resetPressedKeys();
    window.addEventListener('keydown', handleKeydown, { passive: false });
    window.addEventListener('keyup', handleKeyup);
    window.addEventListener('blur', resetPressedKeys);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (!resizeListenerAttached) {
      window.addEventListener('resize', handleResize);
      resizeListenerAttached = true;
    }
    animationFrame = window.requestAnimationFrame(loop);
  }

  function stop() {
    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    if (resizeFrame !== null) {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = null;
    }

    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('keyup', handleKeyup);
    window.removeEventListener('blur', resetPressedKeys);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (resizeListenerAttached) {
      window.removeEventListener('resize', handleResize);
      resizeListenerAttached = false;
    }
    resetPressedKeys();

    if (prompt) {
      prompt.style.display = 'none';
    }
  }

  updateCanvasDimensions();

  return {
    start,
    stop,
  };
}
