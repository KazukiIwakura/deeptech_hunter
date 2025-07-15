

import React from 'react';
import { HelpCircleIcon } from '../icons/HelpCircleIcon';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface KillerQuestionsProps {
    data: string[];
}

export const KillerQuestions: React.FC<KillerQuestionsProps> = ({ data: questions }) => {
    if (!questions || questions.length === 0) {
        return null;
    }

    return (
        <div className="mt-12">
            <h2 className={cn('text-[22px] leading-snug font-bold text-main', "mb-4 flex items-center")}>
                <HelpCircleIcon className="w-6 h-6 mr-4 text-primary flex-shrink-0" />
                <span>核心を突く質問</span>
            </h2>
            <div className="pl-10 space-y-4">
                {questions.map((q, i) => (
                    <div key={i} className={cn("flex items-start p-4 bg-primary-lighter/70 border-l-4 border-primary", 'text-sm text-main-light leading-normal')}>
                        <HelpCircleIcon className="w-5 h-5 mr-4 mt-0.5 text-primary flex-shrink-0" />
                        <p className="text-primary-text font-normal">{q}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}