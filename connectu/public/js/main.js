// Simple form validation and view toggle
(function() {
  const signupForm = document.getElementById('signupForm');
  const signupView = document.getElementById('signupView');
  const mainView = document.getElementById('mainView');
  const tiles = Array.from(document.querySelectorAll('.tile'));
  const backBtn = document.getElementById('backBtn');

  const dobYearInput = document.getElementById('dobYear');
  const dobDayInput = document.getElementById('dobDay');
  const dobMonthSelect = document.getElementById('dobMonth');

  // Navigation state
  let currentPage = 'signup'; // 'signup', 'main', or future tab names

  // Function to show a specific page
  function showPage(pageName) {
    // Hide all views
    signupView.style.display = 'none';
    mainView.style.display = 'none';
    mainView.setAttribute('aria-hidden', 'true');

    // Show the requested page
    if (pageName === 'signup') {
      signupView.style.display = 'block';
      currentPage = 'signup';
    } else if (pageName === 'main') {
      mainView.style.display = 'block';
      mainView.setAttribute('aria-hidden', 'false');
      currentPage = 'main';
      // animate tiles sequentially
      tiles.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 130);
      });
    }
  }

  // Enforce numeric-only and max 4 characters on DOB year
  if (dobYearInput) {
    dobYearInput.addEventListener('input', (e) => {
      const digits = (e.target.value || '').replace(/[^0-9]/g, '');
      e.target.value = digits.slice(0, 4);
    });
  }

  // Enforce numeric-only and 2-digit limit for day, clamp to 1-31
  if (dobDayInput) {
    dobDayInput.min = 1;
    dobDayInput.max = 31;
    dobDayInput.addEventListener('input', (e) => {
      const digits = (e.target.value || '').replace(/[^0-9]/g, '');
      e.target.value = digits.slice(0, 2);
      // clamp to valid range if possible
      let n = Number(e.target.value);
      if (!n) return;
      if (n > 31) n = 31;
      if (n < 1) n = '';
      e.target.value = n;
    });
  }

  // Safety: ensure month value stays within 1..12
  if (dobMonthSelect) {
    dobMonthSelect.addEventListener('change', (e) => {
      const v = (e.target.value || '').replace(/^0+/, '') || e.target.value;
      const n = Number(v);
      if (n > 12) {
        e.target.value = '12';
      }
      if (n < 1) {
        e.target.value = '';
      }
    });
  }

  // Back button: return to signup
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      showPage('signup');
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const fd = new FormData(signupForm);
      const firstName = fd.get('firstName')?.trim();
      const lastName = fd.get('lastName')?.trim();
      const day = (fd.get('dobDay') || '').trim();
      const month = (fd.get('dobMonth') || '').trim();
      const year = (fd.get('dobYear') || '').trim();
      const schoolSelect = fd.get('schoolSelect')?.trim();
      const email = fd.get('email')?.trim();

      // Validate required fields
      if (!firstName || !lastName || !day || !month || !year || !schoolSelect || !email) {
        alert('Please fill out all fields.');
        return;
      }

      // Ensure year is a 4-digit number
      if (!/^[0-9]{4}$/.test(year)) {
        alert('Please enter a valid 4-digit year for Date of Birth (YYYY).');
        return;
      }

      // Validate day/month combination
      const m = Number(month);
      const d = Number(day);
      const y = Number(year);
      if (!(m >= 1 && m <= 12)) {
        alert('Please select a valid month.');
        return;
      }
      const daysInMonth = (y, m) => new Date(y, m, 0).getDate();
      const maxDay = daysInMonth(y, m);
      if (!(d >= 1 && d <= maxDay)) {
        alert(`Please enter a valid day for the selected month (1-${maxDay}).`);
        return;
      }

      // Store user data in sessionStorage and show main page
      const dobCombined = `${year.padStart(4, '0')}-${month}-${day.padStart(2, '0')}`;
      try {
        sessionStorage.setItem(
          'connectu_user',
          JSON.stringify({
            firstName,
            lastName,
            email,
            school: schoolSelect,
            dob: dobCombined,
          })
        );
      } catch (err) {
        console.error('Failed to save user data:', err);
      }

      showPage('main');
    });
  }

  // Prepare tiles for future interactions (currently log)
  tiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      const key = tile.dataset.key;
      console.log('Tile clicked:', key);
      // temporary visual pulse
      if (tile.animate) {
        tile.animate([{ transform: 'scale(1.02)' }, { transform: 'scale(1)' }], {
          duration: 220,
        });
      }
      // TODO: Navigate to the section when implemented
      // showPage(key);
    });
  });

  // If user already signed up earlier in session, show main directly
  try {
    const u = sessionStorage.getItem('connectu_user');
    if (u) showPage('main');
    else showPage('signup');
  } catch (e) {
    console.error('Failed to check session:', e);
    showPage('signup');
  }
})();
