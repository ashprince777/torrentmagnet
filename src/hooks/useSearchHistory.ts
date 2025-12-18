import { useState, useEffect } from 'react';

const HISTORY_KEY = 'magnet_search_history';
const MAX_HISTORY_ITEMS = 10;

export const useSearchHistory = () => {
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse search history', e);
            }
        }
    }, []);

    const addToHistory = (query: string) => {
        if (!query.trim()) return;

        setHistory(prev => {
            // Remove duplicates and move new query to top
            const filtered = prev.filter(item => item.toLowerCase() !== query.toLowerCase());
            const newHistory = [query, ...filtered].slice(0, MAX_HISTORY_ITEMS);

            localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem(HISTORY_KEY);
    };

    const removeFromHistory = (query: string) => {
        setHistory(prev => {
            const newHistory = prev.filter(item => item !== query);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
            return newHistory;
        });
    };

    return { history, addToHistory, clearHistory, removeFromHistory };
};
