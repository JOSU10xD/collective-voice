import React, { useState, useEffect } from 'react';
import { BellIcon, CheckCircleIcon, ExclamationCircleIcon, HeartIcon, ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const Notifications = () => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        }, (err) => {
            console.error("Error fetching notifications:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleClearAll = async () => {
        if (!notifications.length) return;
        if (!window.confirm("Clear all notifications?")) return;

        const batch = writeBatch(db);
        notifications.forEach(n => {
            batch.delete(doc(db, 'notifications', n.id));
        });

        try {
            await batch.commit();
            toast.success("Notifications cleared");
        } catch (error) {
            console.error("Error clearing notifications:", error);
            toast.error("Failed to clear");
        }
    };

    const handleDismiss = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await deleteDoc(doc(db, 'notifications', id));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    }

    const getIcon = (type) => {
        switch (type) {
            case 'like': return <HeartIcon className="h-6 w-6 text-pink-500" />;
            case 'reply': return <ChatBubbleLeftIcon className="h-6 w-6 text-blue-500" />;
            case 'success': return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
            case 'alert': return <ExclamationCircleIcon className="h-6 w-6 text-red-500" />;
            default: return <BellIcon className="h-6 w-6 text-cyan-500" />;
        }
    };

    const getLink = (notif) => {
        if (notif.petitionId) return `/petition/${notif.petitionId}`;
        return notif.link || '#';
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading notifications...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <BellIcon className="h-8 w-8 text-primary-600" />
                    Notifications
                </h1>
                {notifications.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
                    >
                        <TrashIcon className="h-4 w-4" />
                        Clear all
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <BellIcon className="h-12 w-12 mx-auto text-gray-300" />
                    <p className="mt-4 text-gray-500">No new notifications</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map(notif => (
                        <Link
                            to={getLink(notif)}
                            key={notif.id}
                            className="block bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow relative group"
                        >
                            <div className="flex gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-700`}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 pr-8">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                        {notif.type === 'like' ? `${notif.senderName} liked your comment` :
                                            notif.type === 'reply' ? `${notif.senderName} replied to you` :
                                                notif.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                        {notif.text || notif.message}
                                    </p>
                                    <span className="text-xs text-gray-400 mt-2 block">
                                        {notif.createdAt?.seconds ? formatDistanceToNow(new Date(notif.createdAt.seconds * 1000), { addSuffix: true }) : 'Just now'}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => handleDismiss(e, notif.id)}
                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Dismiss"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
