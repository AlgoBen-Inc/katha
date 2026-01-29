import React from 'react';
import { SlideSlot } from '../SlideSlot';
import { SlideSlots } from '../../../types';

interface LayoutProps {
    slots: SlideSlots;
}

/**
 * Two-Column Split Layout
 * Uses: ::default:: (left) and ::right:: (right)
 */
export const SplitLayout: React.FC<LayoutProps> = ({ slots }) => (
    <div className="w-full h-full grid grid-cols-2">
        {/* Left Column */}
        <div className="h-full p-12 flex flex-col justify-center border-r border-slate-200 dark:border-slate-800">
            <div className="prose prose-lg dark:prose-invert">
                <SlideSlot name="default" content={slots?.default} />
            </div>
        </div>

        {/* Right Column */}
        <div className="h-full p-12 flex flex-col justify-center">
            <div className="prose prose-lg dark:prose-invert">
                <SlideSlot name="right" content={slots?.right || ''} />
            </div>
        </div>
    </div>
);
