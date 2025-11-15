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
  
  const renderTile = (key, title, copy) => `
    <div class="tile" data-key="${key}" data-tile>
      <h3>${title}</h3>
      <p>${copy}</p>
    </div>
  `;
  
  const renderTiles = () =>
    [
      ['education', 'Education', 'Resources, classes, and learning paths.'],
      ['opportunities', 'Opportunities', 'Jobs, internships, and scholarships.'],
      ['social', 'Social Life', 'Events, clubs, and meetups.'],
      ['community', 'Community', 'Forums, groups, and support networks.'],
    ]
      .map(([key, title, copy]) => renderTile(key, title, copy))
      .join('');
  
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
            <label for="schoolCustom">Other University</label>
            <input id="schoolCustom" name="schoolCustom" type="text" placeholder="Your school" />
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
    </section>
  `;
  
  const renderMainSection = () => `
    <section id="mainView" class="main-page" aria-hidden="true">
      <div class="brand">CONNECTU</div>
      <div class="subtitle">Choose a section to explore — these tiles will become full features inside the app.</div>
      <div class="tiles" id="tiles">
        ${renderTiles()}
      </div>
    </section>
  `;
  
  export const renderConnectUApp = () => `
    <div class="card">
      ${renderSignupSection()}
      ${renderMainSection()}
    </div>
  `;