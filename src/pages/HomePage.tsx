import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Shield, Zap, Database, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { TrendingSection } from '../components/features/TrendingSection';

export const HomePage = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { history, addToHistory, clearHistory } = useSearchHistory();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            addToHistory(query.trim());
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleHistoryClick = (q: string) => {
        addToHistory(q);
        navigate(`/search?q=${encodeURIComponent(q)}`);
    };

    return (
        <>
            <Helmet>
                <title>MagnetFinder - Free Torrent Search</title>
                <meta name="description" content="Search and copy torrent magnet links instantly. No login, no signup, no files hosted." />
            </Helmet>

            <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background Gradient Blob */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[128px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-4xl z-10 flex flex-col items-center text-center space-y-12"
                >
                    {/* Header */}
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-2">
                            Find Torrents & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Copy Magnet Links</span>
                        </h1>
                        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
                            Instantly search public torrent trackers. No login required.
                        </p>
                    </div>

                    {/* Search Section */}
                    <div className="w-full max-w-2xl space-y-4">
                        <form onSubmit={handleSearch} className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                                <Search size={24} />
                            </div>
                            <input
                                type="text"
                                className="w-full h-16 pl-14 pr-32 rounded-2xl bg-surface/50 border border-white/10 backdrop-blur-xl text-lg text-white placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-xl"
                                placeholder="Search torrents & copy magnet links..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-black font-semibold transition-opacity"
                            >
                                Search
                            </button>
                        </form>

                        {/* Recent History */}
                        <AnimatePresence>
                            {history.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-2"
                                >
                                    <div className="flex items-center justify-between mb-2 text-sm text-text-muted px-2">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} />
                                            <span>Recent Searches</span>
                                        </div>
                                        <button
                                            onClick={clearHistory}
                                            className="hover:text-white transition-colors text-xs"
                                        >
                                            Clear History
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {history.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleHistoryClick(item)}
                                                className="px-4 py-1.5 rounded-full bg-surface border border-white/5 hover:border-primary/50 text-sm text-text-secondary hover:text-white transition-all cursor-pointer"
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl pt-8">
                        {[
                            { icon: Shield, title: "Safe & Secure", desc: "No tracking, no logs" },
                            { icon: Zap, title: "Lightning Fast", desc: "Instant results" },
                            { icon: Database, title: "Public Metadata", desc: "No files hosted" }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="p-6 rounded-2xl bg-surface/30 border border-white/5 flex flex-col items-center gap-3 backdrop-blur-sm"
                            >
                                <div className="p-3 rounded-xl bg-white/5 text-primary">
                                    <feature.icon size={24} />
                                </div>
                                <span className="font-medium text-white">{feature.title}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Trending Sections */}
                    <div className="w-full space-y-8 pt-8 text-left">
                        <TrendingSection title="Popular Downloads" type="trending" />
                        <TrendingSection title="Recently Added" type="recent" />
                    </div>

                    <p className="text-text-muted text-sm pt-8">Free • No signup • No files hosted</p>
                </motion.div>
            </div>
        </>
    );
};
