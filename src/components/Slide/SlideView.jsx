import React from 'react';
import { getLayout } from './Layouts';

export function SlideView({ slide, scale = 1 }) {
    if (!slide) return null;

    const LayoutComponent = getLayout(slide.meta?.layout);

    // Scale Logic: We use CSS transform to scale the entire slide container
    const style = scale !== 1 ? {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${100 / scale}%`,
        height: `${100 / scale}%`,
    } : {};

    return (
        <div className="w-full h-full overflow-hidden bg-white dark:bg-black text-slate-900 dark:text-slate-100" style={style}>
            <LayoutComponent slots={slide.slots} />
        </div>
    );
}
