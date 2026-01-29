import React from 'react';
import { SlideSlot } from '../SlideSlot';
import { SlideSlots } from '../../../types';

interface LayoutProps {
    slots: SlideSlots;
}

export const DefaultLayout: React.FC<LayoutProps> = ({ slots }) => (
    <div className="w-full h-full p-16 flex flex-col justify-center">
        {/* Default content (usually title + bullets) */}
        <div className="prose prose-xl dark:prose-invert max-w-none">
            <SlideSlot name="default" content={slots?.default} />
        </div>
    </div>
);
