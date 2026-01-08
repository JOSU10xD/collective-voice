import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({ label, error, className, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
            <input
                ref={ref}
                className={twMerge(clsx(
                    "appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-800 dark:text-white",
                    error && "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500",
                    className
                ))}
                {...props}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
});

export default Input;
