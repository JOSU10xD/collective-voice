import React from 'react';
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import logo from '../../assets/logocv.png';

const Navbar = ({ onMenuClick }) => {
    const { currentUser, userProfile } = useAuth();

    return (
        <div className="relative z-10 flex-shrink-0 flex h-20 bg-navy-900/95 backdrop-blur-xl border-b border-cyan-500/20 justify-between px-4 sm:px-6 shadow-lg">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="lg:hidden -ml-2 mr-2 p-2 rounded-md text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 transition-all duration-300"
                    onClick={onMenuClick}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
                {/* Logo Replacement - Hidden on Desktop to avoid duplication with Sidebar */}
                <div className="flex items-center gap-2 lg:hidden">
                    <Link to="/">
                        <img src={logo} alt="CollectiveVoice" className="h-12 w-auto object-contain" />
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {currentUser ? (
                    <Link to="/profile" className="flex items-center group">
                        {currentUser.photoURL ? (
                            <img
                                src={currentUser.photoURL}
                                alt="Profile"
                                className="h-9 w-9 rounded-full ring-2 ring-cyan-500/30 group-hover:ring-cyan-400/60 transition-all duration-300"
                            />
                        ) : (
                            <UserCircleIcon className="h-9 w-9 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                        )}
                    </Link>
                ) : (
                    <Link
                        to="/login"
                        className="px-4 py-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/60 rounded-lg transition-all duration-300 hover:bg-cyan-500/10"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
