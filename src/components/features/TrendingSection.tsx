import { useEffect, useState } from 'react';
import { TrendingUp, Clock, Loader2 } from 'lucide-react';
import { TorrentService } from '../../services/TorrentService';
import { TorrentCard } from './SearchResults/TorrentCard';
import type { Torrent } from '../../types';
import styles from './TrendingSection.module.css';

interface TrendingSectionProps {
    title: string;
    type: 'trending' | 'recent';
}

export const TrendingSection = ({ title, type }: TrendingSectionProps) => {
    const [torrents, setTorrents] = useState<Torrent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const data = type === 'trending'
                    ? await TorrentService.getTrending()
                    : await TorrentService.getRecent();

                // Limit to 6 items to keep logic simple and UI clean
                setTorrents(data.slice(0, 6));
            } catch (err) {
                console.error("Failed to load trending items", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, [type]);

    if (!loading && torrents.length === 0) return null;

    return (
        <div className={styles.trendingContainer}>
            <div className={styles.trendingHeader}>
                {type === 'trending' ? <TrendingUp className={styles.trendingIcon} /> : <Clock className={styles.trendingIcon} />}
                {title}
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                </div>
            ) : (
                <div className={styles.trendingGrid}>
                    {torrents.map(torrent => (
                        <TorrentCard key={torrent.id} torrent={torrent} />
                    ))}
                </div>
            )}
        </div>
    );
};
