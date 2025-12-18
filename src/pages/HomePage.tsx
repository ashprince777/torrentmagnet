import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Shield, Zap, Database } from 'lucide-react';
import styles from './HomePage.module.css';

export const HomePage = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <>
            <Helmet>
                <title>MagnetFinder - Free Torrent Search</title>
                <meta name="description" content="Search and copy torrent magnet links instantly. No login, no signup, no files hosted." />
            </Helmet>

            <div className={styles.heroContainer}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        Find Torrents & <span className={styles.highlight}>Copy Magnet Links</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Instantly search public torrent trackers. No login required.
                    </p>

                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.inputWrapper}>
                            <Search className={styles.searchIcon} size={24} />
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search torrents & copy magnet links..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" className={styles.searchButton}>
                                Search
                            </button>
                        </div>
                    </form>

                    <div className={styles.features}>
                        <div className={styles.featureItem}>
                            <Shield size={20} className={styles.featureIcon} />
                            <span>Safe & Secure</span>
                        </div>
                        <div className={styles.featureItem}>
                            <Zap size={20} className={styles.featureIcon} />
                            <span>Lightning Fast</span>
                        </div>
                        <div className={styles.featureItem}>
                            <Database size={20} className={styles.featureIcon} />
                            <span>Public Metadata Only</span>
                        </div>
                    </div>

                    <p className={styles.tagline}>Free • No signup • No files hosted</p>
                </div>
            </div>
        </>
    );
};
