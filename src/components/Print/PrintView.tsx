import { useState, useEffect } from 'react';
import { parseSlides } from '../../utils/slideParser';
import rawSlides from 'virtual:slides';
import { SlideView } from '../Slide/SlideView';
import { Slide } from '../../types';

export function PrintView() {
    const [slides, setSlides] = useState<Slide[]>([]);

    useEffect(() => {
        if (rawSlides) {
            setSlides(parseSlides(rawSlides));
        }
    }, []);

    if (!slides.length) return <div>Loading...</div>;

    return (
        <div className="print-container">
            <style>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        -webkit-print-color-adjust: exact;
                    }
                }
                .print-slide {
                    break-after: always;
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                    border-bottom: 1px dashed #ccc; /* Visible in web view, hidden in print if desired */
                }
                @media print {
                    .print-slide {
                        border: none;
                    }
                }
            `}</style>

            {slides.map((slide, i) => (
                <div key={i} className="print-slide relative">
                    {/* Notes in print view? Maybe optional later */}
                    <SlideView slide={slide} />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                        {i + 1}
                    </div>
                </div>
            ))}
        </div>
    );
}
