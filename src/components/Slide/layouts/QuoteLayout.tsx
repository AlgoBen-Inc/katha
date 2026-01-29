import React from 'react';
import { SlideSlot } from '../SlideSlot';
import { SlideSlots } from '../../../types';

interface LayoutProps {
    slots: SlideSlots;
}

/**
 * Quote Layout
 * Displays a prominent blockquote with large, centered text.
 */
export const QuoteLayout: React.FC<LayoutProps> = ({ slots }) => (
    <div className="w-full h-full flex flex-col items-center justify-center p-16">
        <blockquote className="text-3xl md:text-4xl lg:text-5xl italic font-light text-center max-w-4xl leading-relaxed">
            <SlideSlot name="default" content={slots?.default} />
        </blockquote>
    </div>
);
