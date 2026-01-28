import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import matter from 'gray-matter';
import { SlideRenderer } from './Slide/SlideRenderer';
import { SlideView } from './Slide/SlideView';
import { getLayout } from './Slide/Layouts';
import { parseSlides } from '../utils/slideParser';
import rawSlides from 'virtual:slides';

import { motion, AnimatePresence } from 'framer-motion';

const variants = {
    enter: (direction) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
    })
};

export function Deck() {
    const { slideIndex } = useParams();
    const navigate = useNavigate();
    const [slides, setSlides] = useState([]);
    const [error, setError] = useState(null);
    const [[page, direction], setPage] = useState([0, 0]);

    // Initial Parsing
    useEffect(() => {
        try {
            if (rawSlides) {
                setSlides(parseSlides(rawSlides));
            }
        } catch (err) {
            console.error("Deck Loop Error:", err);
            setError(err.message);
        }
    }, []);

    // Navigation Logic
    const currentIndex = parseInt(slideIndex) || 1;
    const currentSlide = slides[currentIndex - 1];

    // Sync internal page state with URL for direction
    useEffect(() => {
        setPage([currentIndex, currentIndex > page ? 1 : -1]);
    }, [currentIndex]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                if (currentIndex < slides.length) {
                    setPage([currentIndex + 1, 1]);
                    navigate(`/${currentIndex + 1}`);
                }
            } else if (e.key === 'ArrowLeft') {
                if (currentIndex > 1) {
                    setPage([currentIndex - 1, -1]);
                    navigate(`/${currentIndex - 1}`);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, slides.length, navigate]);


    if (error) return <div className="text-red-500 font-bold p-8">Error: {error}</div>;
    if (!currentSlide) return <div className="p-8 text-gray-500">Loading or Slide Not Found (Index: {currentIndex})</div>;

    return (
        <div className="w-screen h-screen overflow-hidden bg-black relative">
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

            {/* Navigation Overlay (Optional) */}
            <div className="fixed bottom-4 right-4 text-gray-400 text-sm font-mono opacity-50 hover:opacity-100 transition z-50">
                {currentIndex} / {slides.length}
            </div>
        </div>
    );
}
