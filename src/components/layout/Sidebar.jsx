import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
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
        <div className="flex flex-col h-full bg-navy-900/95 backdrop-blur-xl border-r border-cyan-500/20 shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-center h-24 border-b border-cyan-500/20 relative overflow-hidden">
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent" />
                <Link to="/">
                    <img src={logo} alt="CollectiveVoice" className="h-20 w-auto object-contain relative z-10" />
                </Link>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => window.innerWidth < 1024 && onClose && onClose()}
                        className={({ isActive }) =>
                            clsx(
                                'group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden',
                                isActive
                                    ? 'text-white shadow-lg glow-cyan'
                                    : 'text-gray-400 hover:text-cyan-300',
                                item.special && !isActive && 'text-viswajyothi-DEFAULT font-bold hover:text-viswajyothi-light'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-primary-500/20 to-cyan-500/10 border border-cyan-500/30 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                {/* Hover glow effect */}
                                <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors duration-300 rounded-xl" />

                                <item.icon
                                    className={clsx(
                                        'mr-3 flex-shrink-0 h-6 w-6 relative z-10 transition-all duration-300',
                                        isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]' : (item.special ? 'text-viswajyothi-DEFAULT' : 'text-gray-500 group-hover:text-cyan-400')
                                    )}
                                    aria-hidden="true"
                                />
                                <span className="relative z-10">{item.name}</span>
                                {item.special && <span className="absolute right-3 w-2 h-2 rounded-full bg-viswajyothi-DEFAULT animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.8)]" />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
            {currentUser && (
                <div className="p-4 border-t border-cyan-500/20 bg-navy-950/50">
                    <button
                        onClick={logout}
                        className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-red-500/20 hover:border-red-500/40"
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
