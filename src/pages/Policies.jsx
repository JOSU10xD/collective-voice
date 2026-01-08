import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { NewspaperIcon, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Policies = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser, userProfile } = useAuth();
    const [following, setFollowing] = useState([]);

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
                if (db._mock) {
                    setPolicies([
                        {
                            id: 'pol1',
                            title: 'National Education Framework 2025',
                            summary: 'A comprehensive overhaul of the higher education system emphasizing interdisciplinary studies and flexible curriculums.',
                            source: 'Ministry of Education',
                            publishedAt: new Date().toISOString(),
                            category: 'Education'
                        },
                        {
                            id: 'pol2',
                            title: 'Green Energy Subsidy Program',
                            summary: 'New grants available for institutions adopting solar power solutions. Applications open till March.',
                            source: 'Dept of Energy',
                            publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                            category: 'Environment'
                        },
                        {
                            id: 'pol3',
                            title: 'Digital Privacy Act Amendment',
                            summary: 'Stricter regulations on data collection by private entities inside educational campuses.',
                            source: 'Parliament IT Committee',
                            publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
                            category: 'Technology'
                        }
                    ]);
                    setLoading(false);
                    return;
                }

                const q = query(collection(db, 'policies'), orderBy('publishedAt', 'desc'));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    setPolicies(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
                } else {
                    // Fallback to dummy
                    setPolicies([
                        {
                            id: 'pol1',
                            title: 'National Education Framework 2025',
                            summary: 'A comprehensive overhaul of the higher education system emphasizing interdisciplinary studies and flexible curriculums.',
                            source: 'Ministry of Education',
                            publishedAt: new Date().toISOString(),
                            category: 'Education'
                        },
                        {
                            id: 'pol2',
                            title: 'Green Energy Subsidy Program',
                            summary: 'New grants available for institutions adopting solar power solutions. Applications open till March.',
                            source: 'Dept of Energy',
                            publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                            category: 'Environment'
                        },
                        {
                            id: 'pol3',
                            title: 'Digital Privacy Act Amendment',
                            summary: 'Stricter regulations on data collection by private entities inside educational campuses.',
                            source: 'Parliament IT Committee',
                            publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
                            category: 'Technology'
                        }
                    ]);
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
        if (db._mock) {
            if (isFollowing) {
                setFollowing(prev => prev.filter(id => id !== policyId));
                toast.success("Unfollowed policy (Mack)");
            } else {
                setFollowing(prev => [...prev, policyId]);
                toast.success("Following policy (Mock)");
            }
            return;
        }

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

    if (loading) return <div className="p-10 text-center">Loading policies...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <NewspaperIcon className="h-8 w-8 text-primary-600" />
                    Government Policies
                </h1>
            </div>

            <div className="grid gap-6">
                {policies.map(policy => (
                    <div key={policy.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md">
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
