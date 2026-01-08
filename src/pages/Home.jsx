import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import PetitionCard from '../components/petitions/PetitionCard';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
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

    useEffect(() => {
        const fetchPetitions = async () => {
            setLoading(true);
            setError(null);
            try {
                // If mocking, skip firestore completely
                if (db._mock) {
                    await new Promise(r => setTimeout(r, 500)); // Simulate delay
                    let dummy = DUMMY_PETITIONS;
                    if (filter === 'viswajyothi') dummy = dummy.filter(p => p.visibility === 'viswajyothi');
                    if (filter === 'mine') dummy = [];
                    setPetitions(dummy);
                    setLoading(false);
                    return;
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{getTitle()}</h1>
                    <p className="mt-1 text-gray-500">
                        {filter === 'viswajyothi' ? 'Voice your needs for our college community.' : 'Discover and support causes around the world.'}
                    </p>
                </div>

                <Link to="/create">
                    <Button className={filter === 'viswajyothi' ? 'bg-viswajyothi-DEFAULT hover:bg-viswajyothi-dark' : ''}>
                        Create Petition
                    </Button>
                </Link>
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
        </div>
    );
};

export default Home;
