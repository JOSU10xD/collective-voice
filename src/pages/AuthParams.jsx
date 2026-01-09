import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const AuthParams = ({ type }) => {
    const isLogin = type === 'login';
    const { login, signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [photoFile, setPhotoFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await signup(formData.email, formData.password, formData.name, photoFile);
            }
            toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
            navigate('/');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (error) {
            toast.error("Google Sign In failed: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group"
            >
                <ArrowLeftIcon className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <img src="/src/assets/logocv.png" alt="CollectiveVoice Logo" className="h-20 w-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300" />
                </div>
                <h2 className="text-center text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                    {isLogin ? 'Welcome Back' : 'Join the Movement'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    {isLogin ? 'Sign in to your account' : 'Create your account to start making a change'}
                </p>
                {!isLogin && (
                    <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        Or{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 hover:underline transition-all">
                            sign in instead
                        </Link>
                    </p>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <>
                                <Input
                                    label="Full Name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Photo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="mt-1 block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-primary-50 file:text-primary-700
                                            hover:file:bg-primary-100"
                                        onChange={(e) => setPhotoFile(e.target.files[0])}
                                    />
                                </div>
                            </>
                        )}

                        <Input
                            label="Email address"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <Input
                            label="Password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                        <Button type="submit" className="w-full" isLoading={loading}>
                            {isLogin ? 'Sign in' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button variant="secondary" className="w-full" onClick={handleGoogleSignIn}>
                                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                                </svg>
                                Google
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthParams;
