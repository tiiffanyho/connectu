import React from 'react';
import ReactDOM from 'react-dom/client';
import { SocialLifePage } from './social-life';
import { initSignupFlow } from './signup.js';
import { renderConnectUApp } from './templates.js';

// Detect current page from URL or route
const currentRoute = window.location.pathname;

function App() {
  if (currentRoute.includes('social')) {
    return <SocialLifePage />;
  }

  // ... other routes (home, opportunities, etc.)
  return <div>Home Page</div>;
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (!root) return;

  root.innerHTML = renderConnectUApp();
  initSignupFlow();
});