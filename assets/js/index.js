import { initLockscreen } from './lockscreen.js';
import { createVillageGame } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = createVillageGame({ canvasId: 'game', promptId: 'prompt' });

  initLockscreen({
    validCode: 'Noctambule',
    onUnlock: () => game.start(),
  });
});
