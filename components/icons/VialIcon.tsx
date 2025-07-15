
import React from 'react';

export const VialIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M8 2h8" />
    <path d="M7 2v10c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M8 22h8" />
    <path d="M7 16h10" />
  </svg>
);