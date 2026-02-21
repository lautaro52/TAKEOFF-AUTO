import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reveal component to wrap sections/elements with a scroll-triggered reveal animation.
 * Creates a "puzzle" effect when using different directions for adjacent elements.
 */
const Reveal = ({
    children,
    direction = 'up',
    delay = 0.2,
    duration = 0.55,
    width = "100%",
    className = ""
}) => {

    // Animation variants based on direction
    const variants = {
        hidden: {
            opacity: 0,
            x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
            y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
            scale: direction === 'scale' ? 0.9 : 1,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
        }
    };

    return (
        <motion.div
            className={className}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{
                duration: duration,
                delay: delay,
                ease: [0.25, 0.1, 0.25, 1.0] // Smooth slow ease
            }}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
};

export default Reveal;
