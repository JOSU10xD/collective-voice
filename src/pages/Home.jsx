import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import PetitionCard from '../components/petitions/PetitionCard';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { indianPolicies } from '../data/indianPolicies';
import { PlusIcon } from '@heroicons/react/24/outline'; // Correct import? No, PlusIcon is generic.

const DUMMY_PETITIONS = [
    {
        id: '1',
        title: 'Install Solar Panels on Campus Roofs',
        description: 'We simply simply must transition to renewable energy. Our campus has massive roof space being unused. This petition asks the administration to install solar panels by 2026.',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        signatureCount: 450,
        goal: 1000,
        category: 'Sustainability',
        visibility: 'viswajyothi',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        title: 'Global Plastic Ban in Oceans',
        description: 'Urging the UN to enforce stricter penalties on plastic dumping in international waters. We need 1 million signatures to be heard.',
        imageUrl: 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=800&q=80',
        signatureCount: 12500,
        goal: 50000,
        category: 'Environment',
        visibility: 'global',
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        title: 'Better Wi-Fi for Dorms',
        description: 'The connection drops every evening. We need reliable internet for our studies and projects!',
        imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&w=800&q=80',
        signatureCount: 89,
        goal: 200,
        category: 'Infrastructure',
        visibility: 'viswajyothi',
        createdAt: new Date().toISOString()
    }
];

const Home = ({ filter }) => {
    const [petitions, setPetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('recent');

    useEffect(() => {
        const fetchPetitions = async () => {
            setLoading(true);
            setError(null);
            try {
                if (db._mock) {
                    // This block should ideally be unreachable now, but keeping safe or removing.
                    // Removing entirely is better.
                }

                let q = collection(db, 'petitions');
                const constraints = [limit(20)];

                // Filtering logic
                if (filter === 'viswajyothi') {
                    constraints.push(where('visibility', '==', 'viswajyothi'));
                } else if (filter === 'mine' && currentUser) {
                    constraints.push(where('authorId', '==', currentUser.uid));
                }

                const queryRef = query(q, ...constraints);
                const snapshot = await getDocs(queryRef);

                const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                if (fetched.length === 0) {
                    let dummy = DUMMY_PETITIONS;
                    if (filter === 'viswajyothi') dummy = dummy.filter(p => p.visibility === 'viswajyothi');
                    if (filter === 'mine') dummy = [];
                    setPetitions(dummy);
                } else {
                    setPetitions(fetched);
                }
            } catch (err) {
                console.error("Error fetching petitions:", err);
                // setError("Could not load live data. Showing demo data.");
                let dummy = DUMMY_PETITIONS;
                if (filter === 'viswajyothi') dummy = dummy.filter(p => p.visibility === 'viswajyothi');
                setPetitions(dummy);
            } finally {
                setLoading(false);
            }
        };

        fetchPetitions();
    }, [filter, currentUser]);

    const getTitle = () => {
        if (filter === 'viswajyothi') return 'Viswajyothi Campus Petitions';
        if (filter === 'mine') return 'My Petitions';
        return 'Global Petitions';
    }

    return (
        <div className="space-y-6">
            {/* Hero Section - Aura Style */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-purple-900 to-black text-white p-10 sm:p-16 shadow-2xl isolate mb-10"
            >
                {/* Noise Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                {/* Animated Orbs */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl mix-blend-screen animate-pulse delay-700"></div>

                <div className="relative z-10 max-w-3xl">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6 text-primary-200"
                    >
                        🚀 Empowering Student Voices
                    </motion.span>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
                        Make Your Voice <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">Heard.</span>
                    </h1>
                    <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
                        Start petitions, gain support, and drive real change on campus and beyond.
                        Join thousands of students making a difference today.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/create">
                            <button className="px-8 py-4 bg-white text-black font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all text-base">
                                Start a Petition
                            </button>
                        </Link>
                        <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all text-base">
                            Learn More
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Sticky Filter Bar - Glassmorphism */}
            <div className="sticky top-0 z-30 mb-8">
                <div className="flex flex-col sm:flex-row justify-end items-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-4 rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-lg ring-1 ring-black/5">
                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                        <div className="flex rounded-lg bg-gray-100/50 dark:bg-gray-700/50 p-1">
                            <button
                                onClick={() => setSortBy('recent')}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${sortBy === 'recent' ? 'bg-white dark:bg-gray-600 shadow text-primary-600 dark:text-white' : 'text-gray-500'
                                    }`}
                            >
                                Recent
                            </button>
                            <button
                                onClick={() => setSortBy('popular')}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${sortBy === 'popular' ? 'bg-white dark:bg-gray-600 shadow text-primary-600 dark:text-white' : 'text-gray-500'
                                    }`}
                            >
                                Popular
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <>
                    {error && (
                        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md text-sm mb-4">
                            {error} (Check console/README for Firebase Setup)
                        </div>
                    )}

                    {petitions.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500">No petitions found.</p>
                            <Link to="/create" className="text-primary-600 font-medium hover:underline mt-2 inline-block">Start one today</Link>
                        </div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {petitions.map(petition => (
                                <motion.div key={petition.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                                    <PetitionCard petition={petition} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </>
            )}


            {/* Recent Policies Section */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Government Policies</h2>
                        <p className="text-gray-500 mt-1">Stay informed with the latest updates from the government.</p>
                    </div>
                    <Link to="/policies">
                        <Button variant="outline" className="text-sm">
                            View All Policies
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {indianPolicies.slice(0, 3).map(policy => (
                        <div key={policy.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-all">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 mb-3">
                                {policy.category}
                            </span>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1" title={policy.title}>
                                {policy.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                                {policy.summary}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>{policy.source}</span>
                                <span>{new Date(policy.publishedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
