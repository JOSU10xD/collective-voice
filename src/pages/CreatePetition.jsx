import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { compressImage } from '../utils/imageUtils';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';
import { PhotoIcon } from '@heroicons/react/24/outline';

const CreatePetition = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        target: '',
        goal: 100,
        visibility: 'global', // global | viswajyothi
        tags: '' // comma separated
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        setLoading(true);

        try {
            let imageUrl = null;
            if (imageFile) {
                // Bypass CORS/Storage by using Base64 in Firestore (max ~700KB)
                imageUrl = await compressImage(imageFile, 800, 0.8);
            }

            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(t => t);

            await addDoc(collection(db, 'petitions'), {
                ...formData,
                tags: tagsArray,
                imageUrl,
                authorId: currentUser.uid,
                authorName: currentUser.displayName,
                createdAt: serverTimestamp(),
                signatureCount: 0,
                goal: parseInt(formData.goal)
            });

            toast.success("Petition created successfully! Let's get some signatures.");
            navigate('/');
        } catch (error) {
            console.error("Error creating petition:", error);
            toast.error("Failed to create petition. " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Start a New Petition</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Petition Title"
                        placeholder="What do you want to achieve?"
                        required
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 min-h-[150px] dark:bg-gray-800 dark:text-white"
                            placeholder="Explain the problem and your solution..."
                            required
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Audience / Recipient</label>
                            <Input
                                placeholder="e.g., College Principal, Local Mayor"
                                value={formData.target}
                                onChange={e => setFormData({ ...formData, target: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Signature Goal</label>
                            <Input
                                type="number"
                                min="10"
                                value={formData.goal}
                                onChange={e => setFormData({ ...formData, goal: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visibility</label>
                            <select
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                                value={formData.visibility}
                                onChange={e => setFormData({ ...formData, visibility: e.target.value })}
                            >
                                <option value="global">Global (Public)</option>
                                <option value="viswajyothi">Viswajyothi College Only</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
                            <Input
                                placeholder="Transportation, Food, Policy"
                                value={formData.tags}
                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image</label>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <PhotoIcon className="w-10 h-10 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG (MAX. 5MB)</p>
                                    </div>
                                )}
                                <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end border-t border-gray-200 dark:border-gray-700">
                        <Button variant="ghost" className="mr-3" onClick={() => navigate('/')} type="button">Cancel</Button>
                        <Button type="submit" isLoading={loading}>Publish Petition</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePetition;
