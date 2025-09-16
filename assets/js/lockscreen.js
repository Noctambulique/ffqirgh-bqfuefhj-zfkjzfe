export function initLockscreen({
  lockscreenId = 'lockscreen',
  inputId = 'code',
  buttonId = 'enterBtn',
  errorId = 'error',
  wrapperSelector = '.wrap',
  validCode = 'Noctambule',
  onUnlock = undefined,
} = {}) {
  const lockscreen = document.getElementById(lockscreenId);
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  const error = document.getElementById(errorId);
  const wrapper = document.querySelector(wrapperSelector);

  if (!lockscreen || !input || !button || !wrapper || !error) {
    console.warn('Lockscreen initialisation skipped: missing element');
    return {
      destroy() {},
      checkCode() {},
    };
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
