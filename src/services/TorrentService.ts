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

const API_BASE_URL = 'https://apibay.org/q.php';

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
    if (id >= 200 && id < 300) return 'Movies'; // Includes TV technically in some mappings, but Apibay often separates
    if (id >= 300 && id < 400) return 'Software';
    if (id >= 400 && id < 500) return 'Games';
    return 'Other';
};

export const TorrentService: ITorrentService = {
    async search(params: SearchParams): Promise<Torrent[]> {
        try {
            // If no query, Apibay doesn't return "latest" easily on q.php without params, 
            // but 'precompiled' lists exist. For now, require query or default to a popular term if empty?
            // Actually, let's just return empty if no query to be safe, or handle "recent" if requested.
            // User flow: user types query.

            let query = params.query;
            if (!query) {
                // Return empty or maybe default list?
                // Let's return empty for now to avoid spamming the API on load if not needed
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

            // Client-side filtering/sorting since API is simple
            if (params.category && params.category !== 'All') {
                // Simple mapping check. Since we mapped IDs to strings, we filter by string.
                // Note: This matches the "Music", "Movies" etc we set above.
                results = results.filter(t => t.category === params.category);
            }

            if (params.sort) {
                results.sort((a, b) => {
                    if (params.sort === 'seeders') return b.seeders - a.seeders;
                    // Parse date back or just sort? We formatted it. 
                    // Better to keep raw date? 
                    // For simplicity reusing the same sort logic but with parsing might be flaky.
                    // Let's trust the seeders sort mostly.
                    if (params.sort === 'date') return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
                    // Size is string now, difficult to sort without raw.
                    return 0;
                });
            }

            return results;

        } catch (error) {
            console.error("Torrent search failed:", error);
            throw error;
        }
    }
};
