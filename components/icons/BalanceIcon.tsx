import React from 'react';

export const BalanceIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M2 6h20" />
    <path d="M12 6V2" />
    <path d="M4 10l5-5" />
    <path d="M20 10l-5-5" />
    <path d="M12 22V10" />
    <path d="M6 18l-4 4" />
    <path d="M18 18l4 4" />
  </svg>
);
