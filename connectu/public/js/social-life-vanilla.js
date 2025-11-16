// Vanilla JS implementation of Social Life Hub

const mockEvents = [
  { id: 1, name: 'Tech Meetup & Pizza Night', category: 'social', date: 'Today', time: '7:00 PM', location: 'Student Center, Room 201', isOnline: false, interested: 24, suggested: true },
  { id: 2, name: 'CS First Years Study Session', category: 'study', date: 'Today', time: '6:30 PM', location: 'Library 3rd Floor', isOnline: false, interested: 18, suggested: false },
  { id: 3, name: 'Friday Night Vibes', category: 'party', date: 'Friday', time: '10:00 PM', location: 'Downtown Venue', isOnline: false, interested: 156, suggested: true },
  { id: 4, name: 'Yoga & Wellness Circle', category: 'wellness', date: 'Tomorrow', time: '5:30 PM', location: 'Gym Studio A', isOnline: false, interested: 12, suggested: false },
  { id: 5, name: 'International Student Potluck', category: 'social', date: 'This Week', time: '6:00 PM', location: 'Community Kitchen', isOnline: false, interested: 42, suggested: false },
  { id: 6, name: 'Online Gaming Tournament', category: 'gaming', date: 'Saturday', time: '8:00 PM', location: 'Online (Discord)', isOnline: true, interested: 87, suggested: false },
];

const mockClubs = [
  { id: 1, name: 'Developer Society', description: 'Build cool projects & learn tech together', type: 'tech', members: 324, tags: ['#Tech', '#Coding', '#StartupCulture'] },
  { id: 2, name: 'Board Game Club', description: 'Casual board games & strategy nights', type: 'hobby', members: 89, tags: ['#Gaming', '#Casual', '#Fun'] },
  { id: 3, name: 'Running Club', description: 'Early morning runs & fitness community', type: 'fitness', members: 156, tags: ['#Fitness', '#Wellness', '#Morning'] },
  { id: 4, name: 'Cultural Exchange Network', description: 'Celebrate diversity, share cultures & food', type: 'cultural', members: 203, tags: ['#International', '#Culture', '#Food'] },
  { id: 5, name: 'Entrepreneurship Hub', description: 'Build businesses & network with founders', type: 'professional', members: 112, tags: ['#Startups', '#Business', '#Mentorship'] },
];

const mockMeetups = [
  { id: 1, title: 'Late-night pizza run', time: 'Tonight, 11:30 PM', location: 'East Campus', peopleJoined: 4, capacity: 8 },
  { id: 2, title: 'Library study buddies', time: 'Tomorrow, 7:00 PM', location: 'Main Library, 3rd Floor', peopleJoined: 3, capacity: 6 },
  { id: 3, title: 'Rec center pickup basketball', time: 'Saturday, 6:00 PM', location: 'Athletic Center', peopleJoined: 6, capacity: 10 },
  { id: 4, title: 'Coffee & chill (no agenda)', time: 'Tomorrow, 3:00 PM', location: 'Campus Café', peopleJoined: 2, capacity: 5 },
];

const mockGroupChats = [
  { id: 1, name: 'CS First Years – Western', members: 412, vibe: 'Supportive & helpful', topic: 'course' },
  { id: 2, name: 'Friday Night Plans', members: 187, vibe: 'Chaotic & fun', topic: 'social' },
  { id: 3, name: 'Study Grind – Quiet Accountability', members: 94, vibe: 'Focused & motivating', topic: 'study' },
  { id: 4, name: 'Intramural Volleyball Squad', members: 23, vibe: 'Competitive & friendly', topic: 'sports' },
  { id: 5, name: 'Dorm 7 – Random Chaos', members: 156, vibe: 'Chaotic & chill', topic: 'dorm' },
  { id: 6, name: 'Mental Health & Wellness Circle', members: 67, vibe: 'Safe & supportive', topic: 'wellness' },
];

// Render events
function renderEvents(filter = 'all') {
  const grid = document.getElementById('events-grid');
  grid.innerHTML = '';

  const filtered = mockEvents.filter(e => {
    if (filter === 'all') return true;
    if (filter === 'today') return e.date === 'Today';
    if (filter === 'this-week') return e.date !== 'Today' && e.date !== 'Tomorrow';
    return e.category === filter;
  });

  filtered.forEach(event => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      ${event.suggested ? '<div style="position: absolute; top: 8px; right: 8px; background: #fbbf24; color: #78350f; font-size: 0.7rem; padding: 3px 8px; border-radius: 4px; font-weight: 700;">✨ For You</div>' : ''}
      <h4 class="card-title">${event.name}</h4>
      <span class="badge">${event.category}</span>
      <div style="font-size: 0.85rem; color: #475569;">
        <div>📅 ${event.date} at ${event.time}</div>
        <div>📍 ${event.location} ${event.isOnline ? '(Online)' : ''}</div>
        <div>👥 ${event.interested} interested</div>
      </div>
      <button class="btn btn-primary" style="margin-top: auto;">Learn More</button>
    `;
    grid.appendChild(card);
  });
}

// Render clubs
function renderClubs() {
  const grid = document.getElementById('clubs-grid');
  grid.innerHTML = '';

  mockClubs.forEach(club => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h4 class="card-title">${club.name}</h4>
      <p class="card-subtitle">${club.description}</p>
      <div style="display: flex; gap: 4px; flex-wrap: wrap;">
        ${club.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}
      </div>
      <div style="font-size: 0.85rem; color: #475569; margin-bottom: 6px;">👥 ${club.members} members</div>
      <button class="btn btn-primary" style="margin-top: auto;">Join Chat</button>
    `;
    grid.appendChild(card);
  });
}

// Render meetups
function renderMeetups() {
  const grid = document.getElementById('meetups-grid');
  grid.innerHTML = '';

  mockMeetups.forEach(meetup => {
    const fillPercentage = (meetup.peopleJoined / meetup.capacity) * 100;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h4 class="card-title">${meetup.title}</h4>
      <div style="font-size: 0.85rem; color: #475569;">
        <div>⏰ ${meetup.time}</div>
        <div>📍 ${meetup.location}</div>
      </div>
      <div style="font-size: 0.85rem;">
        <div style="margin-bottom: 4px;">👥 ${meetup.peopleJoined}/${meetup.capacity} joined</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${fillPercentage}%;"></div>
        </div>
      </div>
      <button class="btn btn-primary" style="margin-top: auto;">Join Meetup</button>
    `;
    grid.appendChild(card);
  });
}

// Render group chats
function renderGroupChats() {
  const grid = document.getElementById('chats-grid');
  grid.innerHTML = '';

  mockGroupChats.forEach(chat => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h4 class="card-title">${chat.name}</h4>
      <div style="font-size: 0.85rem; color: #475569;">
        <div>👥 ${chat.members} members</div>
        <div style="display: inline-block; background: #3b82f6; color: #fff; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; margin-top: 6px;">${chat.vibe}</div>
      </div>
      <button class="btn btn-primary" style="margin-top: auto;">Join Chat</button>
    `;
    grid.appendChild(card);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderEvents();
  renderClubs();
  renderMeetups();
  renderGroupChats();

  // Event filter handling
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderEvents(e.target.dataset.filter);
    });
  });
});

// Navigation
<nav>
  <a href="./index.html">Home</a>
  <a href="./social-life.html">Social Life</a>
  <a href="./opportunities.html">Opportunities</a>
</nav>