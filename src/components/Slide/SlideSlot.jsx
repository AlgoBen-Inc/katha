import React from 'react';
import { SlideRenderer } from './SlideRenderer';

export function SlideSlot({ name, content, className = "" }) {
    if (!content) return null;

    return (
        <div className={`slide-slot-${name} ${className}`}>
            <SlideRenderer content={content} />
        </div>
    );
}
