import React from 'react';
import { NavLink } from 'react-router-dom';
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

const Sidebar = ({ isOpen, onClose }) => {
    const { logout, currentUser } = useAuth();

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
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-viswajyothi-DEFAULT bg-clip-text text-transparent">
                    CollectiveVoice
                </h1>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => window.innerWidth < 1024 && onClose && onClose()}
                        className={({ isActive }) =>
                            clsx(
                                isActive
                                    ? 'bg-primary-50 text-primary-700 dark:bg-gray-800 dark:text-white'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
                                'group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                                item.special && 'text-viswajyothi-dark font-bold hover:text-viswajyothi-DEFAULT'
                            )
                        }
                    >
                        <item.icon
                            className={clsx(
                                'mr-3 flex-shrink-0 h-6 w-6',
                                item.special ? 'text-viswajyothi-DEFAULT' : 'text-gray-400 group-hover:text-gray-500'
                            )}
                            aria-hidden="true"
                        />
                        {item.name}
                    </NavLink>
                ))}
            </nav>
            {currentUser && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={logout}
                        className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <ArrowRightStartOnRectangleIcon className="mr-3 h-6 w-6" />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <SidebarContent />
                </div>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-gray-600 z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white z-50 lg:hidden shadow-xl"
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
