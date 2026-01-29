import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Slide } from '../types';

/**
 * useSlideRouter Hook
 * 
 * Manages the bidirectional state between the URL and the current slide index.
 * Also manages step state for click-reveal animations.
 * 
 * URL Format: /slide-id?step=2
 */
export function useSlideRouter(slides: Slide[], totalSteps: number = 0) {
    const { slideIndex } = useParams<{ slideIndex: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // 1-based index, default to 1
    const [currentIndex, setCurrentIndex] = useState(1);

    // Direction: 1 (forward) or -1 (backward) for animations
    const [direction, setDirection] = useState(0);

    // Step state (0 = show nothing, 1 = first reveal, etc.)
    const currentStep = parseInt(searchParams.get('step') || '0', 10);

    // 1. Sync URL -> State (Effect)
    useEffect(() => {
        if (!slides || slides.length === 0) return;

        // A. Is it a number?
        if (slideIndex) {
            const idxQuery = parseInt(slideIndex);
            if (!isNaN(idxQuery)) {
                const clamped = Math.min(Math.max(idxQuery, 1), slides.length);
                setCurrentIndex(clamped);
                return;
            }

            // B. Is it a slug?
            const foundIndex = slides.findIndex(s => s.slug === slideIndex);
            if (foundIndex !== -1) {
                setCurrentIndex(foundIndex + 1);
            } else {
                console.warn(`Slug "${slideIndex}" not found. Redirecting to start.`);
                setCurrentIndex(1);
            }
        } else {
            setCurrentIndex(1);
        }
    }, [slideIndex, slides]);

    // 3. Broadcast Sync
    useEffect(() => {
        const channel = new BroadcastChannel('katha_sync');

        const handleMessage = (event: MessageEvent) => {
            const { type, index, step } = event.data;
            if (type === 'NAVIGATE') {
                // Determine target URL locally
                const targetSlide = slides[index - 1];
                const routeParam = targetSlide?.slug || index;
                const search = step > 0 ? `?step=${step}` : '';

                // Only navigate if different to avoid redundant history entries
                const currentPath = window.location.pathname + window.location.search;
                const targetPath = `/${routeParam}${search}`;

                if (currentPath !== targetPath) {
                    navigate(targetPath);
                }
            }
        };

        channel.addEventListener('message', handleMessage);
        return () => {
            channel.removeEventListener('message', handleMessage);
            channel.close();
        };
    }, [slides, navigate]);

    // Helper to send sync events
    const broadcastNav = (index: number, step: number) => {
        const channel = new BroadcastChannel('katha_sync');
        channel.postMessage({ type: 'NAVIGATE', index, step });
        channel.close();
    };

    // 2. Navigation Actions
    const navigateTo = useCallback((newIndex: number, newStep: number = 0) => {
        if (!slides.length) return;

        // Bounds check
        if (newIndex < 1 || newIndex > slides.length) return;

        // Determine direction
        setDirection(newIndex > currentIndex ? 1 : -1);

        // Resolve Target URL (Slug vs Index)
        const targetSlide = slides[newIndex - 1];
        const routeParam = targetSlide?.slug || newIndex;

        // Broadcast to other windows
        broadcastNav(newIndex, newStep);

        // Navigate with step param
        if (newStep > 0) {
            navigate(`/${routeParam}?step=${newStep}`);
        } else {
            navigate(`/${routeParam}`);
        }
    }, [slides, currentIndex, navigate]);

    /**
     * Next Action:
     * - If more steps available → increment step
     * - If no more steps → go to next slide
     */
    const next = useCallback(() => {
        if (currentStep < totalSteps) {
            // More steps on this slide
            const newStep = currentStep + 1;
            broadcastNav(currentIndex, newStep);
            setSearchParams({ step: String(newStep) });
        } else {
            // Go to next slide, reset step
            navigateTo(currentIndex + 1, 0);
        }
    }, [currentStep, totalSteps, currentIndex, navigateTo, setSearchParams]);

    /**
     * Previous Action:
     * - If step > 0 → decrement step
     * - If step = 0 → go to previous slide (at last step)
     */
    const prev = useCallback(() => {
        if (currentStep > 0) {
            // Back one step
            const newStep = currentStep - 1;
            broadcastNav(currentIndex, newStep);
            setSearchParams({ step: String(newStep) });
        } else {
            // Go to previous slide
            navigateTo(currentIndex - 1, 0);
        }
    }, [currentStep, currentIndex, navigateTo, setSearchParams]);

    // Legacy aliases
    const nextSlide = useCallback(() => navigateTo(currentIndex + 1, 0), [navigateTo, currentIndex]);
    const prevSlide = useCallback(() => navigateTo(currentIndex - 1, 0), [navigateTo, currentIndex]);

    return {
        currentIndex,
        currentStep,
        direction,
        navigateTo,
        next,
        prev,
        nextSlide,
        prevSlide
    };
}
