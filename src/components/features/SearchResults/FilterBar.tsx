import clsx from 'clsx';
import { Filter, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
    category: string;
    sort: 'seeders' | 'size' | 'date' | undefined;
    sizeFilter: string;
    onCategoryChange: (category: string) => void;
    onSortChange: (sort: 'seeders' | 'size' | 'date') => void;
    onSizeFilterChange: (sizerange: string) => void;
}

const CATEGORIES = ['All', 'Movies', 'TV Shows', 'Software', 'Games', 'Music'];
const SORTS = [
    { value: 'seeders', label: 'Seeders' },
    { value: 'size', label: 'Size' },
    { value: 'date', label: 'Date' }
];

const SIZE_RANGES = [
    { value: 'all', label: 'Any Size' },
    { value: 'small', label: '< 1 GB' },
    { value: 'medium', label: '1 GB - 5 GB' },
    { value: 'large', label: '5 GB - 10 GB' },
    { value: 'xlarge', label: '> 10 GB' },
];

export const FilterBar = ({ category, sort, sizeFilter, onCategoryChange, onSortChange, onSizeFilterChange }: FilterBarProps) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-start md:items-center">
            {/* Category Filter */}
            <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                <div className="flex items-center gap-2 text-text-muted text-sm whitespace-nowrap">
                    <Filter size={16} />
                    <span className="hidden md:inline">Category:</span>
                </div>
                <div className="flex items-center gap-2">
                    {CATEGORIES.map((c) => (
                        <button
                            key={c}
                            onClick={() => onCategoryChange(c === 'All' ? '' : c)}
                            className={clsx(
                                "px-3 py-1.5 rounded-lg text-sm transition-all whitespace-nowrap",
                                (c === 'All' ? !category : category === c)
                                    ? "bg-primary/20 text-primary border border-primary/20 font-medium"
                                    : "bg-surface border border-white/5 text-text-secondary hover:text-white hover:bg-white/5"
                            )}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-6 w-px bg-white/10 hidden md:block" />

            <div className="flex items-center gap-4">
                {/* Size Filter */}
                <select
                    className="h-9 rounded-lg bg-surface border border-white/10 text-sm text-text-secondary focus:outline-none focus:border-primary/50 transition-colors px-3 appearance-none cursor-pointer hover:bg-white/5"
                    value={sizeFilter || 'all'}
                    onChange={(e) => onSizeFilterChange(e.target.value)}
                >
                    {SIZE_RANGES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>

                {/* Sort Filter */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-text-muted text-sm">
                        <ArrowUpDown size={16} />
                        <span className="hidden md:inline">Sort:</span>
                    </div>
                    <select
                        className="h-9 rounded-lg bg-surface border border-white/10 text-sm text-text-secondary focus:outline-none focus:border-primary/50 transition-colors px-3 appearance-none cursor-pointer hover:bg-white/5"
                        value={sort || 'seeders'}
                        onChange={(e) => onSortChange(e.target.value as any)}
                    >
                        {SORTS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
