import { useState, useEffect } from 'react';
import { parseSlides } from '../utils/slideParser';
import { Slide } from '../types';

// Optional: Pass rawSlides content if you want to override the default virtual import
// behaving like dependency injection for easier testing.
import defaultRawSlides from 'virtual:slides';

/**
 * useDeck Hook
 * 
 * Responsible for loading and parsing the raw markdown content into structured slide data.
 * Adheres to Single Responsibility Principle by isolating data fetching/parsing from view logic.
 */
export function useDeck(injectedContent: string | null = null) {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const rawContent = injectedContent || defaultRawSlides;

    useEffect(() => {
        try {
            setLoading(true);
            if (!rawContent) {
                // It's possible the virtual module is empty or failing
                console.warn("useDeck: No content found.");
                setSlides([]);
            } else {
                const parsed = parseSlides(rawContent);
                setSlides(parsed);
            }
            setError(null);
        } catch (err) {
            console.error("useDeck Error:", err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    }, [rawContent]);

    return { slides, error, loading };
}
