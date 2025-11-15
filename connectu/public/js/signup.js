import { clampDayValue, clampYearValue, validateSignupPayload } from './validation.js';
import { loadUserFromSession, saveUserToSession } from './storage.js';

const getPrefersReducedMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const prefersReducedMotion = getPrefersReducedMotion();

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
    const key = tile.dataset.key;

    // If the tile is the education tile, navigate to a dedicated page
    if (key === 'education') {
      tile.addEventListener('click', () => {
        // play a quick feedback animation, then navigate
        if (!prefersReducedMotion) {
          tile.animate(
            [
              { transform: 'scale(1)', opacity: 1 },
              { transform: 'scale(1.03)', opacity: 1 },
              { transform: 'scale(1)', opacity: 1 },
            ],
            { duration: 220, easing: 'ease-out' }
          );
          // small timeout so the animation is felt before navigation
          window.setTimeout(() => {
            window.location.href = './education.html';
          }, 180);
        } else {
          window.location.href = './education.html';
        }
      });
      return;
    }

    // Default interaction for other tiles: subtle click animation
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

const fieldValue = (form, name) => {
  const element = form.elements.namedItem(name);
  if (!element || typeof element.value !== 'string') {
    return '';
  }
  return element.value.trim();
};

const getSchoolValue = (form) => {
  const selectValue = fieldValue(form, 'schoolSelect');
  const customValue = fieldValue(form, 'schoolCustom');
  return customValue || selectValue;
};

export const initSignupFlow = () => {
  const welcomeView = document.getElementById('welcomeView');
  const signupForm = document.getElementById('signupForm');
  const signupView = document.getElementById('signupView');
  const mainView = document.getElementById('mainView');
  const tiles = Array.from(document.querySelectorAll('[data-tile]'));
  const dobDayInput = document.getElementById('dobDay');
  const dobYearInput = document.getElementById('dobYear');

  // Navigation buttons
  const learnMoreBtn = document.getElementById('learnMoreBtn');
  const backToWelcomeBtn = document.getElementById('backToWelcomeBtn');
  const backToSignupBtn = document.getElementById('backToSignupBtn');

  if (!signupForm || !signupView || !mainView || !welcomeView) return;

  // Navigation function
  const showPage = (pageName) => {
    welcomeView.style.display = 'none';
    welcomeView.setAttribute('aria-hidden', 'true');
    signupView.style.display = 'none';
    signupView.setAttribute('aria-hidden', 'true');
    mainView.style.display = 'none';
    mainView.setAttribute('aria-hidden', 'true');

    if (pageName === 'welcome') {
      welcomeView.style.display = 'block';
      welcomeView.removeAttribute('aria-hidden');
    } else if (pageName === 'signup') {
      signupView.style.display = 'block';
      signupView.removeAttribute('aria-hidden');
    } else if (pageName === 'main') {
      mainView.style.display = 'block';
      mainView.removeAttribute('aria-hidden');
      animateTiles(tiles);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Learn More button: welcome → signup
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
      showPage('signup');
    });
  }

  // Back button on signup: signup → welcome
  if (backToWelcomeBtn) {
    backToWelcomeBtn.addEventListener('click', () => {
      showPage('welcome');
    });
  }

  // Back button on main: main → signup
  if (backToSignupBtn) {
    backToSignupBtn.addEventListener('click', () => {
      showPage('signup');
    });
  }

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

  const storedUser = loadUserFromSession();
  if (storedUser) {
    showPage('main');
  } else {
    showPage('welcome');
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

    saveUserToSession(data);

    showPage('main');
  });
};