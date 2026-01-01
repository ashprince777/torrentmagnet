export interface Torrent {
  id: string;
  title: string;
  size: string;
  rawSize: number;
  seeders: number;
  leechers: number;
  category: string;
  uploadDate: string;
  magnet: string;
  status: string;
}

export interface SearchParams {
  query: string;
  category?: string;
  minSize?: number;
  maxSize?: number;
  sort?: 'seeders' | 'size' | 'date';
}

export interface ITorrentService {
  search(params: SearchParams): Promise<Torrent[]>;
  getTrending(): Promise<Torrent[]>;
  getRecent(): Promise<Torrent[]>;
}
