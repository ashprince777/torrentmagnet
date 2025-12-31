import React from 'react';

const DmcaPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-200">
            <h1 className="text-4xl font-bold mb-8 text-white">DMCA Compliance</h1>

            <div className="space-y-6 text-lg leading-relaxed">
                <p>
                    MagnetFinder respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998, the text of which may be found on the U.S. Copyright Office website at <a href="http://www.copyright.gov/legislation/dmca.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">http://www.copyright.gov/legislation/dmca.pdf</a>, we will respond expeditiously to claims of copyright infringement committed using the MagnetFinder service that are reported to our Designated Copyright Agent.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Takedown Notice</h2>
                <p>
                    If you are a copyright owner, or are authorized to act on behalf of one, or authorized to act under any exclusive right under copyright, please report alleged copyright infringements taking place on or through the Site by completing the following DMCA Notice of Alleged Infringement and delivering it to our Designated Copyright Agent.
                </p>

                <p>
                    Since MagnetFinder does not host artifacts (files) but only indexes metadata (magnet links), we cannot remove the underlying files from the network. However, upon receipt of a valid removal request, we will remove the reference (magnet link) to the content from our search index.
                </p>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-white">Contact for DMCA Notices</h3>
                    <p className="mb-2">
                        Please file your notice by sending an email to:
                    </p>
                    <a href="mailto:dmca@magnetfinder.com" className="text-xl font-bold text-blue-400 hover:text-blue-300">
                        dmca@magnetfinder.com
                    </a>
                    <p className="mt-4 text-sm text-gray-400">
                        Please allow up to 72 hours for a response.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DmcaPage;
