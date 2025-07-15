



import React, { useEffect } from 'react';
import type { AiStep } from '../types';
import { XCircleIcon } from './icons/XCircleIcon';
import { TimelineIcon } from './icons/TimelineIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { Button } from './common/Button';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface StepsPanelProps {
  steps: AiStep[];
  isOpen: boolean;
  onClose: () => void;
}

const StatusIcon: React.FC<{ status: AiStep['status'] }> = ({ status }) => {
    const baseClasses = "w-6 h-6 rounded-full flex items-center justify-center ring-8 ring-slate-50";
    switch(status) {
        case 'completed':
            return (
                <div className={cn(baseClasses, "bg-emerald-100")}>
                    <CheckCircleIcon className="w-6 h-6 text-emerald-500" />
                </div>
            );
        case 'in-progress':
            return (
                <div className={cn(baseClasses, "bg-blue-100")}>
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        case 'error':
            return (
                <div className={cn(baseClasses, "bg-red-100")}>
                    <XCircleIcon className="w-6 h-6 text-red-500" />
                </div>
            );
        case 'pending':
        default:
            return <div className={cn(baseClasses, "bg-slate-200 border-2 border-slate-300")}></div>;
    }
};

const getDuration = (startTime?: number, endTime?: number): string | null => {
    if (!startTime || !endTime) return null;
    const duration = (endTime - startTime) / 1000;
    if (duration < 0.1) return `<0.1s`;
    return `${duration.toFixed(2)}s`;
};

export const StepsPanel: React.FC<StepsPanelProps> = ({ steps, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/30 z-50 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="steps-panel-title"
    >
      <div 
        className="absolute top-0 right-0 h-full w-full max-w-lg bg-slate-50 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideInFromRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' }}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200 bg-white/70 backdrop-blur-sm sticky top-0">
          <h2 id="steps-panel-title" className={cn('text-[22px] leading-snug font-bold text-slate-800', "flex items-center")}>
            <TimelineIcon className="w-6 h-6 mr-3 text-blue-600" />
            AI Execution Steps
          </h2>
          <Button onClick={onClose} variant="ghost" size="medium" isIconOnly aria-label="Close">
            <XCircleIcon className="w-6 h-6" />
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <ol className="relative border-l-2 border-slate-200 ml-4">
              {steps.map((step) => (
                <li key={step.id} className="mb-8 ml-8">
                    <span className="absolute -left-4 top-0">
                      <StatusIcon status={step.status} />
                    </span>
                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-base leading-snug font-bold text-slate-800">{step.title}</p>
                            {step.status !== 'pending' && (
                               <span className={cn("flex-shrink-0 ml-2 font-mono", 'text-sm text-slate-600 leading-normal', step.status === 'in-progress' ? 'italic text-slate-500' : 'text-slate-500')}>
                                {step.status === 'in-progress' ? 'running...' : getDuration(step.startTime, step.endTime)}
                               </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-600 leading-normal">{step.description}</p>
                        {step.status === 'error' && step.error && (
                            <div className={cn("mt-4 text-red-700 bg-red-100 p-2 rounded-md break-words font-semibold border border-red-200", 'text-sm text-slate-600 leading-normal')}>
                                <span className="font-bold">Error:</span> {step.error}
                            </div>
                        )}
                    </div>
                </li>
              ))}
            </ol>
        </main>
      </div>
      <style>{`
        @keyframes slideInFromRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};