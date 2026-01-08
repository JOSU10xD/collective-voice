import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxBackground = () => {
    const { scrollY } = useScroll();

    // Parallax transforms for different layers
    const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
    const rotate1 = useTransform(scrollY, [0, 1000], [0, 45]);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
            {/* Gradient Blob 1 - Top Left */}
            <motion.div
                style={{ y: y1, rotate: rotate1 }}
                className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-purple-400/30 dark:bg-purple-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-pulse"
            />

            {/* Gradient Blob 2 - Bottom Right */}
            <motion.div
                style={{ y: y2 }}
                className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] bg-indigo-400/30 dark:bg-indigo-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
            />

            {/* Gradient Blob 3 - Center (Subtle) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-pink-300/10 dark:bg-pink-900/10 rounded-full blur-[150px]" />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>
    );
};

export default ParallaxBackground;
