import React from 'react';
import { SlideSlot } from './SlideSlot';

// 1. Default Layout (Title + Content)
const DefaultLayout = ({ slots }) => (
    <div className="w-full h-full p-16 flex flex-col justify-center">
        {/* Default content (usually title + bullets) */}
        <div className="prose prose-xl dark:prose-invert max-w-none">
            <SlideSlot name="default" content={slots?.default} />
        </div>
    </div>
);

// 2. Title-Only Layout (Centered Big)
const TitleLayout = ({ slots }) => (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
        <div className="prose prose-2xl dark:prose-invert">
            <SlideSlot name="default" content={slots?.default} />
        </div>
    </div>
);

// 3. Two-Column Split Layout (New!)
// Uses: ::default:: (left) and ::right:: (right)
const SplitLayout = ({ slots }) => (
    <div className="w-full h-full grid grid-cols-2">
        {/* Left Column */}
        <div className="h-full p-12 flex flex-col justify-center bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
            <div className="prose prose-lg dark:prose-invert">
                <SlideSlot name="default" content={slots?.default} />
            </div>
        </div>

        {/* Right Column */}
        <div className="h-full p-12 flex flex-col justify-center bg-white dark:bg-black">
            <div className="prose prose-lg dark:prose-invert">
                <SlideSlot name="right" content={slots?.right} />
            </div>
        </div>
    </div>
);

// Registry
const LAYOUTS = {
    default: DefaultLayout,
    title: TitleLayout,
    split: SplitLayout
};

export const getLayout = (layoutName) => {
    const key = layoutName?.toLowerCase();
    return LAYOUTS[key] || LAYOUTS.default;
};
