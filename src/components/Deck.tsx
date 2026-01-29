import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SlideView } from './Slide/SlideView';
import { useDeck } from '../hooks/useDeck';
import { useSlideRouter } from '../hooks/useSlideRouter';
import { motion, AnimatePresence } from 'framer-motion';
import { StepContext } from './ClickReveal';
import { ContextMenu } from './Navigation/ContextMenu';

const TRANSITIONS: Record<string, any> = {
    slide: {
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
    },
    fade: {
        enter: { opacity: 0 },
        center: { opacity: 1, zIndex: 1 },
        exit: { opacity: 0, zIndex: 0 }
    },
    zoom: {
        enter: { scale: 0.8, opacity: 0 },
        center: { scale: 1, opacity: 1, zIndex: 1 },
        exit: { scale: 1.2, opacity: 0, zIndex: 0 }
    }
};

const DEFAULT_TRANSITION = 'slide';

export function Deck() {
    // 1. Load Data
    const { slides, error, loading } = useDeck();
    const navigate = useNavigate();

    // 2. Get current slide first (for step calculation)
    const { slideIndex } = useParams<{ slideIndex: string }>();
    const resolvedIndex = slideIndex ?
        (parseInt(slideIndex) || slides.findIndex(s => s.slug === slideIndex) + 1 || 1) : 1;
    const currentSlide = slides[Math.max(0, resolvedIndex - 1)];

    // 3. Get total steps from slide metadata (clicks: N)
    const totalSteps = currentSlide?.meta?.clicks ?? 0;

    // 4. Manage Routing & State with step count
    const { currentIndex, currentStep, direction, next, prev } = useSlideRouter(slides, totalSteps);

    // 5. Keyboard Listeners (step-aware)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                next();
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prev();
            }
            if (e.key === 'o' || e.key === 'O') {
                e.preventDefault();
                navigate('/overview');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [next, prev, navigate]);

    // Return States
    if (error) return <div className="text-red-500 font-bold p-8">Error: {error}</div>;
    if (loading || !currentSlide) return <div className="p-8 text-gray-500">Loading Slide {currentIndex}...</div>;

    const theme = currentSlide.meta?.theme || 'default';
    const transitionName = currentSlide.meta?.transition || DEFAULT_TRANSITION;
    const variants = TRANSITIONS[transitionName] || TRANSITIONS[DEFAULT_TRANSITION];

    return (
        <StepContext.Provider value={{ currentStep, totalSteps }}>
            <ContextMenu
                next={next}
                prev={prev}
                toggleOverview={() => navigate('/overview')}
            />
            <div
                className="w-screen h-screen overflow-hidden bg-[var(--k-bg-primary)] text-[var(--k-text-primary)] relative transition-colors duration-500"
                data-theme={theme}
            >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            opacity: { duration: 0.3 },
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            scale: { duration: 0.4 }
                        }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <SlideView slide={currentSlide} />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Overlay */}
                {(currentSlide.meta?.slideNumber !== false && currentSlide.meta?.slideNumber !== 'false') && (
                    <div className="fixed bottom-4 right-4 text-gray-400 text-sm font-mono opacity-50 hover:opacity-100 transition z-50">
                        {currentIndex} / {slides.length}
                        {totalSteps > 0 && ` (${currentStep}/${totalSteps})`}
                    </div>
                )}
            </div>
        </StepContext.Provider>
    );
}
