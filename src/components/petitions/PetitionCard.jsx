import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShareIcon, UserGroupIcon, TrashIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const PetitionCard = ({ petition, onDelete }) => {
    const { currentUser } = useAuth();
    const percent = Math.min((petition.signatureCount / petition.goal) * 100, 100);
    const isAuthor = currentUser && currentUser.uid === petition.authorId;

    const handleShare = (e) => {
        e.preventDefault(); // Prevent navigation
        const url = `${window.location.origin}/petition/${petition.id}`;
        if (navigator.share) {
            navigator.share({
                title: petition.title,
                text: petition.description,
                url: url,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="card-glow rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 border border-cyan-500/20 hover:border-cyan-400/40 flex flex-col h-full group relative overflow-hidden"
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-primary-500/0 group-hover:from-cyan-500/10 group-hover:via-primary-500/5 group-hover:to-cyan-500/10 rounded-2xl transition-all duration-500 z-0" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer rounded-2xl" />
            {petition.imageUrl && (
                <div className="h-48 w-full overflow-hidden relative rounded-t-2xl">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        src={petition.imageUrl}
                        alt={petition.title}
                        className="w-full h-full object-cover transform transition-transform"
                    />
                    {/* Gradient overlay on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />

                    {petition.visibility === 'viswajyothi' && (
                        <span className="absolute top-3 right-3 bg-viswajyothi-DEFAULT text-navy-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                            Viswajyothi Only
                        </span>
                    )}
                </div>
            )}

            <div className="p-5 flex-1 flex flex-col relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <span className="inline-flex items-center rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400 ring-1 ring-inset ring-cyan-500/30 backdrop-blur-sm">
                        {petition.category || 'General'}
                    </span>
                    <div className="flex items-center gap-1">
                        <button onClick={handleShare} className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 p-1.5 hover:bg-cyan-500/10 rounded-lg">
                            <ShareIcon className="h-5 w-5" />
                        </button>
                        {isAuthor && onDelete && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onDelete(petition.id);
                                }}
                                className="text-gray-400 hover:text-red-400 transition-colors duration-300 p-1.5 hover:bg-red-500/10 rounded-lg"
                                title="Delete Petition"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>

                <Link to={`/petition/${petition.id}`} className="block mt-1">
                    <h3 className="text-xl font-bold text-white line-clamp-2 hover:text-cyan-300 transition-colors duration-300">
                        {petition.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-400 line-clamp-3">
                        {petition.description}
                    </p>
                </Link>

                <div className="mt-auto pt-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span className="flex items-center gap-1.5 font-medium text-cyan-300">
                            <UserGroupIcon className="h-4 w-4" />
                            {petition.signatureCount.toLocaleString()} signatures
                        </span>
                        <span>Goal: {petition.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-navy-800/60 rounded-full h-2.5 overflow-hidden border border-cyan-500/20">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={clsx(
                                "h-2.5 rounded-full relative overflow-hidden",
                                petition.visibility === 'viswajyothi'
                                    ? "bg-gradient-to-r from-viswajyothi-DEFAULT to-viswajyothi-light"
                                    : "bg-gradient-to-r from-cyan-500 to-primary-500"
                            )}
                        >
                            {/* Shimmer on progress bar */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shimmer" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PetitionCard;
