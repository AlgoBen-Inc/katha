import React from 'react';
import { SlideSlot } from '../SlideSlot';
import { SlideSlots, SlideMeta } from '../../../types';

interface LayoutProps {
    slots: SlideSlots;
    meta?: SlideMeta;
}

/**
 * Image Right Layout
 * 
 * Displays content on the left and an image on the right.
 * Image source comes from frontmatter `image` or the `::right::` slot.
 * 
 * Frontmatter options:
 * - `image`: URL or path to the image
 * - `imageClass`: Additional CSS classes for the image container
 */
export const ImageRightLayout: React.FC<LayoutProps> = ({ slots, meta }) => {
    const imageUrl = meta?.image as string | undefined;
    const imageClass = (meta?.imageClass as string) || '';

    return (
        <div className="w-full h-full grid grid-cols-2">
            {/* Left Column - Content */}
            <div className="h-full p-12 flex flex-col justify-center">
                <div className="prose prose-lg dark:prose-invert">
                    <SlideSlot name="default" content={slots?.default} />
                </div>
            </div>

            {/* Right Column - Image */}
            <div
                className={`h-full flex items-center justify-center overflow-hidden ${imageClass}`}
                style={{
                    backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {!imageUrl && slots?.right && (
                    <SlideSlot name="right" content={slots.right} />
                )}
            </div>
        </div>
    );
};
