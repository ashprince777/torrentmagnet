import type { ITorrentService, SearchParams, Torrent } from '../types';

interface ApibayResult {
    id: string;
    name: string;
    info_hash: string;
    leechers: string;
    seeders: string;
    num_files: string;
    size: string;
    username: string;
    added: string;
    status: string;
    category: string;
    imdb: string;
}



const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString();
};

const mapCategory = (catId: string): string => {
    const id = parseInt(catId);
    if (id >= 100 && id < 200) return 'Music';
    if (id >= 200 && id < 300) return 'Movies';
    if (id >= 300 && id < 400) return 'Software';
    if (id >= 400 && id < 500) return 'Games';
    return 'Other';
};

export const TorrentService: ITorrentService = {
    async search(params: SearchParams): Promise<Torrent[]> {
        try {
            let query = params.query;
            if (!query) {
                return [];
            }

            // Use local Vite proxy
            const url = `/api/q.php?q=${encodeURIComponent(query)}&cat=`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data: ApibayResult[] = await response.json();

            if (data[0] && data[0].name === 'No results returned') {
                return [];
            }

            let results = data.map(item => ({
                id: item.id,
                title: item.name,
                size: formatSize(parseInt(item.size)),
                seeders: parseInt(item.seeders),
                leechers: parseInt(item.leechers),
                category: mapCategory(item.category),
                uploadDate: formatDate(parseInt(item.added)),
                magnet: `magnet:?xt=urn:btih:${item.info_hash}&dn=${encodeURIComponent(item.name)}&tr=udp://tracker.opentrackr.org:1337/announce`
            }));

            if (params.category && params.category !== 'All') {
                results = results.filter(t => t.category === params.category);
            }

            if (params.sort) {
                results.sort((a, b) => {
                    if (params.sort === 'seeders') return b.seeders - a.seeders;
                    if (params.sort === 'date') return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
                    return 0;
                });
            }

            return results;

        } catch (error) {
            console.error("Torrent search failed:", error);
            throw error;
        }
    },

    async getTrending(): Promise<Torrent[]> {
        try {
            const response = await fetch('/api/precompiled/data_top100_all.json');
            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data: ApibayResult[] = await response.json();

            return data.slice(0, 50).map(item => ({
                id: item.id,
                title: item.name,
                size: formatSize(parseInt(item.size)),
                seeders: parseInt(item.seeders),
                leechers: parseInt(item.leechers),
                category: mapCategory(item.category),
                uploadDate: formatDate(parseInt(item.added)),
                magnet: `magnet:?xt=urn:btih:${item.info_hash}&dn=${encodeURIComponent(item.name)}&tr=udp://tracker.opentrackr.org:1337/announce`
            }));
        } catch (error) {
            console.error("Trending fetch failed:", error);
            return [];
        }
    },

    async getRecent(): Promise<Torrent[]> {
        try {
            const response = await fetch('/api/precompiled/data_top100_recent.json');
            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data: ApibayResult[] = await response.json();

            return data.slice(0, 50).map(item => ({
                id: item.id,
                title: item.name,
                size: formatSize(parseInt(item.size)),
                seeders: parseInt(item.seeders),
                leechers: parseInt(item.leechers),
                category: mapCategory(item.category),
                uploadDate: formatDate(parseInt(item.added)),
                magnet: `magnet:?xt=urn:btih:${item.info_hash}&dn=${encodeURIComponent(item.name)}&tr=udp://tracker.opentrackr.org:1337/announce`
            }));
        } catch (error) {
            console.error("Recent fetch failed:", error);
            return [];
        }
    }
};
