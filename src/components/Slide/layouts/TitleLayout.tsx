import React from 'react';
import { SlideSlot } from '../SlideSlot';
import { SlideSlots } from '../../../types';

interface LayoutProps {
    slots: SlideSlots;
}

export const TitleLayout: React.FC<LayoutProps> = ({ slots }) => (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-12">
        <div className="prose prose-2xl dark:prose-invert max-w-none">
            <SlideSlot name="default" content={slots?.default} />
        </div>
    </div>
);
