import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Slide } from '../types';

/**
 * useSlideRouter Hook
 * 
 * Manages the bidirectional state between the URL and the current slide index.
 * Handles slug resolution (finding index from string ID) and URL updating.
 */
export function useSlideRouter(slides: Slide[]) {
    const { slideIndex } = useParams<{ slideIndex: string }>();
    const navigate = useNavigate();

    // 1-based index, default to 1
    const [currentIndex, setCurrentIndex] = useState(1);

    // Direction: 1 (forward) or -1 (backward) for animations
    const [direction, setDirection] = useState(0);

    // 1. Sync URL -> State (Effect)
    useEffect(() => {
        if (!slides || slides.length === 0) return;

        // A. Is it a number?
        if (slideIndex) {
            const idxQuery = parseInt(slideIndex);
            if (!isNaN(idxQuery)) {
                // Check bounds (optional, but good practice)
                const clamped = Math.min(Math.max(idxQuery, 1), slides.length);
                setCurrentIndex(clamped);
                return;
            }

            // B. Is it a slug?
            const foundIndex = slides.findIndex(s => s.slug === slideIndex);
            if (foundIndex !== -1) {
                setCurrentIndex(foundIndex + 1); // convert 0-based to 1-based
            } else {
                console.warn(`Slug "${slideIndex}" not found. Redirecting to start.`);
                setCurrentIndex(1);
            }
        } else {
            // Root URL /, default to 1
            setCurrentIndex(1);
        }
    }, [slideIndex, slides]);

    // 2. Navigation Actions
    const navigateTo = useCallback((newIndex: number) => {
        if (!slides.length) return;

        // Bounds check
        if (newIndex < 1 || newIndex > slides.length) return;

        // Determine direction
        setDirection(newIndex > currentIndex ? 1 : -1);

        // Resolve Target URL (Slug vs Index)
        const targetSlide = slides[newIndex - 1];
        const routeParam = targetSlide?.slug || newIndex;

        navigate(`/${routeParam}`);
    }, [slides, currentIndex, navigate]);

    const nextSlide = useCallback(() => navigateTo(currentIndex + 1), [navigateTo, currentIndex]);
    const prevSlide = useCallback(() => navigateTo(currentIndex - 1), [navigateTo, currentIndex]);

    return {
        currentIndex,
        direction,
        navigateTo,
        nextSlide,
        prevSlide
    };
}
