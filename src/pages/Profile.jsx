import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import PetitionCard from '../components/petitions/PetitionCard';
import Button from '../components/ui/Button';

const Profile = () => {
    const { userProfile, logout, currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('created');
    const [userPetitions, setUserPetitions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserPetitions = async () => {
            if (!currentUser) return;
            setLoading(true);
            try {
                // In a real app we might fetch 'signed' petitions differently 
                // (e.g. querying a subcollection or array)
                // For now, we only fetch 'created' ones easily.
                // Assuming 'signed' logic would require complex querying not set up yet.
                // We will implement 'created' fetching.

                if (db._mock) {
                    await new Promise(r => setTimeout(r, 500));
                    // Mock user petitions
                    if (activeTab === 'created') {
                        setUserPetitions([
                            {
                                id: 'mock1',
                                title: 'Mock Petition for demo',
                                description: 'This is a mock petition created by you.',
                                imageUrl: null,
                                signatureCount: 5,
                                goal: 100,
                                createdAt: new Date().toISOString()
                            }
                        ]);
                    } else {
                        setUserPetitions([]);
                    }
                    setLoading(false);
                    return;
                }

                let q;
                if (activeTab === 'created') {
                    q = query(collection(db, 'petitions'), where('authorId', '==', currentUser.uid));
                } else {
                    // For signed, we'd ideally query where user ID is in a subcollection.
                    // That's hard to query from top level without Collection Group queries or denormalized array.
                    // We'll leave it empty for now or mock it.
                    setLoading(false);
                    setUserPetitions([]);
                    return;
                }

                const snapshot = await getDocs(q);
                setUserPetitions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPetitions();
    }, [currentUser, activeTab]);

    if (!userProfile) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="h-32 bg-gradient-to-r from-primary-600 to-indigo-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full p-1 bg-white dark:bg-gray-800 shadow-xl">
                                <img
                                    src={userProfile.photoURL || `https://ui-avatars.com/api/?name=${userProfile.displayName}&background=0ea5e9&color=fff`}
                                    alt={userProfile.displayName}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                        <Button variant="outline" onClick={logout} className="mb-2 text-red-600 border-red-200 hover:bg-red-50">
                            Sign Out
                        </Button>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.displayName}</h1>
                        <p className="text-gray-500">{userProfile.email}</p>
                        <div className="flex gap-2 mt-3">
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                {userProfile.role || 'Member'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs & Content */}
            <div className="">
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                    <button
                        onClick={() => setActiveTab('created')}
                        className={`pb-4 px-6 font-medium text-sm transition-colors relative ${activeTab === 'created'
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Created Petitions
                    </button>
                    {/* <button
                        onClick={() => setActiveTab('signed')}
                        className={`pb-4 px-6 font-medium text-sm transition-colors relative ${
                            activeTab === 'signed' 
                            ? 'text-primary-600 border-b-2 border-primary-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Signed Petitions
                    </button> */}
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : userPetitions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userPetitions.map(p => (
                            <PetitionCard key={p.id} petition={p} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500">You haven't created any petitions yet.</p>
                        <Button className="mt-4" onClick={() => window.location.href = '/create'}>Create one</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
