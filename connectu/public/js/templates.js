const universityList = [
  'Algoma University',
  'Brock University',
  'Carleton University',
  "King's University College (Western)",
  'Lakehead University',
  'Laurentian University',
  'McMaster University',
  'Nipissing University',
  'OCAD University',
  'Ontario Tech University',
  "Queen's University",
  'Royal Military College of Canada',
  'Toronto Metropolitan University',
  'Trent University',
  'Université de Hearst',
  'Université de Sudbury',
  'University of Guelph',
  'University of Ottawa',
  'University of Sudbury',
  'University of Toronto',
  'University of Waterloo',
  'University of Windsor',
  'Western University',
  'Wilfrid Laurier University',
  'York University',
];

const renderUniversityOptions = () =>
  ['<option value="">Select your university</option>', ...universityList.map((school) => `<option>${school}</option>`)].join('');

const renderTile = (key, title, copy) => {
  // Make the 'education' tile a real button so it can open a detailed education page
  if (key === 'education') {
    return `
      <button id="educationBtn" class="tile" data-key="${key}" data-tile aria-label="Open Education">
        <h3>${title}</h3>
        <p>${copy}</p>
      </button>
    `;
  }

  return `
    <div class="tile" data-key="${key}" data-tile>
      <h3>${title}</h3>
      <p>${copy}</p>
    </div>
  `;
};

const renderTiles = () =>
  [
    ['education', 'Education', 'Resources, classes, and learning paths.'],
    ['opportunities', 'Opportunities', 'Jobs, internships, and scholarships.'],
    ['social', 'Social Life', 'Events, clubs, and meetups.'],
    ['community', 'Community', 'Forums, groups, and support networks.'],
  ]
    .map(([key, title, copy]) => renderTile(key, title, copy))
    .join('');

const renderWelcomeSection = () => `
  <section id="welcomeView" class="welcome-view" aria-live="polite">
    <div class="welcome-content">
      <h1 class="welcome-title">CONNECTU</h1>
      <p class="welcome-subtitle">Connect with Your College Community</p>
      <p class="welcome-description">
        ConnectU is your all-in-one platform to explore education resources, discover opportunities, build your social network, and engage with your campus community. Join thousands of students already connecting today.
      </p>
      <div class="welcome-features">
        <div class="feature-item">
          <h3>Education</h3>
          <p>Access resources, classes, and learning paths</p>
        </div>
        <div class="feature-item">
          <h3>Opportunities</h3>
          <p>Find jobs, internships, and scholarships</p>
        </div>
        <div class="feature-item">
          <h3>Social Life</h3>
          <p>Discover events, clubs, and meetups</p>
        </div>
        <div class="feature-item">
          <h3>Community</h3>
          <p>Join forums, groups, and support networks</p>
        </div>
      </div>
      <div class="welcome-actions">
        <button id="learnMoreBtn" class="btn-secondary cta">Learn More</button>
        <button id="signInBtn" class="btn-secondary cta">Sign In</button>
        <button id="signUpCtaBtn" class="btn-primary cta">Sign Up</button>
      </div>
    </div>
  </section>
`;

export const renderSignInSection = () => `
  <section id="signInView" class="signup" aria-live="polite">
    <h1>Welcome Back</h1>
    <p>Sign in with your school email and password.</p>
    <form id="signinForm" novalidate>
      <div class="field-group">
        <div class="field full">
          <label for="signinEmail">School Email</label>
          <input id="signinEmail" name="signinEmail" type="email" placeholder="you@school.edu" autocomplete="email" required />
        </div>
        <div class="field full">
          <label for="signinPassword">Password</label>
          <input id="signinPassword" name="signinPassword" type="password" placeholder="Your password" required />
        </div>
      </div>
      <div style="margin-top: 1rem; text-align: center">
        <button type="submit" class="btn-primary">Sign In</button>
      </div>
    </form>
    <div class="nav-controls">
      <button id="backToWelcomeFromSignInBtn" class="btn-secondary">← Back</button>
    </div>
  </section>
`;

const renderSignupSection = () => `
  <section id="signupView" class="signup" aria-live="polite">
    <h1>CONNECTU</h1>
    <p>
      Create an account to explore education, opportunities, social life, and community with other students.
    </p>
    <form id="signupForm" novalidate>
      <div class="field-group">
        <div class="field">
          <label for="firstName">First Name</label>
          <input id="firstName" name="firstName" type="text" placeholder="Jane" autocomplete="given-name" required />
        </div>
        <div class="field">
          <label for="lastName">Last Name</label>
          <input id="lastName" name="lastName" type="text" placeholder="Doe" autocomplete="family-name" required />
        </div>
        <div class="field full">
          <label for="dobDay">Date of Birth</label>
          <div class="dob-row">
            <input
              id="dobDay"
              name="dobDay"
              type="text"
              inputmode="numeric"
              maxlength="2"
              placeholder="DD"
              aria-label="Day"
              required
            />
            <select id="dobMonth" name="dobMonth" aria-label="Month" required>
              <option value="">MM</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            <input
              id="dobYear"
              name="dobYear"
              type="text"
              inputmode="numeric"
              maxlength="4"
              placeholder="YYYY"
              aria-label="Year"
              required
            />
          </div>
        </div>
        <div class="field">
          <label for="schoolSelect">University</label>
          <select id="schoolSelect" name="schoolSelect" required>
            ${renderUniversityOptions()}
          </select>
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" placeholder="At least 8 characters" required />
        </div>
        <div class="field">
          <label for="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm password" required />
        </div>
        <div class="field full">
          <label for="email">School Email</label>
          <input id="email" name="email" type="email" placeholder="you@school.edu" autocomplete="email" required />
        </div>
      </div>
      <div style="margin-top: 1rem; text-align: center">
        <button type="submit" class="btn-primary">Sign Up</button>
      </div>
    </form>
    <div class="nav-controls">
      <button id="backToWelcomeBtn" class="btn-secondary">← Back</button>
    </div>
  </section>
`;

const renderMainSection = () => `
  <section id="mainView" class="main-page" aria-hidden="true">
    <div class="brand">CONNECTU</div>
    <div class="subtitle">Choose a section to explore — these tiles will become full features inside the app.</div>
    <div class="tiles" id="tiles">
      ${renderTiles()}
    </div>
    <div class="nav-controls">
      <button id="backToSignupBtn" class="btn-secondary" aria-label="Back">←</button>
    </div>
  </section>
`;

export const renderConnectUApp = () => `
  <div class="card">
    ${renderWelcomeSection()}
    ${renderSignupSection()}
    ${renderMainSection()}
  </div>
`;