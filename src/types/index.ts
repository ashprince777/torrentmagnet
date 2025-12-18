export interface Torrent {
  id: string;
  title: string;
  size: string;
  seeders: number;
  leechers: number;
  category: string;
  uploadDate: string;
  magnet: string;
}

export interface SearchParams {
  query: string;
  category?: string;
  sort?: 'seeders' | 'size' | 'date';
}

export interface ITorrentService {
  search(params: SearchParams): Promise<Torrent[]>;
}
