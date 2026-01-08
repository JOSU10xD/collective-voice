import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BellIcon, NewspaperIcon } from '@heroicons/react/24/outline';

export const Notifications = () => (
    <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BellIcon className="h-7 w-7 text-primary-600" /> Notifications
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow sm:rounded-lg p-6 text-center text-gray-500">
            No new notifications.
        </div>
    </div>
);

export const Policies = () => (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <NewspaperIcon className="h-7 w-7 text-primary-600" /> Government Policies
        </h1>
        <div className="grid gap-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">Education Policy</span>
                    <h3 className="text-lg font-bold mt-2">New Educational Framework 2025</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                        Summary of the new policy affecting higher education institutions...
                    </p>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <span>Source: Govt Registry</span>
                        <button className="text-primary-600 font-medium hover:text-primary-700">Read Summary &rarr;</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const Profile = () => {
    const { userProfile, logout } = useAuth();
    if (!userProfile) return null;

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-32"></div>
            <div className="px-6 relative">
                <div className="h-24 w-24 bg-white p-1 rounded-full -mt-12 shadow-lg">
                    <img
                        src={userProfile.photoURL || `https://ui-avatars.com/api/?name=${userProfile.displayName}&background=0D8ABC&color=fff`}
                        alt=""
                        className="h-full w-full rounded-full object-cover"
                    />
                </div>
                <div className="mt-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.displayName}</h1>
                    <p className="text-gray-500">{userProfile.email}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full uppercase">
                        {userProfile.role}
                    </span>
                </div>

                <div className="py-8 border-t border-gray-100 mt-8">
                    <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                    <button onClick={logout} className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-md font-medium border border-gray-200">
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};
