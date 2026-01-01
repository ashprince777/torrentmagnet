import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="container mx-auto px-6 py-20 max-w-3xl text-text-secondary">
            <h1 className="text-4xl md:text-5xl font-bold mb-10 text-white leading-tight">Privacy Policy</h1>

            <div className="space-y-8 text-lg leading-relaxed">
                <p>
                    Your privacy is important to us. It is MagnetFinder's policy to respect your privacy regarding any information we may collect from you across our website.
                </p>

                <div>
                    <h2 className="text-2xl font-bold mt-10 mb-4 text-white">Log Files</h2>
                    <p>
                        MagnetFinder follows a standard procedure of using log files. These files log visitors when they visit websites. However, we are committed to minimizing data retention. We perform <strong className="text-primary">no long-term logging of IP addresses</strong> or search history associated with specific users.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mt-10 mb-4 text-white">Cookies and Web Beacons</h2>
                    <p>
                        Like any other website, MagnetFinder uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mt-10 mb-4 text-white">Third Party Privacy Policies</h2>
                    <p>
                        MagnetFinder's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                    </p>
                </div>

                <div className="bg-surface/50 p-6 rounded-lg border border-white/5 mt-8 backdrop-blur-sm">
                    <h2 className="text-xl font-bold mb-2 text-white">Consent</h2>
                    <p>
                        By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
