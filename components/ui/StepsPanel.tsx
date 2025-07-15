


import React, { useEffect } from 'react';
import type { AiStep } from '../../types';
import { XCircleIcon } from '../icons/XCircleIcon';
import { TimelineIcon } from '../icons/TimelineIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { Button } from '../common/Button';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface StepsPanelProps {
  steps: AiStep[];
  isOpen: boolean;
  onClose: () => void;
}

const StatusIcon: React.FC<{ status: AiStep['status'] }> = ({ status }) => {
    const baseClasses = "w-6 h-6 rounded-full flex items-center justify-center ring-8 ring-neutral-50";
    switch(status) {
        case 'completed':
            return (
                <div className={cn(baseClasses, "bg-success-light")}>
                    <CheckCircleIcon className="w-6 h-6 text-success" />
                </div>
            );
        case 'in-progress':
            return (
                <div className={cn(baseClasses, "bg-primary-lighter")}>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        case 'error':
            return (
                <div className={cn(baseClasses, "bg-danger-light")}>
                    <XCircleIcon className="w-6 h-6 text-danger" />
                </div>
            );
        case 'pending':
        default:
            return <div className={cn(baseClasses, "bg-neutral-200 border-2 border-neutral-300")}></div>;
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
        className="absolute top-0 right-0 h-full w-full max-w-lg bg-neutral-50 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideInFromRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' }}
      >
        <header className="flex items-center justify-between p-4 border-b border-neutral-200 bg-white/70 backdrop-blur-sm sticky top-0">
          <h2 id="steps-panel-title" className={cn('text-[22px] leading-snug font-bold text-main', "flex items-center")}>
            <TimelineIcon className="w-6 h-6 mr-3 text-primary" />
            AI Execution Steps
          </h2>
          <Button onClick={onClose} variant="ghost" size="medium" isIconOnly aria-label="Close">
            <XCircleIcon className="w-6 h-6" />
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <ol className="relative border-l-2 border-neutral-200 ml-4">
              {steps.map((step) => (
                <li key={step.id} className="mb-8 ml-8">
                    <span className="absolute -left-4 top-0">
                      <StatusIcon status={step.status} />
                    </span>
                    <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-base leading-snug font-bold text-main">{step.title}</p>
                            {step.status !== 'pending' && (
                               <span className={cn("flex-shrink-0 ml-2 font-mono", 'text-sm text-main-light leading-normal', step.status === 'in-progress' ? 'italic text-main-lighter' : 'text-main-lighter')}>
                                {step.status === 'in-progress' ? 'running...' : getDuration(step.startTime, step.endTime)}
                               </span>
                            )}
                        </div>
                        <p className="text-sm text-main-light leading-normal">{step.description}</p>
                        {step.status === 'error' && step.error && (
                            <div className={cn("mt-4 text-danger-text bg-danger-light p-2 rounded-md break-words font-semibold border border-danger", 'text-sm text-main-light leading-normal')}>
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