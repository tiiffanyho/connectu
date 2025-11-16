import { initSignupFlow } from './signup.js';
import { renderConnectUApp } from './templates.js';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (!root) return;

  root.innerHTML = renderConnectUApp();
  initSignupFlow();
});