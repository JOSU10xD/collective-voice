import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, getDocs, limit, orderBy, updateDoc, increment, serverTimestamp, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import confetti from 'canvas-confetti';
import { UserCircleIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { ShareIcon, FlagIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PetitionDetail = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [petition, setPetition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [signing, setSigning] = useState(false);
    const [signatures, setSignatures] = useState([]);
    const [hasSigned, setHasSigned] = useState(false);

    useEffect(() => {
        const fetchPetition = async () => {
            try {
                if (db._mock) {
                    // Mock data
                    await new Promise(r => setTimeout(r, 500));
                    setPetition({
                        id: id,
                        title: 'Install Solar Panels on Campus Roofs',
                        description: 'We simply simply must transition to renewable energy. Our campus has massive roof space being unused. This petition asks the administration to install solar panels by 2026.',
                        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
                        signatureCount: 450,
                        goal: 1000,
                        category: 'Sustainability',
                        visibility: 'viswajyothi',
                        authorName: 'Jane Doe',
                        target: 'Principal',
                    });
                    setSignatures([
                        { displayName: 'Alice' }, { displayName: 'Bob' }
                    ]);
                    setLoading(false);
                    return;
                }

                const docRef = doc(db, 'petitions', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPetition({ id: docSnap.id, ...docSnap.data() });

                    // Fetch recent signatures
                    const sigsRef = collection(db, 'petitions', id, 'signatures');
                    const q = query(sigsRef, orderBy('signedAt', 'desc'), limit(10));
                    const sigsSnap = await getDocs(q);
                    setSignatures(sigsSnap.docs.map(d => d.data()));

                    // Check if user signed (In real app, we check a distinct 'signatures' doc with ID=uid, or query)
                    // Here simple check if we just loaded it.
                    if (currentUser) {
                        const mySigRef = doc(db, 'petitions', id, 'signatures', currentUser.uid);
                        const mySigSnap = await getDoc(mySigRef);
                        if (mySigSnap.exists()) setHasSigned(true);
                    }

                } else {
                    // Handle Not Found or Dummy data for demo if ID matches dummy
                    // For now just console error
                    console.log("No such petition!");
                }
            } catch (err) {
                console.error("Error loading petition", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPetition();
    }, [id, currentUser]);

    const handleSign = async () => {
        if (!currentUser) {
            toast.error("Please sign in to support this petition.");
            return;
        }
        setSigning(true);
        try {
            // Optimistic UI update could be done here, but let's wait for DB
            const sigRef = doc(db, 'petitions', id, 'signatures', currentUser.uid);
            await linkToSignature(sigRef);

            // Update denormalized count (In prod, use Cloud Function or Transaction)
            // Using updateDoc increment for simplicity in frontend-only
            const petitionRef = doc(db, 'petitions', id);
            await updateDoc(petitionRef, {
                signatureCount: increment(1)
            });

            // Trigger Confetti
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#0ea5e9', '#eab308'] // Primary and Viswajyothi colors
            });

            setHasSigned(true);
            setPetition(p => ({ ...p, signatureCount: p.signatureCount + 1 }));
            setSignatures(prev => [{
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                signedAt: { seconds: Date.now() / 1000 } // approximate
            }, ...prev]);

            toast.success("Thank you for your support!");

        } catch (error) {
            toast.error("Failed to sign: " + error.message);
        } finally {
            setSigning(false);
        }
    };

    const linkToSignature = async (ref) => {
        if (db._mock) return;
        // Helper to create signature doc
        await import('firebase/firestore').then(fs => {
            fs.setDoc(ref, {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                signedAt: serverTimestamp()
            });
        });
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!petition) return <div className="p-10 text-center">Petition not found.</div>;

    const percent = Math.min((petition.signatureCount / petition.goal) * 100, 100);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {petition.imageUrl && (
                        <img src={petition.imageUrl} alt={petition.title} className="w-full h-64 sm:h-80 object-cover" />
                    )}
                    <div className="p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-4">
                            {petition.visibility === 'viswajyothi' && (
                                <span className="bg-viswajyothi-light text-viswajyothi-dark text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                                    Campus Only
                                </span>
                            )}
                            <span className="text-sm text-gray-500 uppercase tracking-wide font-semibold">{petition.category || 'Cause'}</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{petition.title}</h1>

                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-lg">
                                {(petition.authorName?.[0] || 'A')}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Started by {petition.authorName || 'Anonymous'}</p>
                                <p className="text-xs text-gray-500">Target: {petition.target}</p>
                            </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                            <p className="whitespace-pre-wrap">{petition.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Stats */}
            <div className="lg:w-80 space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 sticky top-6">
                    <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{petition.signatureCount.toLocaleString()}</span>
                            <span className="text-gray-500">signatures</span>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">Goal: {petition.goal.toLocaleString()}</div>
                        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                            <div className="bg-primary-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percent}%` }}></div>
                        </div>
                    </div>

                    {hasSigned ? (
                        <div className="bg-green-50 text-green-800 px-4 py-3 rounded-md mb-4 flex items-center gap-2 animate-pulse">
                            <CheckBadgeIcon className="h-5 w-5" />
                            You signed this petition!
                        </div>
                    ) : (
                        <Button
                            className="w-full text-lg py-3 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 mb-4"
                            onClick={handleSign}
                            isLoading={signing}
                        >
                            Sign this petition
                        </Button>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="secondary" size="sm" className="w-full justify-center">
                            <ShareIcon className="h-4 w-4 mr-2" /> Share
                        </Button>
                        <Button variant="secondary" size="sm" className="w-full justify-center text-red-600 hover:bg-red-50">
                            <FlagIcon className="h-4 w-4 mr-2" /> Report
                        </Button>
                    </div>

                    <div className="mt-8">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Recent Supporters</h3>
                        <div className="space-y-3">
                            {signatures.map((sig, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm">
                                    <UserCircleIcon className="h-8 w-8 text-gray-300" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-200">{sig.displayName || 'Anonymous'}</p>
                                        <p className="text-xs text-gray-500">just now</p>
                                    </div>
                                </div>
                            ))}
                            {signatures.length === 0 && <p className="text-sm text-gray-500 italic">Be the first to sign!</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetitionDetail;
