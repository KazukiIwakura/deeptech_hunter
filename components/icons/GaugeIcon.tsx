import React from 'react';

export const GaugeIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 22a8 8 0 0 0 8-8" />
    <path d="M22 14a8 8 0 0 0-8-8" />
    <path d="M14 14a8 8 0 0 0-8 8" />
    <path d="M4 14a8 8 0 0 0 8 8" />
    <path d="M12 12l5-5" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
  </svg>
);