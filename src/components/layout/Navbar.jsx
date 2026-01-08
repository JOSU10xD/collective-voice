import React from 'react';
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import logo from '../../assets/logocv.png';

const Navbar = ({ onMenuClick }) => {
    const { currentUser, userProfile } = useAuth();

    return (
        <div className="relative z-10 flex-shrink-0 flex h-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 justify-between px-4 sm:px-6 shadow-sm">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="lg:hidden -ml-2 mr-2 p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                    onClick={onMenuClick}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
                {/* Logo Replacement */}
                <div className="flex items-center gap-2">
                    <img src={logo} alt="CollectiveVoice" className="h-10 w-auto object-contain" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {currentUser ? (
                    <Link to="/profile" className="flex items-center">
                        {currentUser.photoURL ? (
                            <img src={currentUser.photoURL} alt="Profile" className="h-8 w-8 rounded-full" />
                        ) : (
                            <UserCircleIcon className="h-8 w-8 text-gray-400" />
                        )}
                    </Link>
                ) : (
                    <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                        Sign In
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
