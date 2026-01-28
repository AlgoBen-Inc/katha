
import { SlideRenderer } from './SlideRenderer';

interface SlideSlotProps {
    name: string;
    content?: string;
    className?: string;
}

export function SlideSlot({ name, content, className = "" }: SlideSlotProps) {
    if (!content) return null;

    return (
        <div className={`slide-slot-${name} ${className}`}>
            <SlideRenderer content={content} />
        </div>
    );
}
