import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <nav className="glass-card mx-4 my-4 p-4 flex justify-between items-center bg-slate-900/50">
            <Link to="/" className="text-2xl font-bold primary-gradient text-transparent bg-clip-text">
                URLShortener
            </Link>
            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        <Link to="/" className="text-slate-300 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <span className="text-slate-500">|</span>
                        <div className="flex items-center gap-4">
                            <span className="text-slate-300 font-medium">Hi, {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all active:scale-95"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link to="/signup" className="btn-primary">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
