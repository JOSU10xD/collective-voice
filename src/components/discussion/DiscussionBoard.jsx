import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import CommentItem from './CommentItem';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { AdjustmentsHorizontalIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'; // Use available icons

const DiscussionBoard = ({ petitionId }) => {
    const { currentUser } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('recent'); // 'recent' or 'likes'
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const commentsRef = collection(db, 'petitions', petitionId, 'comments');
        // Initial query - client side sort might be easier for small sets, but let's try DB sort.
        // Note: For 'likes' sorting to work perfectly with realtime updates, firestore needs an index.
        // We'll stick to client-side sorting for simplicity of setup unless pagination is needed.
        const q = query(commentsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setComments(fetched);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching comments:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [petitionId]);

    const handleAddComment = async (text, parentId = null, parentAuthorId = null) => {
        if (!currentUser) {
            toast.error("Please login to participate in the discussion");
            return;
        }
        if (!text.trim()) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, 'petitions', petitionId, 'comments'), {
                text: text,
                authorId: currentUser.uid,
                authorName: currentUser.displayName || 'Anonymous',
                authorPhoto: currentUser.photoURL,
                createdAt: serverTimestamp(),
                likes: 0,
                likedBy: [],
                parentId: parentId // Hierarchy level 1 for now
            });

            // Create notification if replying to someone else
            if (parentAuthorId && parentAuthorId !== currentUser.uid) {
                await addDoc(collection(db, 'notifications'), {
                    userId: parentAuthorId,
                    type: 'reply',
                    senderName: currentUser.displayName || 'Anonymous',
                    text: text,
                    petitionId: petitionId,
                    createdAt: serverTimestamp(), // Use serverTimestamp for consistency
                    read: false
                });
            }

            if (!parentId) setNewComment('');
            toast.success("Comment posted!");
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    const getSortedComments = () => {
        let sorted = [...comments];
        if (sortBy === 'likes') {
            sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        } else {
            // Already sorted by query, but ensure for fresh renders if we change logic
            sorted.sort((a, b) => {
                const tA = a.createdAt?.seconds || 0;
                const tB = b.createdAt?.seconds || 0;
                return tB - tA;
            });
        }
        return sorted;
    };

    // Organize into threads (simple 1-level nesting)
    const rootComments = getSortedComments().filter(c => !c.parentId);
    const replies = comments.filter(c => c.parentId);

    const getRepliesFor = (id) => {
        return replies.filter(r => r.parentId === id).sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)); // Oldest first for replies usually
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 mt-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Discussion</h3>
                    <p className="text-sm text-gray-500">Join the conversation about this petition.</p>
                </div>

                {/* Sort Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                        onClick={() => setSortBy('recent')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${sortBy === 'recent' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Recent
                    </button>
                    <button
                        onClick={() => setSortBy('likes')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${sortBy === 'likes' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Most Liked
                    </button>
                </div>
            </div>

            {/* Input Area */}
            <div className="flex gap-4 mb-8">
                <div className="flex-shrink-0 pt-1">
                    {currentUser?.photoURL ? (
                        <img src={currentUser.photoURL} alt="Me" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={currentUser ? "Add to the discussion..." : "Sign in to discuss..."}
                            disabled={!currentUser}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 pr-12 min-h-[100px] focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none transition-shadow"
                        />
                        <button
                            onClick={() => handleAddComment(newComment)}
                            disabled={!newComment.trim() || submitting}
                            className="absolute bottom-3 right-3 text-primary-600 hover:bg-primary-50 p-2 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                            <PaperAirplaneIcon className="w-6 h-6 -rotate-45 relative left-[-2px] top-[1px]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading discussion...</div>
                ) : rootComments.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500">No comments yet. Be the first to start the discussion!</p>
                    </div>
                ) : (
                    rootComments.map(comment => (
                        <div key={comment.id}>
                            <CommentItem
                                comment={comment}
                                petitionId={petitionId}
                                onReply={handleAddComment}
                            />
                            {/* Replies */}
                            {getRepliesFor(comment.id).map(reply => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    petitionId={petitionId}
                                    onReply={handleAddComment}
                                />
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DiscussionBoard;
