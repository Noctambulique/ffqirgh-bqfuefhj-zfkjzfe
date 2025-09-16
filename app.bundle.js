(() => {
  const CONFIG = Object.freeze({
    world: { width: 960, height: 600 },
    center: { x: 480, y: 300 },
    circleRadius: 180,
    houseCount: 7,
    house: { size: 130 },
    player: {
      size: 32,
      color: '#ffd166',
      outline: 'rgba(0,0,0,.45)',
      speed: 2.6,
      start: { x: 480, y: 300 },
      image: 'http://www.image-heberg.fr/files/17570217122216427613.png',
    },
    links: {
      map: {
        1: 'http://www.image-heberg.fr/files/17570045253321247512.png',
        2: 'ampleFolder/Film Art Jeu.pdf',
        3: 'ampleFolder/Lubies.pdf',
        4: 'ampleFolder/Power Point Ultime +.pdf',
        5: 'map3.html',
        6: 'ampleFolder/Bio Croisé Octavie Basile.pdf',
        7: 'map2.html',
      },
    },
    names: {
      1: 'Agence de Voyage',
      2: 'Centre Culturel',
      3: 'Centre des Lubies',
      4: 'Maison du Détective',
      5: 'Ordre des bibliothécaires',
      6: 'Musée des Domus',
      7: 'Centre des Archives',
    },
  });

  const HOUSE_IMAGES = [
    'House/20250822_1811_Agence Voyage Nocturne_simple_compose_01k398q5qaf59b1d684d8tr2vr-Photoroom.png',
    'House/20250909_1935_Centre Culturel Nocturne_simple_compose_01k4qrpxm6epeadq2gexry06a0-Photoroom.png',
    'House/20250909_1938_Centre des Lubies Nocturne_simple_compose_01k4qrtxbwf2v8jnw0wex32px9-Photoroom.png',
    'House/Immeuble_Bibliotheque-Photoroom.png',
    'House/20250909_1948_Bibliothèque Éclairée Nocturne_simple_compose_01k4qsdqwmej0vaswh1fnbzmt8 (1)-Photoroom.png',
    'House/20250821_1840_Musée Éclairé la Nuit_simple_compose_01k36qyzzbfcq90cqn3vpsgaj9-Photoroom.png',
    "House/20250822_1305_Centre d'archives nocturne_simple_compose_01k38q6wp3endsa7d41y0w1wke-Photoroom.png",
  ];

  const BACKGROUND_SRC = 'http://www.image-heberg.fr/files/17570213431743313302.png';
  const TAU = Math.PI * 2;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function createImage(src) {
    const image = new Image();
    image.decoding = 'async';
    image.src = src;
    return image;
  }

  function initLockscreen({
    lockscreenId = 'lockscreen',
    inputId = 'code',
    buttonId = 'enterBtn',
    errorId = 'error',
    wrapperSelector = '.wrap',
    validCode = 'Noctambule',
    onUnlock,
  } = {}) {
    const lockscreen = document.getElementById(lockscreenId);
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    const error = document.getElementById(errorId);
    const wrapper = document.querySelector(wrapperSelector);

    if (!lockscreen || !input || !button || !wrapper || !error) {
      console.warn('Lockscreen initialisation skipped: missing element');
      return { destroy() {}, checkCode() {} };
    }

    const hideError = () => {
      error.style.display = 'none';
    };

    const showError = () => {
      error.style.display = 'block';
    };

    const unlock = () => {
      hideError();
      lockscreen.style.display = 'none';
      wrapper.style.display = 'grid';
      if (typeof onUnlock === 'function') {
        onUnlock();
      }
    };

    const checkCode = () => {
      const value = input.value.trim();
      if (value === validCode) {
        unlock();
      } else {
        showError();
      }
    };

    const handleButtonClick = (event) => {
      event.preventDefault();
      checkCode();
    };

    const handleKeydown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        checkCode();
      } else if (error.style.display === 'block') {
        hideError();
      }
    };

    button.addEventListener('click', handleButtonClick);
    input.addEventListener('keydown', handleKeydown);

    return {
      checkCode,
      destroy() {
        button.removeEventListener('click', handleButtonClick);
        input.removeEventListener('keydown', handleKeydown);
      },
    };
  }

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

  function createVillageGame({ canvasId = 'game', promptId = 'prompt' } = {}) {
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

  document.addEventListener('DOMContentLoaded', () => {
    try {
      const game = createVillageGame({ canvasId: 'game', promptId: 'prompt' });

      initLockscreen({
        validCode: 'Noctambule',
        onUnlock: () => game.start(),
      });
    } catch (error) {
      console.error('Naos initialisation error:', error);
      const errorElement = document.getElementById('error');
      if (errorElement) {
        errorElement.textContent = "Impossible d'initialiser le village.";
        errorElement.style.display = 'block';
      }
    }
  });
})();
