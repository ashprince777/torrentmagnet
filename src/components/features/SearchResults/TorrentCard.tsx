import { useState } from 'react';
import { Check, Download, Users, HardDrive, Calendar } from 'lucide-react';
import type { Torrent } from '../../../types';
import styles from './TorrentCard.module.css';
import clsx from 'clsx';

interface TorrentCardProps {
    torrent: Torrent;
}

export const TorrentCard = ({ torrent }: TorrentCardProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(torrent.magnet).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <span className={clsx(styles.category, styles[torrent.category.toLowerCase()] || styles.default)}>
                        {torrent.category}
                    </span>
                    <h3 className={styles.title}>{torrent.title}</h3>
                </div>
                <button
                    onClick={handleCopy}
                    className={clsx(styles.copyButton, copied && styles.copied)}
                    title="Copy Magnet Link"
                >
                    {copied ? <Check size={18} /> : <div className={styles.magnetIcon}>🧲</div>}
                    <span className={styles.copyText}>{copied ? 'Copied' : 'Magnet'}</span>
                </button>
            </div>

            <div className={styles.meta}>
                <div className={styles.metaItem}>
                    <HardDrive size={14} />
                    <span>{torrent.size}</span>
                </div>
                <div className={clsx(styles.metaItem, styles.seeders)}>
                    <Download size={14} className={styles.rotate} /> {/* Using Download icon rotated as rough proxy or just arrow */}
                    <span>{torrent.seeders}</span>
                </div>
                <div className={clsx(styles.metaItem, styles.leechers)}>
                    <Users size={14} />
                    <span>{torrent.leechers}</span>
                </div>
                <div className={styles.metaItem}>
                    <Calendar size={14} />
                    <span>{torrent.uploadDate}</span>
                </div>
            </div>
        </div>
    );
};
