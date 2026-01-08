/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#e0f7ff',
                    100: '#b3ecff',
                    200: '#80e1ff',
                    300: '#4dd5ff',
                    400: '#1acbff',
                    500: '#00bcd4', // Main Teal/Cyan
                    600: '#00acc1',
                    700: '#0097a7',
                    800: '#00838f',
                    900: '#006064',
                },
                cyan: {
                    50: '#e0ffff',
                    100: '#b3ffff',
                    200: '#80ffff',
                    300: '#4dffff',
                    400: '#1affff',
                    500: '#00e5ff', // Bright Cyan
                    600: '#00d9f0',
                    700: '#00c4d4',
                    800: '#00b0c0',
                    900: '#009aa8',
                },
                navy: {
                    50: '#e8eaed',
                    100: '#c5cad1',
                    200: '#9ea7b3',
                    300: '#778495',
                    400: '#59697d',
                    500: '#3c4f66',
                    600: '#34485e',
                    700: '#2a3f53',
                    800: '#213649',
                    900: '#1a2332', // Dark Navy Background
                    950: '#0f1419', // Darker Navy
                },
                viswajyothi: {
                    light: '#fde047',
                    DEFAULT: '#eab308', // Gold/Yellowish for college
                    dark: '#ca8a04',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'sans-serif'],
            },
            fontSize: {
                // bumped up by ~2-3px (approx 0.15-0.2rem)
                'xs': '0.9rem',    // ~14.4px
                'sm': '1.05rem',   // ~16.8px
                'base': '1.2rem',  // ~19.2px
                'lg': '1.35rem',   // ~21.6px
                'xl': '1.5rem',    // ~24px
                '2xl': '1.8rem',   // ~28.8px
                '3xl': '2.2rem',   // ~35.2px
                // 4xl and above remain default (very big sizes)
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'gradient-x': 'gradientX 3s ease infinite',
                'gradient-y': 'gradientY 3s ease infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                glowPulse: {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(0, 229, 255, 0.5), 0 0 40px rgba(0, 188, 212, 0.3)'
                    },
                    '50%': {
                        boxShadow: '0 0 30px rgba(0, 229, 255, 0.8), 0 0 60px rgba(0, 188, 212, 0.5)'
                    },
                },
                gradientX: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                gradientY: {
                    '0%, 100%': { backgroundPosition: '50% 0%' },
                    '50%': { backgroundPosition: '50% 100%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
            backgroundSize: {
                '200%': '200% 200%',
                '300%': '300% 300%',
            },
        },
    },
    plugins: [],
}
