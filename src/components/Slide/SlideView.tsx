import { Slide } from '../../types';
import { getLayout } from './Layouts';
import { cn } from '../../lib/utils';

interface SlideViewProps {
    slide: Slide;
    scale?: number;
}

export function SlideView({ slide, scale = 1 }: SlideViewProps) {
    // 1. Resolve Layout
    const layoutName = slide.meta?.layout || 'default';
    const LayoutComponent = getLayout(layoutName);

    // 2. Resolve Visuals
    const bg = slide.meta?.background;
    const customClass = slide.meta?.class;

    // Detect if bg is a URL (basic heuristic) or a color/gradient
    const isUrl = bg && (bg.startsWith('http') || bg.startsWith('/') || bg.startsWith('url('));
    const backgroundStyle = bg
        ? isUrl && !bg.startsWith('url(')
            ? `url(${bg})`
            : bg
        : undefined;

    // 3. Render
    return (
        <div
            className={cn(
                "relative w-full h-full overflow-hidden bg-cover bg-center",
                customClass
            )}
            style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                // Fallback to theme bg if no custom bg, BUT applied via CSS var in body usually. 
                // Here we apply explicit overrides.
                background: backgroundStyle,
                ...(slide.meta?.style || {})
            }}
            role="region"
            aria-label={`Slide ${slide.slug}`}
        >
            <LayoutComponent slots={slide.slots} meta={slide.meta} />
        </div>
    );
}
