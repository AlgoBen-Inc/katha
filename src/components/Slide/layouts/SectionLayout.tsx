import React from 'react';
import { SlideSlot } from '../SlideSlot';
import { SlideSlots } from '../../../types';

interface LayoutProps {
    slots: SlideSlots;
}

/**
 * Section Layout
 * Used to mark the beginning of a new presentation section.
 * Large, bold, centered heading.
 */
export const SectionLayout: React.FC<LayoutProps> = ({ slots }) => (
    <div className="w-full h-full flex flex-col items-center justify-center p-16 bg-slate-900 text-white">
        <div className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-center">
            <SlideSlot name="default" content={slots?.default} />
        </div>
    </div>
);
