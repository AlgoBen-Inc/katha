import { useNavigate } from 'react-router-dom';
import { useDeck } from '../hooks/useDeck';
import { SlideView } from './Slide/SlideView';

/**
 * Overview Component
 * 
 * Displays all slides in a grid for quick navigation.
 * Each slide is rendered as a scaled-down thumbnail.
 */
export function Overview() {
    const { slides, loading, error } = useDeck();
    const navigate = useNavigate();

    if (loading) return <div className="p-8 text-slate-500 animate-pulse">Loading overview...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-slate-900 p-8 text-white">
            <header className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Slide Overview</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded transition text-sm"
                >
                    Back to Slides
                </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {slides.map((slide, index) => {
                    const slideNumber = index + 1;
                    const theme = slide.meta?.theme || 'default';

                    return (
                        <div key={index} className="flex flex-col gap-2 group">
                            <div
                                onClick={() => navigate(`/${slideNumber}`)}
                                className="relative aspect-video bg-white rounded-lg shadow-xl overflow-hidden cursor-pointer border-2 border-transparent group-hover:border-blue-500 transition-all duration-300 transform group-hover:-translate-y-1"
                                data-theme={theme}
                            >
                                {/* 
                                    Thumbnail Scaling logic:
                                    SlideView expects to fill its container (w-full h-full).
                                    Since the container is aspect-video (16:9) and fixed width,
                                    we calculate the scale to fit the base design size (e.g. 1920x1080).
                                    But SlideView already uses h-full w-full, so we just need 
                                    to ensure the fonts/content scale too.
                                */}
                                <div className="absolute inset-0 w-[1280px] h-[720px] origin-top-left scale-[0.2] sm:scale-[0.15] md:scale-[0.2] lg:scale-[0.25] pointer-events-none">
                                    {/* Note: In a real app we'd use ResizeObserver to scale perfectly, 
                                        but for an MVP a fixed base size with CSS scaling works well. */}
                                    <div className="w-full h-full" style={{ width: 1280, height: 720 }}>
                                        <SlideView slide={slide} />
                                    </div>
                                </div>

                                {/* Overlay to prevent interactions with slide content */}
                                <div className="absolute inset-0 bg-transparent z-10" />
                            </div>

                            <div className="flex justify-between items-center px-1">
                                <span className="text-xs font-mono text-slate-500">Slide {slideNumber}</span>
                                <span className="text-xs text-slate-400 opacity-60 truncate max-w-[150px]">
                                    {slide.meta?.title || `Slide ${slide.slug}`}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
