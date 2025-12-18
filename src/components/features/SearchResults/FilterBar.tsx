import clsx from 'clsx';
import { Filter, ArrowUpDown } from 'lucide-react';
import styles from './FilterBar.module.css';

interface FilterBarProps {
    category: string;
    sort: 'seeders' | 'size' | 'date' | undefined;
    onCategoryChange: (category: string) => void;
    onSortChange: (sort: 'seeders' | 'size' | 'date') => void;
}

const CATEGORIES = ['All', 'Movies', 'TV Shows', 'Software', 'Games', 'Music'];
const SORTS = [
    { value: 'seeders', label: 'Seeders' },
    { value: 'size', label: 'Size' },
    { value: 'date', label: 'Date' }
];

export const FilterBar = ({ category, sort, onCategoryChange, onSortChange }: FilterBarProps) => {
    return (
        <div className={styles.filterBar}>
            <div className={styles.section}>
                <div className={styles.label}>
                    <Filter size={16} />
                    <span>Category:</span>
                </div>
                <div className={styles.options}>
                    {CATEGORIES.map((c) => (
                        <button
                            key={c}
                            onClick={() => onCategoryChange(c === 'All' ? '' : c)}
                            className={clsx(styles.chip, {
                                [styles.active]: c === 'All' ? !category : category === c
                            })}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.label}>
                    <ArrowUpDown size={16} />
                    <span>Sort by:</span>
                </div>
                <select
                    className={styles.select}
                    value={sort || 'seeders'}
                    onChange={(e) => onSortChange(e.target.value as any)}
                >
                    {SORTS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
