import React from 'react';
import { StarIcon as StarIconSolid, NewspaperIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { doc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const PolicyCard = ({ policy }) => {
    const { currentUser, userProfile } = useAuth();
    const isFollowing = userProfile?.followedPolicies?.includes(policy.id) || false;

    const toggleFollow = async () => {
        if (!currentUser) {
            toast.error("Please sign in to star policies");
            return;
        }

        const userRef = doc(db, 'users', currentUser.uid);

        try {
            if (isFollowing) {
                // Optimistic UI update logic handled by listener, but we await completion
                await setDoc(userRef, {
                    followedPolicies: arrayRemove(policy.id)
                }, { merge: true });
                toast.success("Unstarred policy");
            } else {
                await setDoc(userRef, {
                    followedPolicies: arrayUnion(policy.id)
                }, { merge: true });
                toast.success("Starred policy");
            }
        } catch (error) {
            console.error("Error updating star status:", error);
            toast.error("Failed to update");
        }
    };

    return (
        <div className="card-glow rounded-2xl border border-cyan-500/20 hover:border-cyan-400/40 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 group relative">
            <div className="flex justify-between items-start">
                <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 ring-1 ring-inset ring-cyan-500/30 mb-2`}>
                        {policy.category || 'General'}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {policy.title}
                    </h3>
                    <p className="text-gray-400">
                        {policy.summary}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium text-gray-400">
                            Source: {policy.source}
                        </span>
                        <span>•</span>
                        <span>{new Date(policy.publishedAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow();
                    }}
                    className="p-2 rounded-full hover:bg-cyan-500/10 transition-all duration-300 z-10"
                    title={isFollowing ? "Unstar" : "Star"}
                >
                    {isFollowing ? (
                        <StarIconSolid className="h-6 w-6 text-viswajyothi-DEFAULT drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                    ) : (
                        <StarIconOutline className="h-6 w-6 text-gray-500 hover:text-viswajyothi-light" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default PolicyCard;
