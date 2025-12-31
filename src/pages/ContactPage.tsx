import React from 'react';

const ContactPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-xl text-gray-200">
            <h1 className="text-4xl font-bold mb-8 text-white text-center">Contact Us</h1>

            <p className="text-lg text-center mb-12 text-gray-300">
                Have questions, suggestions, or just want to say hello? We'd love to hear from you.
            </p>

            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-lg text-center">
                <div className="mb-6">
                    <svg className="w-16 h-16 mx-auto text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <h2 className="text-xl font-semibold text-white mb-2">Email Us</h2>
                    <p className="text-gray-400 mb-6">For general inquiries, partnership opportunities, or feedback.</p>
                    <a href="mailto:contact@magnetfinder.com" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded transition duration-200 text-lg">
                        contact@magnetfinder.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
