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

    // If the tile is the social tile, navigate to the social life page
    if (key === 'social') {
      tile.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link navigation to use our animation
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
            window.location.href = './social-life.html';
          }, 180);
        } else {
          window.location.href = './social-life.html';
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
  const signInBtn = document.getElementById('signInBtn');
  let signInView = document.getElementById('signInView');
  let signinForm = document.getElementById('signinForm');
  let backToWelcomeFromSignInBtn = document.getElementById('backToWelcomeFromSignInBtn');

  if (!signupForm || !signupView || !mainView || !welcomeView) return;

  // Function to load LinkedIn profile picture
  const loadLinkedInProfile = () => {
    try {
      const userData = sessionStorage.getItem('connectu_user');
      if (userData) {
        const user = JSON.parse(userData);
        const linkedinUrl = user.linkedinUrl;
        
        if (linkedinUrl) {
          // Extract profile ID or username from LinkedIn URL
          function extractLinkedInProfileId(url) {
            const match = url.match(/linkedin\.com\/in\/([^\/\?]+)/i);
            if (match && match[1]) {
              return match[1];
            }
            return null;
          }

          // Function to test if an image URL is valid
          function testImageUrl(url) {
            return new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              let resolved = false;
              
              img.onload = () => {
                if (!resolved) {
                  resolved = true;
                  resolve(true);
                }
              };
              
              img.onerror = () => {
                if (!resolved) {
                  resolved = true;
                  resolve(false);
                }
              };
              
              const timeout = setTimeout(() => {
                if (!resolved) {
                  resolved = true;
                  resolve(false);
                }
              }, 3000);
              
              img.src = url;
            });
          }

          // Function to get LinkedIn profile picture URL
          async function fetchLinkedInProfilePicture(profileId) {
            if (!profileId) return null;

            const methods = [
              // Method 1: Try using CORS proxy to fetch og:image from LinkedIn page
              async () => {
                try {
                  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.linkedin.com/in/${profileId}/`)}`;
                  const response = await fetch(proxyUrl);
                  const data = await response.json();
                  
                  if (data.contents) {
                    // Pattern 1: Look for og:image meta tag (most reliable)
                    const ogImageMatch = data.contents.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
                    if (ogImageMatch && ogImageMatch[1]) {
                      const imageUrl = ogImageMatch[1].replace(/&amp;/g, '&');
                      const isValid = await testImageUrl(imageUrl);
                      if (isValid) return imageUrl;
                    }

                    // Pattern 2: Look for LinkedIn CDN image URLs
                    const cdnMatches = data.contents.match(/https:\/\/media\.licdn\.com\/dms\/image\/[^"'\s<>]+/gi);
                    if (cdnMatches && cdnMatches.length > 0) {
                      for (const url of cdnMatches.slice(0, 3)) {
                        const cleanUrl = url.replace(/[<>"']/g, '').split('?')[0];
                        const isValid = await testImageUrl(cleanUrl);
                        if (isValid) return cleanUrl;
                      }
                    }
                  }
                } catch (error) {
                  console.log('Method 1 failed:', error);
                }
                return null;
              },
              
              // Method 2: Try alternative proxy services
              async () => {
                try {
                  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(`https://www.linkedin.com/in/${profileId}/`)}`;
                  const response = await fetch(proxyUrl);
                  const html = await response.text();
                  
                  if (html) {
                    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
                    if (ogImageMatch && ogImageMatch[1]) {
                      const imageUrl = ogImageMatch[1].replace(/&amp;/g, '&');
                      const isValid = await testImageUrl(imageUrl);
                      if (isValid) return imageUrl;
                    }
                  }
                } catch (error) {
                  console.log('Method 2 failed:', error);
                }
                return null;
              }
            ];

            // Try each method in sequence
            for (const method of methods) {
              try {
                const result = await method();
                if (result) {
                  return result;
                }
              } catch (error) {
                console.log('Method failed:', error);
                continue;
              }
            }

            return null;
          }

          const profileId = extractLinkedInProfileId(linkedinUrl);
          
          if (profileId) {
            // Extract name from LinkedIn URL or use profile ID
            const displayName = profileId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            fetchLinkedInProfilePicture(profileId)
              .then(profilePictureUrl => {
                const profileImg = document.getElementById('linkedinProfile');
                const profileSection = document.getElementById('profileSection');
                const profileBanner = document.getElementById('profileBanner');
                const nameDisplay = document.getElementById('profileNameDisplay');

                if (nameDisplay) {
                  nameDisplay.textContent = displayName;
                }

                // Only display if we have a valid profile picture URL
                if (profilePictureUrl) {
                  if (profileImg) {
                    profileImg.src = profilePictureUrl;
                    profileImg.alt = `${displayName} LinkedIn Profile`;
                    profileImg.onload = function() {
                      // Only show section if profile picture loaded successfully
                      if (profileSection) {
                        profileSection.style.display = 'block';
                      }
                    };
                    profileImg.onerror = function() {
                      console.log('Profile picture failed to load from URL:', profilePictureUrl);
                      if (profileSection) {
                        profileSection.style.display = 'none';
                      }
                    };
                  }
                  
                  // Also add to banner if it exists
                  if (profileBanner) {
                    // Clear any existing content
                    profileBanner.innerHTML = '';
                    const bannerImg = document.createElement('img');
                    bannerImg.src = profilePictureUrl;
                    bannerImg.alt = `${displayName} banner`;
                    bannerImg.style.width = '100%';
                    bannerImg.style.height = '100%';
                    bannerImg.style.objectFit = 'cover';
                    bannerImg.onerror = function() {
                      // If banner image fails, remove it
                      profileBanner.innerHTML = '';
                      profileBanner.style.display = 'none';
                    };
                    bannerImg.onload = function() {
                      profileBanner.style.display = 'block';
                    };
                    profileBanner.appendChild(bannerImg);
                    profileBanner.classList.add('loaded');
                  }
                } else {
                  console.log('No valid profile picture URL found for:', profileId);
                  // Don't show profile section if no valid URL
                  if (profileSection) {
                    profileSection.style.display = 'none';
                  }
                  if (profileBanner) {
                    profileBanner.style.display = 'none';
                  }
                }
              })
              .catch(error => {
                console.error('Error loading LinkedIn profile picture:', error);
                const profileSection = document.getElementById('profileSection');
                const profileBanner = document.getElementById('profileBanner');
                if (profileSection) {
                  profileSection.style.display = 'none';
                }
                if (profileBanner) {
                  profileBanner.style.display = 'none';
                }
              });
          } else {
            console.log('Could not extract profile ID from LinkedIn URL:', linkedinUrl);
            const profileSection = document.getElementById('profileSection');
            const profileBanner = document.getElementById('profileBanner');
            if (profileSection) {
              profileSection.style.display = 'none';
            }
            if (profileBanner) {
              profileBanner.style.display = 'none';
            }
          }
        } else {
          // No LinkedIn URL provided
          const profileSection = document.getElementById('profileSection');
          const profileBanner = document.getElementById('profileBanner');
          if (profileSection) {
            profileSection.style.display = 'none';
          }
          if (profileBanner) {
            profileBanner.style.display = 'none';
          }
        }
      }
    } catch (error) {
      console.error('Error loading LinkedIn profile:', error);
      const profileSection = document.getElementById('profileSection');
      const profileBanner = document.getElementById('profileBanner');
      if (profileSection) {
        profileSection.style.display = 'none';
      }
      if (profileBanner) {
        profileBanner.style.display = 'none';
      }
    }
  };

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
      // Load LinkedIn profile picture when main view is shown
      loadLinkedInProfile();
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

  // Learn More button: welcome → brochure page
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
      window.location.href = './brochure.html';
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
    // Check if coming from brochure with signup action
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'signup') {
      showPage('signup');
    } else {
      showPage('welcome');
    }
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
      linkedinUrl: (formData.get('linkedinUrl') || '').trim(),
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