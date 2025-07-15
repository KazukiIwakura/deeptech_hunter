

import React from 'react';
import type { ResearchMode } from '../../types';
import { BalanceIcon } from '../icons/BalanceIcon';
import { ZoomInIcon } from '../icons/ZoomInIcon';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface ResearchModeSwitchProps {
    mode: ResearchMode;
    onChange: (mode: ResearchMode) => void;
    disabled?: boolean;
    disabledTooltip?: string;
}

const options: { mode: ResearchMode; icon: React.ReactNode; label: string, description: string }[] = [
    { mode: 'balanced', icon: <BalanceIcon className="w-5 h-5" />, label: 'バランス', description: 'AI知識とWeb検索を併用（推奨）。' },
    { mode: 'deep', icon: <ZoomInIcon className="w-5 h-5" />, label: '徹底調査', description: 'Web検索を多用し高精度。時間はかかる。' },
];

export const ResearchModeSwitch: React.FC<ResearchModeSwitchProps> = ({ mode, onChange, disabled = false, disabledTooltip }) => {
    return (
        <div className="relative group">
            <div className={cn('flex space-x-1 bg-neutral-200/70 backdrop-blur-sm p-1 rounded-full border border-neutral-300/30', disabled && 'opacity-60 cursor-not-allowed')}>
                {options.map((option) => (
                    <div key={option.mode} className={cn(!disabled && "relative group")}>
                        <button
                            onClick={() => !disabled && onChange(option.mode)}
                            disabled={disabled}
                            className={cn(
                                'relative px-2 sm:px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 leading-none',
                                mode === option.mode ? 'bg-white text-main shadow-md' : 'bg-transparent text-main-lighter hover:text-main hover:bg-white/50'
                            )}
                            aria-label={`リサーチモードを${option.label}に設定`}
                            aria-pressed={mode === option.mode}
                        >
                            <div className="flex items-center gap-1.5">
                                {option.icon}
                                <span className="hidden sm:inline">{option.label}</span>
                            </div>
                        </button>
                        {!disabled && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max max-w-[200px] p-2 bg-main text-white text-xs text-center rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                <h4 className="font-bold text-white">{option.label}</h4>
                                <p className="text-neutral-300">{option.description}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {disabled && disabledTooltip && (
                <div className={cn("absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max max-w-[200px] p-2 bg-main text-white text-xs text-center rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50", "group-hover:opacity-100")}>{disabledTooltip}</div>
            )}
        </div>
    );
};