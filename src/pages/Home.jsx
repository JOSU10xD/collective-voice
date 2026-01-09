import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs, limit, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import PetitionCard from '../components/petitions/PetitionCard';
import PolicyCard from '../components/policies/PolicyCard';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { indianPolicies } from '../data/indianPolicies';
import { viswajyothiPolicies } from '../data/viswajyothiPolicies';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

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
    const petitionsRef = useRef(null);

    useEffect(() => {
        const fetchPetitions = async () => {
            setLoading(true);
            setError(null);
            try {
                if (db._mock) {
                    // removing unnecessary logic
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

    const scrollToPetitions = () => {
        petitionsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeletePetition = async (id) => {
        if (!window.confirm("Are you sure you want to delete this petition? This action cannot be undone.")) return;

        // Handle dummy data deletion locally
        if (['1', '2', '3'].includes(id)) {
            setPetitions(prev => prev.filter(p => p.id !== id));
            toast.success('Demo petition deleted locally');
            return;
        }

        try {
            await deleteDoc(doc(db, 'petitions', id));
            setPetitions(prev => prev.filter(p => p.id !== id));
            toast.success('Petition deleted successfully');
        } catch (error) {
            console.error("Error deleting petition:", error);
            if (error.code === 'permission-denied') {
                toast.error('Permission denied. Check your security rules.');
            } else {
                toast.error('Failed to delete petition: ' + error.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Premium Hero Section - Landing Page Only */}
            <AnimatePresence>
                {filter === 'global' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-black text-white p-10 sm:p-20 shadow-2xl isolate mb-12 border border-cyan-500/20 group"
                    >
                        {/* Premium Glow Effects */}
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-primary-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

                        <div className="relative z-10 max-w-4xl mx-auto text-center">
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-8 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                </span>
                                Empowering Student Voices
                            </motion.span>

                            <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-8 leading-tight">
                                Make Your Voice <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                                    Heard.
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Start petitions, gain support, and drive real change on campus and beyond.
                                Join thousands of students making a difference today.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Link to="/create">
                                    <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-primary-600 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 text-lg border border-cyan-400/20">
                                        Start a Petition
                                    </button>
                                </Link>
                                <button
                                    onClick={scrollToPetitions}
                                    className="px-8 py-4 bg-white/5 backdrop-blur-sm text-cyan-300 font-bold rounded-xl border border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-400/60 hover:text-cyan-200 transition-all duration-300 text-lg"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div ref={petitionsRef}>
                {/* Petitions Heading */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {getTitle()}
                        </h2>
                        <p className="text-gray-400">
                            Browse active petitions and add your signature to the causes you support.
                        </p>
                    </div>

                    <div className="flex bg-navy-900/80 backdrop-blur-xl p-1.5 rounded-xl border border-cyan-500/20 shadow-xl shadow-black/20">
                        <button
                            onClick={() => setSortBy('recent')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${sortBy === 'recent'
                                ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)] border border-cyan-500/30'
                                : 'text-gray-400 hover:text-cyan-300 hover:bg-white/5'
                                }`}
                        >
                            Recent
                        </button>
                        <button
                            onClick={() => setSortBy('popular')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${sortBy === 'popular'
                                ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)] border border-cyan-500/30'
                                : 'text-gray-400 hover:text-cyan-300 hover:bg-white/5'
                                }`}
                        >
                            Popular
                        </button>
                    </div>
                </div>


                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 bg-navy-800/60 border border-cyan-500/20 rounded-2xl animate-pulse shimmer"></div>
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
                                <p className="text-gray-400">No petitions found.</p>
                                <Link to="/create" className="text-cyan-400 font-medium hover:text-cyan-300 mt-2 inline-block transition-colors">Start one today</Link>
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
                                        <PetitionCard petition={petition} onDelete={handleDeletePetition} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </>
                )
                }
            </div>




            {/* Viswajyothi Policies Section */}
            {filter !== 'mine' && (
                <div className="mt-12 pt-8 border-t border-cyan-500/20">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Viswajyothi Policies</h2>
                            <p className="text-gray-400 mt-1">Stay informed with the latest updates from the campus.</p>
                        </div>
                        <Link to="/policies">
                            <Button variant="outline" className="text-sm border-cyan-500/30 text-cyan-400 hover:border-cyan-400/60 hover:bg-cyan-500/10">
                                View All Policies
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {viswajyothiPolicies.slice(0, 3).map(policy => (
                            <PolicyCard key={policy.id} policy={policy} />
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Government Policies Section */}
            {filter !== 'mine' && filter !== 'viswajyothi' && (
                <div className="mt-12 pt-8 border-t border-cyan-500/20">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Recent Government Policies</h2>
                            <p className="text-gray-400 mt-1">Stay informed with the latest updates from the government.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {indianPolicies.slice(0, 3).map(policy => (
                            <PolicyCard key={policy.id} policy={policy} />
                        ))}
                    </div>
                </div>
            )}
        </div >
    );
};

export default Home;
