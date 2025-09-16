function createSpotElement(spot, index, openModal) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'map-spot';
  button.setAttribute('aria-label', spot.title || `Spot ${index + 1}`);

  const img = document.createElement('img');
  img.src = spot.image;
  img.alt = spot.title || `Spot ${index + 1}`;
  img.loading = 'lazy';

  button.appendChild(img);
  button.addEventListener('click', () => openModal(spot));

  return button;
}

function renderSpots(container, spots, openModal) {
  container.innerHTML = '';
  spots.forEach((spot, index) => {
    const element = createSpotElement(spot, index, openModal);
    container.appendChild(element);
  });
}

export function bootstrapMapPage({
  title = 'Philo-Map',
  spots = [],
  theme = 'default',
  containerId = 'map',
  modalId = 'modal',
  headingSelector = '[data-map-heading]',
} = {}) {
  const container = document.getElementById(containerId);
  const modal = document.getElementById(modalId);
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  const closeButton = modal?.querySelector('[data-map-close]');

  if (title) {
    document.title = title;
    const heading = document.querySelector(headingSelector);
    if (heading) {
      heading.textContent = title;
    }
  }

  if (theme) {
    document.body.dataset.mapTheme = theme;
  }

  if (!container || !modal || !modalTitle || !modalText || !closeButton) {
    console.warn('Map page initialisation skipped: missing element.');
    return;
  }

  const openModal = (spot) => {
    modalTitle.textContent = spot.title || '';
    modalText.textContent = spot.text || '';
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
  };

  const handleOverlayClick = (event) => {
    if (event.target === modal) {
      closeModal();
    }
  };

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', handleOverlayClick);
  document.addEventListener('keydown', handleKeydown);

  renderSpots(container, spots, openModal);

  return {
    destroy() {
      closeButton.removeEventListener('click', closeModal);
      modal.removeEventListener('click', handleOverlayClick);
      document.removeEventListener('keydown', handleKeydown);
    },
  };
}
