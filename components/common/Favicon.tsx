

import React, { useState, useEffect } from 'react';
import { GlobeIcon } from '../icons/GlobeIcon';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

const getFaviconUrl = (domain: string, size: number = 32): string | null => {
    if (!domain || typeof domain !== 'string' || domain.trim() === '') return null;
    // Use a reliable favicon service.
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

interface FaviconProps {
    domain: string;
    alt?: string;
    className?: string;
}

export const Favicon: React.FC<FaviconProps> = ({ domain, alt, className }) => {
    const [src, setSrc] = useState<string | null>(getFaviconUrl(domain));
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setSrc(getFaviconUrl(domain));
        setHasError(false);
    }, [domain]);

    const handleError = () => {
        setHasError(true);
    };
    
    const altText = alt || `${domain} favicon`;

    if (hasError || !src) {
        return (
            <div className={cn("flex items-center justify-center bg-neutral-100 border border-neutral-200", className)} aria-label={altText}>
                <GlobeIcon className="w-1/2 h-1/2 text-neutral-400" />
            </div>
        );
    }
    
    return (
        <img 
            src={src} 
            onError={handleError} 
            alt={altText} 
            className={cn("bg-white border border-neutral-200 object-cover", className)}
            aria-hidden="true"
        />
    );
};