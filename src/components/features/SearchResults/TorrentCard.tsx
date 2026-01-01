import { useState } from 'react';
import { Check, Download, Users, HardDrive, Calendar } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import type { Torrent } from '../../../types';
import clsx from 'clsx';

interface TorrentCardProps {
    torrent: Torrent;
}

export const TorrentCard = ({ torrent }: TorrentCardProps) => {
    const [copied, setCopied] = useState(false);
    const { showToast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(torrent.magnet).then(() => {
            setCopied(true);
            showToast('Magnet link copied successfully!', 'success');
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            showToast('Failed to copy magnet link', 'error');
        });
    };

    const categoryColor = {
        movies: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        'tv shows': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
        games: 'text-green-400 bg-green-400/10 border-green-400/20',
        music: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
        software: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
        other: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    }[torrent.category.toLowerCase()] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';

    return (
        <div className="group relative p-4 rounded-xl bg-surface/40 hover:bg-surface/60 border border-white/5 hover:border-primary/30 transition-all duration-300 backdrop-blur-sm flex flex-col gap-3 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-2 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className={clsx("w-fit px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold border", categoryColor)}>
                            {torrent.category}
                        </span>
                        {torrent.status === 'vip' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">VIP</span>
                        )}
                        {torrent.status === 'trusted' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">TRUSTED</span>
                        )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-100 line-clamp-2 leading-relaxed group-hover:text-primary transition-colors" title={torrent.title}>
                        {torrent.title}
                    </h3>
                </div>
                <button
                    onClick={handleCopy}
                    className={clsx(
                        "flex-shrink-0 h-9 px-3 rounded-lg flex items-center gap-2 text-xs font-medium transition-all duration-200 border",
                        copied
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-white/5 text-text-secondary border-white/5 hover:bg-primary/20 hover:text-primary hover:border-primary/30"
                    )}
                    title="Copy Magnet Link"
                >
                    {copied ? <Check size={14} /> : <span>🧲</span>}
                    <span className="hidden sm:inline">{copied ? 'Copied' : 'Magnet'}</span>
                </button>
            </div>

            <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-xs text-text-secondary">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5" title="Size">
                        <HardDrive size={12} className="text-text-muted" />
                        <span>{torrent.size}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Uploaded">
                        <Calendar size={12} className="text-text-muted" />
                        <span>{torrent.uploadDate}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-green-400" title="Seeders">
                        <Download size={12} className="rotate-180" />
                        <span className="font-medium">{torrent.seeders}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-red-400" title="Leechers">
                        <Users size={12} />
                        <span>{torrent.leechers}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
