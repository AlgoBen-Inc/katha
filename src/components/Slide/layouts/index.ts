import React from 'react';
import { SlideSlots, SlideMeta } from '../../../types';
import { DefaultLayout } from './DefaultLayout';
import { TitleLayout } from './TitleLayout';
import { SplitLayout } from './SplitLayout';
import { QuoteLayout } from './QuoteLayout';
import { SectionLayout } from './SectionLayout';
import { ImageLeftLayout } from './ImageLeftLayout';
import { ImageRightLayout } from './ImageRightLayout';

export interface LayoutProps {
    slots: SlideSlots;
    meta?: SlideMeta;
}

/**
 * Layout Registry
 * Maps layout names from frontmatter to React components.
 */
const LAYOUTS: Record<string, React.FC<LayoutProps>> = {
    default: DefaultLayout,
    title: TitleLayout,
    split: SplitLayout,
    quote: QuoteLayout,
    section: SectionLayout,
    'image-left': ImageLeftLayout,
    'image-right': ImageRightLayout,
    // Aliases
    'two-cols': SplitLayout,
    center: TitleLayout,
    'img-left': ImageLeftLayout,
    'img-right': ImageRightLayout,
};

/**
 * Get Layout Component
 * @param layoutName - Name from slide frontmatter (e.g., 'split')
 * @returns The corresponding Layout component, or DefaultLayout if not found.
 */
export function getLayout(layoutName?: string): React.FC<LayoutProps> {
    const key = layoutName?.toLowerCase() || 'default';
    return LAYOUTS[key] || LAYOUTS.default;
}

// Re-export layouts for direct use
export { DefaultLayout, TitleLayout, SplitLayout, QuoteLayout, SectionLayout, ImageLeftLayout, ImageRightLayout };

