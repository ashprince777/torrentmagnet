import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Loader2 } from 'lucide-react';
import { useTorrentSearch } from '../hooks/useTorrentSearch';
import { TorrentCard } from '../components/features/SearchResults/TorrentCard';
import { FilterBar } from '../components/features/SearchResults/FilterBar';
import styles from './SearchResultsPage.module.css';

export const SearchResultsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    // Local state for filters to be applied
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [sort, setSort] = useState<'seeders' | 'size' | 'date'>((searchParams.get('sort') as any) || 'seeders');

    const { results, isLoading, error, search } = useTorrentSearch();

    useEffect(() => {
        search({ query, category, sort });
    }, [query, category, sort, search]);

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

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newQuery = formData.get('query') as string;
        if (newQuery.trim()) {
            setSearchParams({ q: newQuery.trim(), category, sort });
        }
    };

    return (
        <>
            <Helmet>
                <title>{query ? `${query} - ` : ''}Search Results - MagnetFinder</title>
            </Helmet>

            <div className={styles.container}>
                <form onSubmit={handleSearchSubmit} className={styles.searchHeader}>
                    <div className={styles.inputWrapper}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            name="query"
                            defaultValue={query}
                            className={styles.searchInput}
                            placeholder="Search torrents..."
                        />
                        <button type="submit" className={styles.searchButton}>Search</button>
                    </div>
                </form>

                <FilterBar
                    category={category}
                    sort={sort}
                    onCategoryChange={handleCategoryChange}
                    onSortChange={handleSortChange}
                />

                {isLoading && (
                    <div className={styles.center}>
                        <Loader2 className={styles.spinner} size={40} />
                        <p>Searching trackers...</p>
                    </div>
                )}

                {error && (
                    <div className={styles.center}>
                        <p className={styles.error}>{error}</p>
                    </div>
                )}

                {!isLoading && !error && results.length === 0 && (
                    <div className={styles.center}>
                        <p className={styles.noResults}>No results found for "{query}"</p>
                    </div>
                )}

                <div className={styles.resultsGrid}>
                    {results.map(torrent => (
                        <TorrentCard key={torrent.id} torrent={torrent} />
                    ))}
                </div>
            </div>
        </>
    );
};
