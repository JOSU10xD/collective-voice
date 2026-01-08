import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShareIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const PetitionCard = ({ petition }) => {
    const percent = Math.min((petition.signatureCount / petition.goal) * 100, 100);

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
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-primary-500/20 transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full group relative overflow-visible"
        >
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:via-purple-500/5 group-hover:to-viswajyothi-DEFAULT/5 rounded-2xl transition-all duration-500" />
            {petition.imageUrl && (
                <div className="h-48 w-full overflow-hidden relative">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        src={petition.imageUrl}
                        alt={petition.title}
                        className="w-full h-full object-cover transform transition-transform"
                    />
                    {petition.visibility === 'viswajyothi' && (
                        <span className="absolute top-2 right-2 bg-viswajyothi-DEFAULT text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            Viswajyothi Only
                        </span>
                    )}
                </div>
            )}

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <span className="relative z-10 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {petition.category || 'General'}
                    </span>
                    <button onClick={handleShare} className="relative z-10 text-gray-400 hover:text-gray-600 transition-colors">
                        <ShareIcon className="h-5 w-5" />
                    </button>
                </div>

                <Link to={`/petition/${petition.id}`} className="block mt-1 relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-primary-600 transition-colors">
                        {petition.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                        {petition.description}
                    </p>
                </Link>

                <div className="mt-auto pt-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span className="flex items-center gap-1 font-medium text-gray-900 dark:text-gray-300">
                            <UserGroupIcon className="h-4 w-4" />
                            {petition.signatureCount.toLocaleString()} signatures
                        </span>
                        <span>Goal: {petition.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                            className={clsx("h-2.5 rounded-full", petition.visibility === 'viswajyothi' ? "bg-viswajyothi-DEFAULT" : "bg-primary-600")}
                            style={{ width: `${percent}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PetitionCard;
