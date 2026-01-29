import { useState, useEffect } from 'react';
import { SlideView } from '../Slide/SlideView';
import { useDeck } from '../../hooks/useDeck';
import { useSlideRouter } from '../../hooks/useSlideRouter';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export function PresenterController() {
    // 1. Data
    const { slides, loading } = useDeck();

    // 2. Navigation
    const { currentIndex, next, prev } = useSlideRouter(slides);

    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    // Timer
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const currentSlide = slides[currentIndex - 1];
    const nextSlideContent = slides[currentIndex]; // slides[i] is the next one (0-based vs 1-based)

    if (loading || !currentSlide) return <div className="p-10 text-white bg-slate-900 h-screen">Loading Presentation...</div>;

    return (
        <div className="w-screen h-screen bg-neutral-900 text-white flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="h-14 border-b border-neutral-700 flex items-center justify-between px-6 bg-neutral-950">
                <span className="font-bold text-neutral-400">KATHA PRESENTER</span>
                <span className="font-mono text-xl">{currentTime}</span>
                <div className="text-sm text-neutral-500">
                    Slide {currentIndex} / {slides.length}
                </div>
            </div>

            {/* Main Grid */}
            <div className="flex-1 grid grid-cols-2 gap-6 p-6">

                {/* Left Col: Current Slide & Controls */}
                <div className="flex flex-col gap-6">
                    {/* Current Slide Preview */}
                    <div className="flex-1 border border-neutral-700 rounded-lg overflow-hidden bg-black relative">
                        <div className="absolute inset-0 pointer-events-none"> {/* Disable interaction in preview */}
                            <SlideView slide={currentSlide} scale={0.5} />
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="h-24 flex items-center justify-center gap-4 bg-neutral-800 rounded-lg">
                        <Button
                            className="w-32 h-12 text-lg"
                            variant="secondary"
                            onClick={prev}
                            disabled={currentIndex <= 1}
                        >
                            PREV
                        </Button>
                        <Button
                            className="w-32 h-12 text-lg bg-blue-600 hover:bg-blue-500 text-white"
                            onClick={next}
                            disabled={currentIndex >= slides.length}
                        >
                            NEXT
                        </Button>
                    </div>
                </div>

                {/* Right Col: Next Slide & Notes */}
                <div className="flex flex-col gap-6">
                    <div className="h-1/3 flex flex-col">
                        <span className="text-xs uppercase text-neutral-500 mb-2 font-bold tracking-wider">Up Next</span>
                        <div className="flex-1 border border-neutral-700 rounded-lg overflow-hidden bg-black relative">
                            {nextSlideContent ? (
                                <div className="absolute inset-0 pointer-events-none origin-top-left scale-[0.33]">
                                    <SlideView slide={nextSlideContent} />
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-neutral-600">End of Deck</div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <span className="text-xs uppercase text-neutral-500 mb-2 font-bold tracking-wider">Speaker Notes</span>
                        <Card className="flex-1 bg-neutral-800 border-neutral-700 p-6 overflow-y-auto">
                            <pre className="whitespace-pre-wrap font-sans text-lg text-neutral-300 leading-relaxed">
                                {currentSlide.notes || "(No notes for this slide)"}
                            </pre>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
