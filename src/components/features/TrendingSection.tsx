import { useEffect, useState } from 'react';
import { TrendingUp, Clock, Loader2 } from 'lucide-react';
import { TorrentService } from '../../services/TorrentService';
import { TorrentCard } from './SearchResults/TorrentCard';
import type { Torrent } from '../../types';

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
        <div className="w-full">
            <div className="flex items-center gap-2 mb-6 text-xl font-semibold text-white">
                {type === 'trending' ? <TrendingUp className="text-primary" size={24} /> : <Clock className="text-accent" size={24} />}
                {title}
            </div>

            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {torrents.map(torrent => (
                        <TorrentCard key={torrent.id} torrent={torrent} />
                    ))}
                </div>
            )}
        </div>
    );
};
