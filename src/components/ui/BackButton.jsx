import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show on homepage
    if (location.pathname === '/' || location.pathname === '/viswajyothi') return null;

    return (
        <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-4 group"
        >
            <div className="p-2 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors mr-2">
                <ArrowLeftIcon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Back</span>
        </motion.button>
    );
};

export default BackButton;
