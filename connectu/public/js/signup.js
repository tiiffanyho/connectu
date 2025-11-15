import { clampDayValue, clampYearValue, validateSignupPayload } from './validation.js';
import { loadUserFromSession, saveUserToSession } from './storage.js';
import { renderSignInSection } from './templates.js';

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
  const signInBtn = document.getElementById('signInBtn');
  let signInView = document.getElementById('signInView');
  let signinForm = document.getElementById('signinForm');
  let backToWelcomeFromSignInBtn = document.getElementById('backToWelcomeFromSignInBtn');

  if (!signupForm || !signupView || !mainView || !welcomeView) return;

  // Navigation function
  const showPage = (pageName) => {
    welcomeView.style.display = 'none';
    welcomeView.setAttribute('aria-hidden', 'true');
    signupView.style.display = 'none';
    signupView.setAttribute('aria-hidden', 'true');
    mainView.style.display = 'none';
    mainView.setAttribute('aria-hidden', 'true');
    // hide sign-in view if it exists; it will be shown only for 'signin'
    if (signInView) {
      signInView.style.display = 'none';
      signInView.setAttribute('aria-hidden', 'true');
    }

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
    } else if (pageName === 'signin') {
      // create and show sign-in view on demand
      ensureSignInViewExists();
      if (signInView) {
        signInView.style.display = 'block';
        signInView.removeAttribute('aria-hidden');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Learn More button: welcome → signup
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
      showPage('signup');
    });
  }

  // Sign In button on welcome: welcome → signin
  if (signInBtn) {
    signInBtn.addEventListener('click', () => {
      // create sign-in section on demand (so it's not present until user requests it)
      ensureSignInViewExists();
      showPage('signin');
    });
  }

  // Sign Up CTA on welcome: welcome → signup
  const signUpCtaBtn = document.getElementById('signUpCtaBtn');
  if (signUpCtaBtn) {
    signUpCtaBtn.addEventListener('click', () => {
      showPage('signup');
    });
  }

  // Back button on signup: signup → welcome
  if (backToWelcomeBtn) {
    backToWelcomeBtn.addEventListener('click', () => {
      showPage('welcome');
    });
  }

  // Back button on sign-in: signin → welcome
  if (backToWelcomeFromSignInBtn) {
    backToWelcomeFromSignInBtn.addEventListener('click', () => {
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
      password: (formData.get('password') || '').trim(),
      confirmPassword: (formData.get('confirmPassword') || '').trim(),
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

  // helper to attach signin handlers once the signin form exists
  function attachSigninHandlers() {
    if (!signinForm) return;
    // avoid attaching multiple times
    if (signinForm.__attached) return;
    signinForm.__attached = true;

    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(signinForm);
      const email = (fd.get('signinEmail') || '').trim();
      const password = (fd.get('signinPassword') || '').trim();

      if (!email || !password) {
        window.alert('Please enter email and password to sign in.');
        return;
      }

      const stored = loadUserFromSession();
      if (!stored) {
        window.alert('No account found. Please sign up first.');
        return;
      }

      if (stored.email === email && stored.password === password) {
        window.alert(`Welcome back, ${stored.firstName || 'user'}!`);
        showPage('main');
      } else {
        window.alert('Invalid email or password.');
      }
    });
  }

  // create the sign-in section and attach handlers if it doesn't exist yet
  function ensureSignInViewExists() {
    if (signInView) return;
    const signupViewElem = document.getElementById('signupView');
    if (!signupViewElem) return;
    signupViewElem.insertAdjacentHTML('afterend', renderSignInSection());
    signInView = document.getElementById('signInView');
    // keep it hidden until explicitly shown by showPage('signin')
    if (signInView) {
      signInView.style.display = 'none';
      signInView.setAttribute('aria-hidden', 'true');
    }
    signinForm = document.getElementById('signinForm');
    backToWelcomeFromSignInBtn = document.getElementById('backToWelcomeFromSignInBtn');

    if (backToWelcomeFromSignInBtn) {
      backToWelcomeFromSignInBtn.addEventListener('click', () => {
        showPage('welcome');
      });
    }

    attachSigninHandlers();
  }
};