import { Slide } from '../../types';
import { getLayout } from './Layouts';

interface SlideViewProps {
    slide: Slide;
    scale?: number;
}

export function SlideView({ slide, scale = 1 }: SlideViewProps) {
    // 1. Resolve Layout
    const layoutName = slide.meta?.layout || 'default';
    const LayoutComponent = getLayout(layoutName);

    // 2. Render
    return (
        <div style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: '100%',
            height: '100%'
        }}>
            <LayoutComponent slots={slide.slots} />
        </div>
    );
}
