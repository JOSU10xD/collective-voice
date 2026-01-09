import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import PetitionCard from '../components/petitions/PetitionCard';
import AvatarUploader from '../components/AvatarUploader';
import Button from '../components/ui/Button';
import { viswajyothiPolicies } from '../data/viswajyothiPolicies';
import { NewspaperIcon } from '@heroicons/react/24/solid';

const Profile = () => {
    const { userProfile, logout, currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('created');
    const [userPetitions, setUserPetitions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        displayName: '',
        branch: '',
        semester: '',
        photoURL: ''
    });

    useEffect(() => {
        if (userProfile) {
            setEditForm({
                displayName: userProfile.displayName || '',
                branch: userProfile.branch || '',
                semester: userProfile.semester || '',
                photoURL: userProfile.photoURL || ''
            });
        }
    }, [userProfile]);

    useEffect(() => {
        const fetchUserPetitions = async () => {
            if (!currentUser) return;
            setLoading(true);
            try {
                let q;
                if (activeTab === 'created') {
                    q = query(collection(db, 'petitions'), where('authorId', '==', currentUser.uid));
                } else {
                    // Logic for 'signed' petitions can be added here
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

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                displayName: editForm.displayName,
                branch: editForm.branch,
                semester: editForm.semester,
                photoURL: editForm.photoURL
            });
            // Reload to reflect changes
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        }
    };

    if (!userProfile) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Card */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700">
                <div className="h-32 bg-gradient-to-r from-primary-600 via-purple-600 to-viswajyothi-DEFAULT animate-gradient-x"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full p-1 bg-white dark:bg-gray-800 shadow-2xl ring-4 ring-white/20 dark:ring-black/20 overflow-hidden">
                                <img
                                    src={userProfile.photoBase64 || userProfile.photoURL || `https://ui-avatars.com/api/?name=${userProfile.displayName}&background=0ea5e9&color=fff`}
                                    alt={userProfile.displayName}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mb-2">
                            <Button variant="secondary" size="sm" onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </Button>
                            <Button variant="outline" size="sm" onClick={logout} className="text-red-600 border-red-200 hover:bg-red-50">
                                Sign Out
                            </Button>
                        </div>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2 border"
                                    value={editForm.displayName}
                                    onChange={e => setEditForm({ ...editForm, displayName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Photo</label>
                                <AvatarUploader />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Branch</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2 border"
                                        value={editForm.branch}
                                        onChange={e => setEditForm({ ...editForm, branch: e.target.value })}
                                        placeholder="CSE"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Semester</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2 border"
                                        value={editForm.semester}
                                        onChange={e => setEditForm({ ...editForm, semester: e.target.value })}
                                        placeholder="S6"
                                    />
                                </div>
                            </div>
                            <Button type="submit">Save Changes</Button>
                        </form>
                    ) : (
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.displayName}</h1>
                            <p className="text-gray-500">{userProfile.email}</p>
                            <div className="flex gap-2 mt-3 items-center">
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                    {userProfile.role || 'Member'}
                                </span>
                                {(userProfile.branch || userProfile.semester) && (
                                    <span className="text-sm text-gray-500 border-l pl-2 ml-1 border-gray-300">
                                        {[userProfile.branch, userProfile.semester].filter(Boolean).join(' • ')}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
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
                    {/* Starred Policies Tab */}
                    <button
                        onClick={() => setActiveTab('policies')}
                        className={`pb-4 px-6 font-medium text-sm transition-colors relative ${activeTab === 'policies'
                            ? 'text-cyan-400 border-b-2 border-cyan-400'
                            : 'text-gray-500 hover:text-cyan-300'
                            }`}
                    >
                        Starred Policies
                    </button>
                </div>

                {activeTab === 'policies' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {userProfile.followedPolicies && userProfile.followedPolicies.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {viswajyothiPolicies
                                    .filter(p => userProfile.followedPolicies.includes(p.id))
                                    .map(policy => (
                                        <div key={policy.id} className="card-glow rounded-2xl border border-cyan-500/20 hover:border-cyan-400/40 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 group bg-navy-900/40">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 ring-1 ring-inset ring-cyan-500/30">
                                                    {policy.category}
                                                </span>
                                                <NewspaperIcon className="h-5 w-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-1">
                                                {policy.title}
                                            </h3>
                                            <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                                                {policy.summary}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-500 border-t border-cyan-500/10 pt-4">
                                                <span className="font-medium text-gray-400">{policy.source}</span>
                                                <span>{new Date(policy.publishedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-navy-800/40 rounded-2xl border border-cyan-500/10 border-dashed">
                                <div className="mx-auto w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mb-4 ring-1 ring-cyan-500/20">
                                    <NewspaperIcon className="h-8 w-8 text-gray-600" />
                                </div>
                                <h3 className="text-lg font-medium text-white mb-1">No starred policies</h3>
                                <p className="text-gray-400 mb-6">Follow policies to get updates on campus decisions.</p>
                                <Button onClick={() => window.location.href = '/policies'} variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                                    Browse Policies
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (null)}

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
