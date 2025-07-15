import React from 'react';

export const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-7 7c0 3.03 1.4 5.5 3.33 6.67" />
    <path d="M12 2a7 7 0 0 1 7 7c0 3.03-1.4 5.5-3.33 6.67" />
  </svg>
);