import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    HomeIcon,
    PlusCircleIcon,
    UserGroupIcon,
    AcademicCapIcon,
    BellIcon,
    NewspaperIcon,
    UserCircleIcon,
    ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import logo from '../../assets/logocv.png';

const Sidebar = ({ isOpen, onClose }) => {
    const { logout, currentUser } = useAuth();
    const location = useLocation(); // Need this for accurate highlighting

    const navigation = [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Create Petition', href: '/create', icon: PlusCircleIcon },
        { name: 'My Petitions', href: '/my-petitions', icon: UserGroupIcon },
        { name: 'Viswajyothi', href: '/viswajyothi', icon: AcademicCapIcon, special: true },
        { name: 'Notifications', href: '/notifications', icon: BellIcon },
        { name: 'Popular Policies', href: '/policies', icon: NewspaperIcon },
    ];

    if (currentUser) {
        navigation.push({ name: 'Profile', href: '/profile', icon: UserCircleIcon });
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-r border-white/20 dark:border-gray-800/50 shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-center h-24 border-b border-gray-100/50 dark:border-gray-800/50">
                <img src={logo} alt="CollectiveVoice" className="h-20 w-auto object-contain" />
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => window.innerWidth < 1024 && onClose && onClose()}
                        className={({ isActive }) =>
                            clsx(
                                'group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 overflow-hidden',
                                isActive
                                    ? 'text-primary-700 dark:text-white shadow-lg shadow-primary-500/10'
                                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
                                item.special && !isActive && 'text-viswajyothi-dark font-bold'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/30 dark:to-primary-800/10"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon
                                    className={clsx(
                                        'mr-3 flex-shrink-0 h-6 w-6 relative z-10 transition-colors duration-200',
                                        isActive ? 'text-primary-600 dark:text-primary-400' : (item.special ? 'text-viswajyothi-DEFAULT' : 'text-gray-400 group-hover:text-gray-500')
                                    )}
                                    aria-hidden="true"
                                />
                                <span className="relative z-10">{item.name}</span>
                                {item.special && <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-viswajyothi-DEFAULT animate-pulse" />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
            {currentUser && (
                <div className="p-4 border-t border-gray-100/50 dark:border-gray-800/50 bg-white/30 dark:bg-gray-800/30">
                    <button
                        onClick={logout}
                        className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50/50 hover:text-red-700 rounded-xl transition-colors backdrop-blur-sm"
                    >
                        <ArrowRightStartOnRectangleIcon className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-shrink-0 relative z-20">
                <div className="flex flex-col w-72">
                    <SidebarContent />
                </div>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 flex flex-col w-72 max-w-xs z-50 lg:hidden"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
