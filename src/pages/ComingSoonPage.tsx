import React from 'react';

interface ComingSoonPageProps {
    title: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{title}</h1>
            <p className="text-xl text-gray-400">Content coming soon...</p>
        </div>
    );
};

export default ComingSoonPage;
