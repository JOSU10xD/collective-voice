import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-cyan-500/10 p-6 rounded-full mb-6 ring-1 ring-cyan-400/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                <HomeIcon className="h-16 w-16 text-cyan-400" />
            </div>
            <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">404</h1>
            <h2 className="text-2xl font-bold text-gray-300 mb-6">Page Not Found</h2>
            <p className="text-gray-400 max-w-md mb-8">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/">
                <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300">
                    Go Home
                </button>
            </Link>
        </div>
    );
};

export default NotFound;
