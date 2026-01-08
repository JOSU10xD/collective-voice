import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove, increment, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';
import Button from '../ui/Button';

const CommentItem = ({ comment, petitionId, onReply }) => {
    const { currentUser } = useAuth();
    const [liking, setLiking] = useState(false);
    const isLiked = currentUser && comment.likedBy?.includes(currentUser.uid);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);

    const handleLike = async () => {
        if (!currentUser) {
            toast.error("Please login to like comments");
            return;
        }
        if (liking) return;
        setLiking(true);

        const commentRef = doc(db, 'petitions', petitionId, 'comments', comment.id);
        try {
            if (isLiked) {
                await updateDoc(commentRef, {
                    likedBy: arrayRemove(currentUser.uid),
                    likes: increment(-1)
                });
            } else {
                await updateDoc(commentRef, {
                    likedBy: arrayUnion(currentUser.uid),
                    likes: increment(1)
                });

                // Create notification if liking someone else's comment
                if (comment.authorId !== currentUser.uid) {
                    await addDoc(collection(db, 'notifications'), {
                        userId: comment.authorId,
                        type: 'like',
                        senderName: currentUser.displayName || 'Anonymous',
                        text: comment.text,
                        petitionId: petitionId,
                        createdAt: serverTimestamp(),
                        read: false
                    });
                }
            }
        } catch (error) {
            console.error("Error liking comment:", error);
            toast.error("Failed to like");
        } finally {
            setLiking(false);
        }
    };

    const handleSubmitReply = async (e) => {
        e.preventDefault();
        await onReply(replyText, comment.id, comment.authorId); // Pass parent ID and Author ID
        setReplyText('');
        setShowReplyInput(false);
    }

    return (
        <div className={`flex gap-3 mb-4 ${comment.parentId ? 'ml-12 border-l-2 border-gray-100 pl-4' : ''}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
                {comment.authorPhoto ? (
                    <img src={comment.authorPhoto} alt={comment.authorName} className="w-8 h-8 rounded-full bg-gray-200 object-cover" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                        {comment.authorName?.[0] || '?'}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 px-4 inline-block min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">{comment.authorName}</span>
                        <span className="text-xs text-gray-500">
                            {comment.createdAt?.seconds ? formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), { addSuffix: true }) : 'Just now'}
                        </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap">{comment.text}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-1 ml-2">
                    <button
                        onClick={handleLike}
                        className={`text-xs font-medium flex items-center gap-1 transition-colors ${isLiked ? 'text-pink-500' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {isLiked ? <HeartIconSolid className="w-3.5 h-3.5" /> : <HeartIconOutline className="w-3.5 h-3.5" />}
                        {comment.likes || 0} Likes
                    </button>

                    {!comment.parentId && (
                        <button
                            onClick={() => setShowReplyInput(!showReplyInput)}
                            className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        >
                            <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                            Reply
                        </button>
                    )}
                </div>

                {/* Reply Input */}
                {showReplyInput && (
                    <form onSubmit={handleSubmitReply} className="mt-3 flex gap-2">
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Replying to ${comment.authorName}...`}
                            className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            autoFocus
                        />
                        <Button type="submit" size="sm" disabled={!replyText.trim()}>Post</Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CommentItem;
