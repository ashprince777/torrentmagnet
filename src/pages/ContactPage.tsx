import React from 'react';

const ContactPage: React.FC = () => {
    return (
        <div className="container mx-auto px-6 py-20 max-w-2xl text-text-secondary flex flex-col justify-center min-h-[70vh]">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white text-center leading-tight">Contact Us</h1>

            <p className="text-xl text-center mb-16 text-text-secondary max-w-lg mx-auto leading-relaxed">
                Have questions, suggestions, or just want to say hello? We'd love to hear from you.
            </p>

            <div className="bg-surface/50 p-10 rounded-2xl border border-white/5 shadow-2xl text-center backdrop-blur-sm transform hover:scale-[1.01] transition-all duration-300">
                <div className="mb-2">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Email Us</h2>
                    <p className="text-text-muted mb-8">For general inquiries, partnership opportunities, or feedback.</p>
                    <a href="mailto:contact@magnetfinder.com" className="inline-block bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-4 px-10 rounded-lg transition duration-200 text-lg shadow-lg hover:shadow-primary/25">
                        contact@magnetfinder.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
