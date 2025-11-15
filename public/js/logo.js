const LOGO_MARKUP = `
  <svg viewBox="0 0 56 56" role="img" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="cuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8b5cf6" />
        <stop offset="100%" stop-color="#06b6d4" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="52" height="52" rx="14" fill="url(#cuGrad)" opacity="0.15" />
    <path
      d="M18.5 18h19c2.485 0 4.5 2.015 4.5 4.5v11c0 2.485-2.015 4.5-4.5 4.5h-5.75l-3.25 3-3.25-3H18.5C16.015 40 14 37.985 14 35.5v-11C14 20.015 16.015 18 18.5 18Z"
      stroke="url(#cuGrad)"
      stroke-width="2.5"
      fill="none"
    />
    <path
      d="M23 26.25c0-1.657 1.343-3 3-3h4c1.657 0 3 1.343 3 3v.5c0 1.657-1.343 3-3 3h-4c-1.657 0-3-1.343-3-3v-.5Z"
      fill="#e6eef8"
    />
    <circle cx="23" cy="31.5" r="2.5" fill="#e6eef8" />
    <circle cx="33" cy="31.5" r="2.5" fill="#e6eef8" />
  </svg>
`;

export const renderLogoBadge = () => `
  <div class="logo-badge" aria-label="ConnectU logo">${LOGO_MARKUP}</div>
`;
