import { clampDayValue, clampYearValue, validateSignupPayload } from './validation.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animateTiles = (tiles) => {
  tiles.forEach((tile, index) => {
    tile.classList.remove('visible');
    const delay = prefersReducedMotion ? 0 : index * 130;
    window.setTimeout(() => {
      tile.classList.add('visible');
    }, delay);
  });
};

const addTileInteractions = (tiles) => {
  tiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      tile.animate(
        [
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(1.03)', opacity: 1 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        {
          duration: prefersReducedMotion ? 0 : 220,
          easing: 'ease-out',
        }
      );
    });
  });
};

const getSchoolValue = (form) => {
  const selectValue = form.elements.namedItem('schoolSelect')?.value.trim() ?? '';
  const customValue = form.elements.namedItem('schoolCustom')?.value.trim() ?? '';
  return customValue || selectValue;
};

export const initSignupFlow = () => {
  const signupForm = document.getElementById('signupForm');
  const signupView = document.getElementById('signupView');
  const mainView = document.getElementById('mainView');
  const tiles = Array.from(document.querySelectorAll('[data-tile]'));
  const dobDayInput = document.getElementById('dobDay');
  const dobYearInput = document.getElementById('dobYear');

  if (!signupForm || !signupView || !mainView) return;

  if (dobDayInput) {
    dobDayInput.addEventListener('input', (event) => {
      event.target.value = clampDayValue(event.target.value);
    });
  }

  if (dobYearInput) {
    dobYearInput.addEventListener('input', (event) => {
      event.target.value = clampYearValue(event.target.value);
    });
  }

  addTileInteractions(tiles);

  const showMainView = () => {
    signupView.style.display = 'none';
    signupView.setAttribute('aria-hidden', 'true');
    mainView.style.display = 'block';
    mainView.removeAttribute('aria-hidden');
    animateTiles(tiles);
  };

  const storedUser = sessionStorage.getItem('connectu_user');
  if (storedUser) {
    showMainView();
  }

  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(signupForm);

    const payload = {
      firstName: (formData.get('firstName') || '').trim(),
      lastName: (formData.get('lastName') || '').trim(),
      email: (formData.get('email') || '').trim(),
      dobDay: (formData.get('dobDay') || '').trim(),
      dobMonth: (formData.get('dobMonth') || '').trim(),
      dobYear: (formData.get('dobYear') || '').trim(),
      school: getSchoolValue(signupForm),
    };

    const { valid, message, data } = validateSignupPayload(payload);

    if (!valid) {
      window.alert(message);
      return;
    }

    try {
      sessionStorage.setItem('connectu_user', JSON.stringify(data));
    } catch (error) {
      // Ignore storage errors in private browsing
    }

    showMainView();
  });
};