import React, { useState } from 'react';
import { BellIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const DUMMY_NOTIFS = [
    {
        id: 1,
        type: 'success',
        title: 'Petition Goal Reached!',
        message: 'The "Install Solar Panels" petition has reached 500 signatures.',
        time: '2 hours ago',
        link: '/petition/1'
    },
    {
        id: 2,
        type: 'info',
        title: 'New Policy Update',
        message: 'The Ministry has released a new draft on Campus Safety. Check it out.',
        time: '1 day ago',
        link: '/policies'
    },
    {
        id: 3,
        type: 'alert',
        title: 'Action Required',
        message: 'Your profile is missing a bio. Add one to gain more trust.',
        time: '2 days ago',
        link: '/profile'
    }
];

const Notifications = () => {
    const [notifications, setNotifications] = useState(DUMMY_NOTIFS);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <BellIcon className="h-8 w-8 text-primary-600" />
                    Notifications
                </h1>
                <button
                    onClick={() => setNotifications([])}
                    className="text-sm text-gray-500 hover:text-primary-600"
                >
                    Mark all as read
                </button>
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
                            to={notif.link}
                            key={notif.id}
                            className="block bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                            <div className="flex gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                                    ${notif.type === 'success' ? 'bg-green-100 text-green-600' :
                                        notif.type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {notif.type === 'success' ? <CheckCircleIcon className="h-6 w-6" /> :
                                        notif.type === 'alert' ? <ExclamationCircleIcon className="h-6 w-6" /> :
                                            <BellIcon className="h-6 w-6" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{notif.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notif.message}</p>
                                    <span className="text-xs text-gray-400 mt-2 block">{notif.time}</span>
                                </div>
                                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
