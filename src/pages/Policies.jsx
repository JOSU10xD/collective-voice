import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { indianPolicies } from '../data/indianPolicies';
import { NewspaperIcon, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Policies = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser, userProfile } = useAuth();
    const [following, setFollowing] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        if (userProfile?.followedPolicies) {
            setFollowing(userProfile.followedPolicies);
        }
    }, [userProfile]);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                // In real app, fetch from 'policies' collection
                // For now, we will use a mix of dummy and real if available
                const q = query(collection(db, 'policies'), orderBy('publishedAt', 'desc'));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    setPolicies(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
                } else {
                    // Fallback to dummy
                    setPolicies(indianPolicies);
                }
            } catch (err) {
                console.error("Error loading policies", err);
                // toast.error("Could not load policies");
            } finally {
                setLoading(false);
            }
        };

        fetchPolicies();
    }, []);

    const toggleFollow = async (policyId) => {
        if (!currentUser) {
            toast.error("Please sign in to follow policies");
            return;
        }

        const isFollowing = following.includes(policyId);
        const userRef = doc(db, 'users', currentUser.uid);

        try {
            if (isFollowing) {
                await updateDoc(userRef, {
                    followedPolicies: arrayRemove(policyId)
                });
                setFollowing(prev => prev.filter(id => id !== policyId));
                toast.success("Unfollowed policy");
            } else {
                await updateDoc(userRef, {
                    followedPolicies: arrayUnion(policyId)
                });
                setFollowing(prev => [...prev, policyId]);
                toast.success("Following policy");
            }
        } catch (error) {
            console.error("Error updating follow status:", error);
            toast.error("Failed to update");
        }
    };

    const categories = ["All", ...new Set(policies.map(p => p.category).filter(Boolean))].sort((a, b) => {
        if (a === "All") return -1;
        if (b === "All") return 1;
        return a.localeCompare(b);
    });

    const filteredPolicies = selectedCategory === "All"
        ? policies
        : policies.filter(p => p.category === selectedCategory);

    if (loading) return <div className="p-10 text-center">Loading policies...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <NewspaperIcon className="h-8 w-8 text-blue-600" />
                    Government Policies
                </h1>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category
                            ? 'bg-blue-600 text-white shadow-md transform scale-105'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid gap-6">
                {filteredPolicies.map(policy => (
                    <div key={policy.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2`}>
                                    {policy.category || 'General'}
                                </span>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {policy.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {policy.summary}
                                </p>
                                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                                    <span className="font-medium text-gray-700 dark:text-gray-400">
                                        Source: {policy.source}
                                    </span>
                                    <span>•</span>
                                    <span>{new Date(policy.publishedAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleFollow(policy.id)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title={following.includes(policy.id) ? "Unfollow" : "Follow"}
                            >
                                {following.includes(policy.id) ? (
                                    <StarIconSolid className="h-6 w-6 text-yellow-500" />
                                ) : (
                                    <StarIconOutline className="h-6 w-6 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Policies;
