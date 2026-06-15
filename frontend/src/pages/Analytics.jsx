import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Analytics = () => {
    const { id } = useParams();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await api.get(`/url/${id}/analytics`);
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                toast.error('Failed to fetch analytics');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (!stats) return <div className="text-center text-white p-20">No data found</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Link to="/" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-8 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
            </Link>

            <header className="mb-12">
                <h1 className="text-3xl font-bold text-white mb-2">Link Analytics</h1>
                <p className="text-slate-400">Detailed performance metrics for your shortened URL</p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="glass-card p-8 text-center bg-slate-900/40">
                    <p className="text-slate-400 uppercase text-sm font-bold tracking-wider mb-2">Total Clicks</p>
                    <p className="text-5xl font-black primary-gradient text-transparent bg-clip-text">
                        {stats.totalClicks}
                    </p>
                </div>
                <div className="glass-card p-8 text-center bg-slate-900/40">
                    <p className="text-slate-400 uppercase text-sm font-bold tracking-wider mb-2">Last Visited</p>
                    <p className="text-2xl font-bold text-white">
                        {stats.lastVisited ? new Date(stats.lastVisited).toLocaleString() : 'Never'}
                    </p>
                </div>
            </div>

            {/* Visit History */}
            <div className="glass-card p-6 bg-slate-900/40">
                <h3 className="text-xl font-bold text-white mb-6">Recent Visit History (Last 10)</h3>
                <div className="space-y-4">
                    {stats.recentHistory.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No visits recorded yet.</p>
                    ) : (
                        stats.recentHistory.map((visit, index) => (
                            <div key={index} className="flex justify-between items-center p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 flex items-center justify-center bg-indigo-500/10 text-indigo-400 rounded-full">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-slate-200 font-medium">Logged Visit</p>
                                        <p className="text-slate-400 text-sm">Unique ping recorded</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-300 font-mono text-sm">
                                        {new Date(visit.timestamp).toLocaleDateString()}
                                    </p>
                                    <p className="text-slate-500 text-xs">
                                        {new Date(visit.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
