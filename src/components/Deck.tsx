import { useEffect } from 'react';
import { SlideView } from './Slide/SlideView';
import { useDeck } from '../hooks/useDeck';
import { useSlideRouter } from '../hooks/useSlideRouter';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
    })
};

export function Deck() {
    // 1. Load Data
    const { slides, error, loading } = useDeck();

    // 2. Manage Routing & State
    const { currentIndex, direction, nextSlide, prevSlide } = useSlideRouter(slides);

    // 3. Helper: Current Slide
    // Safety check: currentIndex is 1-based, array is 0-based
    const currentSlide = slides[currentIndex - 1];

    // 4. Keyboard Listeners (Presentation Layer Concern)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);


    // Return States
    if (error) return <div className="text-red-500 font-bold p-8">Error: {error}</div>;
    if (loading || !currentSlide) return <div className="p-8 text-gray-500">Loading Slide {currentIndex}...</div>;

    const theme = currentSlide.meta?.theme || 'default';

    return (
        <div
            className="w-screen h-screen overflow-hidden bg-[var(--k-bg-primary)] text-[var(--k-text-primary)] relative transition-colors duration-500"
            data-theme={theme}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    <SlideView slide={currentSlide} />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Overlay */}
            <div className="fixed bottom-4 right-4 text-gray-400 text-sm font-mono opacity-50 hover:opacity-100 transition z-50">
                {currentIndex} / {slides.length}
            </div>
        </div>
    );
}
