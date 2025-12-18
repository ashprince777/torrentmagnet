import { useState, useCallback } from 'react';
import type { Torrent, SearchParams } from '../types';
import { TorrentService } from '../services/TorrentService';

export const useTorrentSearch = () => {
    const [results, setResults] = useState<Torrent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const search = useCallback(async (params: SearchParams) => {
        // Avoid searching if query is empty and no category selected, unless we want to show all (maybe popular?)
        // For now, allow empty query to return all mock data (as "recent" or similar)

        setIsLoading(true);
        setError(null);
        try {
            const data = await TorrentService.search(params);
            setResults(data);
        } catch (err) {
            setError('Failed to fetch torrents. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { results, isLoading, error, search };
};
