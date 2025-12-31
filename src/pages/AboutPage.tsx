import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-200">
            <h1 className="text-4xl font-bold mb-8 text-white">About MagnetFinder</h1>

            <div className="space-y-6 text-lg leading-relaxed">
                <p>
                    MagnetFinder is a specialized search engine designed to index and locate torrent metadata from public distributed networks. Our mission is to provide a fast, efficient, and user-friendly interface for discovering content availability across the decentralized web.
                </p>

                <p>
                    We believe in the power of decentralized technology to preserve information and facilitate sharing. MagnetFinder acts purely as a search tool—similar to Google or Bing—but focused specifically on the BitTorrent network DHT (Distributed Hash Table).
                </p>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mt-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Important Disclaimer</h2>
                    <p className="mb-4">
                        MagnetFinder <strong>does not host, store, or distribute any files</strong>. We only index text-based metadata (magnet links and hashes) that are already publicly available on the internet.
                    </p>
                    <p>
                        We have no control over the files that users may choose to download via these magnet links. We strongly urge our users to respect copyright laws and intellectual property rights in their jurisdiction.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
