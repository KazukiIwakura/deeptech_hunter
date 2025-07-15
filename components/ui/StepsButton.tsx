
import React from 'react';
import { TimelineIcon } from '../icons/TimelineIcon';
import type { AiStep } from '../../types';

interface StepsButtonProps {
  steps: AiStep[];
  onClick: () => void;
}

export const StepsButton: React.FC<StepsButtonProps> = ({ steps, onClick }) => {
  if (steps.length === 0) return null;

  const completedCount = steps.filter(s => s.status === 'completed' || s.status === 'error').length;
  const totalCount = steps.length;
  const isInProgress = steps.some(s => s.status === 'in-progress');

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white border border-slate-200/80 rounded-full shadow-sm text-base font-medium text-slate-700 hover:bg-slate-100/70 hover:border-slate-300 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
      aria-label={`View ${totalCount} AI steps`}
    >
      <TimelineIcon className={`w-5 h-5 text-slate-500 ${isInProgress ? 'animate-pulse' : ''}`} />
      <span className="font-semibold">Steps ({completedCount}/{totalCount})</span>
    </button>
  );
};
