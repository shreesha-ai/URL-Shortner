import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await signup(name, email, password);
        setLoading(false);

        if (result.success) {
            toast.success('Account created successfully');
            navigate('/');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="glass-card w-full max-w-md p-8 bg-slate-900/60">
                <h2 className="text-3xl font-bold mb-6 text-center text-white">Create Account</h2>
                <p className="text-slate-400 text-center mb-8">Start shortening and tracking your links</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 mb-2 font-medium">Full Name</label>
                        <input
                            type="text"
                            required
                            className="input-field w-full"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 mb-2 font-medium">Email Address</label>
                        <input
                            type="email"
                            required
                            className="input-field w-full"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 mb-2 font-medium">Password</label>
                        <input
                            type="password"
                            required
                            className="input-field w-full"
                            placeholder="•••••••• (min 6 characters)"
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 text-lg mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
