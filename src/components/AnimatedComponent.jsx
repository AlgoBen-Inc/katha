import React from "react";
import { motion } from "framer-motion";

export const AnimatedComponent = ({
    children,
    animation = "bounce",
    duration = 0.5,
    delay = 0,
    className = ""
}) => {

    const variants = {
        bounce: {
            y: [0, -20, 0],
            transition: {
                duration: duration,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
            }
        },
        fade: {
            opacity: [0, 1],
            transition: { duration: duration, delay: delay }
        },
        slide: {
            x: [-100, 0],
            opacity: [0, 1],
            transition: { duration: duration, delay: delay }
        },
        pulse: {
            scale: [1, 1.1, 1],
            transition: {
                duration: duration,
                repeat: Infinity,
                repeatType: "reverse"
            }
        },
        spin: {
            rotate: 360,
            transition: {
                duration: duration * 2,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    return (
        <motion.div
            variants={variants}
            animate={animation}
            className={`p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-bold shadow-lg inline-block ${className}`}
        >
            {children || "Animated Component"}
        </motion.div>
    );
};
