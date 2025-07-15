import React from 'react';

export const TimelineIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M22 6h-6" />
    <path d="M2 6h8" />
    <path d="M2 12h10" />
    <path d="M16 12h6" />
    <path d="M2 18h12" />
    <path d="M18 18h4" />
    <circle cx="10" cy="6" r="2" />
    <circle cx="14" cy="12" r="2" />
    <circle cx="16" cy="18" r="2" />
  </svg>
);
