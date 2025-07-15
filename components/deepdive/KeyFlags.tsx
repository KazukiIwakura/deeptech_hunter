

import React from 'react';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import { ClipboardListIcon } from '../icons/ClipboardListIcon';
import type { KeyFlagsData } from '../../types';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface KeyFlagsProps {
    data: KeyFlagsData;
}

export const KeyFlags: React.FC<KeyFlagsProps> = ({ data }) => {
    const { positive: greenFlags, concerns: redFlags } = data;

    if (!greenFlags?.length && !redFlags?.length) {
        return null;
    }

    return (
        <div className="mt-12">
            <h2 className={cn('text-[22px] leading-snug font-bold text-main', "mb-4 flex items-center")}>
                <ClipboardListIcon className="w-6 h-6 mr-4 text-primary flex-shrink-0" />
                <span>投資判断の要点</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-10">
                {greenFlags?.length > 0 && (
                    <div>
                        <h3 className={cn('text-base leading-snug font-bold text-main', "text-success-text flex items-center mb-4")}>
                            <CheckCircleIcon className="w-5 h-5 mr-2" /> ポジティブ要素
                        </h3>
                        <ul className={cn("space-y-2", 'text-sm text-main-light leading-normal')}>
                            {greenFlags.map((flag, i) => <li key={i} className="p-4 bg-success-light rounded-lg text-success-text-dark flex items-start"><span className="mr-2 mt-0.5">•</span><span>{flag}</span></li>)}
                        </ul>
                    </div>
                )}
                 {redFlags?.length > 0 && (
                     <div>
                        <h3 className={cn('text-base leading-snug font-bold text-main', "text-danger-text flex items-center mb-4")}>
                            <XCircleIcon className="w-5 h-5 mr-2" /> 懸念点
                        </h3>
                        <ul className={cn("space-y-2", 'text-sm text-main-light leading-normal')}>
                            {redFlags.map((flag, i) => <li key={i} className="p-4 bg-danger-light rounded-lg text-danger-text flex items-start"><span className="mr-2 mt-0.5">•</span><span>{flag}</span></li>)}
                        </ul>
                    </div>
                 )}
            </div>
        </div>
    );
};