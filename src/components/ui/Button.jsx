import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading,
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-cyan-500 to-primary-500 text-white hover:from-cyan-400 hover:to-primary-400 shadow-lg hover:shadow-xl glow-cyan-hover',
        secondary: 'bg-navy-800 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/60 hover:bg-navy-700 hover:text-cyan-200',
        outline: 'bg-transparent text-gray-300 border border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-500/10 hover:text-cyan-300',
        danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 shadow-lg hover:shadow-red-500/50',
        ghost: 'text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-300',
        viswajyothi: 'bg-gradient-to-r from-viswajyothi-DEFAULT to-viswajyothi-light text-navy-900 hover:from-viswajyothi-light hover:to-viswajyothi-DEFAULT shadow-lg font-bold'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {children}
        </button>
    );
};

export default Button;
