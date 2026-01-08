import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { indianPolicies } from '../data/indianPolicies';
import { NewspaperIcon } from '@heroicons/react/24/solid';
import PolicyCard from '../components/policies/PolicyCard';
import toast from 'react-hot-toast';

const Policies = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    const [selectedCategory, setSelectedCategory] = useState("All");

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

    const categories = ["All", ...new Set(policies.map(p => p.category).filter(Boolean))].sort((a, b) => {
        if (a === "All") return -1;
        if (b === "All") return 1;
        return a.localeCompare(b);
    });

    const filteredPolicies = selectedCategory === "All"
        ? policies
        : policies.filter(p => p.category === selectedCategory);

    if (loading) return <div className="p-10 text-center text-gray-400">Loading policies...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <NewspaperIcon className="h-8 w-8 text-cyan-400" />
                    Government Policies
                </h1>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${selectedCategory === category
                            ? 'bg-gradient-to-r from-cyan-500 to-primary-500 text-white shadow-lg glow-cyan transform scale-105'
                            : 'bg-navy-800 text-gray-300 border border-cyan-500/30 hover:bg-navy-700 hover:border-cyan-400/60 hover:text-cyan-300'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid gap-6">
                {filteredPolicies.map(policy => (
                    <PolicyCard key={policy.id} policy={policy} />
                ))}
            </div>
        </div>
    );
};

export default Policies;
