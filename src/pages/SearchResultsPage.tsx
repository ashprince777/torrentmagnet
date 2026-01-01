import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTorrentSearch } from '../hooks/useTorrentSearch';
import { TorrentCard } from '../components/features/SearchResults/TorrentCard';
import { FilterBar } from '../components/features/SearchResults/FilterBar';

export const SearchResultsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    // Local state for filters to be applied
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [sort, setSort] = useState<'seeders' | 'size' | 'date'>((searchParams.get('sort') as any) || 'seeders');
    const [sizeFilter, setSizeFilter] = useState(searchParams.get('size') || 'all');

    const { results, isLoading, error, search } = useTorrentSearch();

    useEffect(() => {
        const getBytes = (val: string) => {
            if (val === 'small') return { maxSize: 1024 * 1024 * 1024 }; // < 1GB
            if (val === 'medium') return { minSize: 1024 * 1024 * 1024, maxSize: 5 * 1024 * 1024 * 1024 }; // 1GB - 5GB
            if (val === 'large') return { minSize: 5 * 1024 * 1024 * 1024, maxSize: 10 * 1024 * 1024 * 1024 }; // 5GB - 10GB
            if (val === 'xlarge') return { minSize: 10 * 1024 * 1024 * 1024 }; // > 10GB
            return {};
        };
        const sizeParams = getBytes(sizeFilter);

        search({ query, category, sort, ...sizeParams });
    }, [query, category, sort, sizeFilter, search]);

    const handleCategoryChange = (cat: string) => {
        setCategory(cat);
        // Optionally update URL to reflect filters so they are shareable
        setSearchParams(prev => {
            if (cat) prev.set('category', cat);
            else prev.delete('category');
            return prev;
        });
    };

    const handleSortChange = (s: 'seeders' | 'size' | 'date') => {
        setSort(s);
        setSearchParams(prev => {
            prev.set('sort', s);
            return prev;
        });
    };

    const handleSizeChange = (s: string) => {
        setSizeFilter(s);
        setSearchParams(prev => {
            if (s && s !== 'all') prev.set('size', s);
            else prev.delete('size');
            return prev;
        });
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newQuery = formData.get('query') as string;
        if (newQuery.trim()) {
            setSearchParams({ q: newQuery.trim(), category, sort, size: sizeFilter !== 'all' ? sizeFilter : '' });
        }
    };

    return (
        <>
            <Helmet>
                <title>{query ? `${query} - ` : ''}Search Results - MagnetFinder</title>
            </Helmet>

            <div className="min-h-screen bg-background text-text-primary p-4 md:p-8 pt-24">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header Search & Filter */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-40 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-white/5">
                        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted">
                                <Search size={20} />
                            </div>
                            <input
                                name="query"
                                defaultValue={query}
                                className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface border border-white/10 text-white placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                placeholder="Search torrents..."
                            />
                            <button type="submit" className="hidden">Search</button>
                        </form>

                        <FilterBar
                            category={category}
                            sort={sort}
                            sizeFilter={sizeFilter}
                            onCategoryChange={handleCategoryChange}
                            onSortChange={handleSortChange}
                            onSizeFilterChange={handleSizeChange}
                        />
                    </div>

                    {/* Content */}
                    <div className="min-h-[60vh]">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                                <p className="text-text-muted">Searching trackers...</p>
                            </div>
                        )}

                        {error && (
                            <div className="flex flex-col items-center justify-center py-20 text-secondary">
                                <p className="text-lg font-medium">{error}</p>
                            </div>
                        )}

                        {!isLoading && !error && results.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                                <p className="text-lg">No results found for "{query}"</p>
                                <p className="text-sm mt-2">Try different keywords or filters</p>
                            </div>
                        )}

                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        >
                            <AnimatePresence>
                                {results.map((torrent, index) => (
                                    <motion.div
                                        key={torrent.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <TorrentCard torrent={torrent} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};
