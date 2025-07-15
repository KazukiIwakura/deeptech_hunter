import React from 'react';

export const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.4.63 2.64 1.55 3.42L5 14h14l-4.05-4.08C15.87 9.14 16.5 7.9 16.5 6.5A4.5 4.5 0 0 0 12 2Z" />
    <path d="M12 14v8" />
    <path d="M5 14h14" />
    <path d="M17.5 10.5c.39.58.78 1.25 1.12 2M6.38 12.5c.34-.75.73-1.42 1.12-2" />
    <path d="M5 18h.01" />
    <path d="M6 22h.01" />
    <path d="M18 18h.01" />
    <path d="M19 22h.01" />
    <path d="M9 18h.01" />
    <path d="M15 18h.01" />
  </svg>
);
