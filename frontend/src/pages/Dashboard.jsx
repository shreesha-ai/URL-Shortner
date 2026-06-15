import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const [urls, setUrls] = useState([]);
    const [longUrl, setLongUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchUrls();
    }, []);

    const fetchUrls = async () => {
        try {
            const { data } = await api.get('/url');
            if (data.success) {
                setUrls(data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch URLs');
        } finally {
            setLoading(false);
        }
    };

    const handleShorten = async (e) => {
        e.preventDefault();
        if (!longUrl) return;

        setCreating(true);
        try {
            const { data } = await api.post('/url', { originalUrl: longUrl });
            if (data.success) {
                toast.success('URL shortened successfully');
                setLongUrl('');
                fetchUrls();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to shorten URL');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this URL?')) return;

        try {
            const { data } = await api.delete(`/url/${id}`);
            if (data.success) {
                toast.success('URL deleted');
                setUrls(urls.filter(url => url._id !== id));
            }
        } catch (error) {
            toast.error('Failed to delete URL');
        }
    };

    const copyToClipboard = (code) => {
        const shortUrl = `http://localhost:5000/${code}`;
        navigator.clipboard.writeText(shortUrl);
        toast.success('Copied to clipboard');
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Your Dashboard</h1>
                <p className="text-slate-400">Shorten links and track their performance</p>
            </header>

            {/* URL Submission Form */}
            <div className="glass-card p-6 mb-12 bg-slate-900/40">
                <form onSubmit={handleShorten} className="flex flex-col md:flex-row gap-4">
                    <input
                        type="url"
                        required
                        placeholder="Paste your long URL here (e.g., https://example.com/very/long/path)"
                        className="input-field flex-1"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={creating}
                        className="btn-primary px-8 py-3 whitespace-nowrap disabled:opacity-50"
                    >
                        {creating ? 'Shortening...' : 'Shorten URL'}
                    </button>
                </form>
            </div>

            {/* URL List */}
            <div className="glass-card overflow-hidden bg-slate-900/40">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">Original URL</th>
                                <th className="px-6 py-4">Short Link</th>
                                <th className="px-6 py-4 text-center">Clicks</th>
                                <th className="px-6 py-4">Created Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12">
                                        <LoadingSpinner />
                                    </td>
                                </tr>
                            ) : urls.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        No URLs created yet. Start shortening!
                                    </td>
                                </tr>
                            ) : (
                                urls.map((url) => (
                                    <tr key={url._id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 max-w-xs truncate text-slate-300">
                                            {url.originalUrl}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-indigo-400 font-mono">
                                                localhost:5000/{url.shortCode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-sm font-medium">
                                                {url.clickCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {new Date(url.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => copyToClipboard(url.shortCode)}
                                                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-all"
                                                    title="Copy"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                    </svg>
                                                </button>
                                                <Link
                                                    to={`/analytics/${url._id}`}
                                                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                                                    title="Analytics"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(url._id)}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
