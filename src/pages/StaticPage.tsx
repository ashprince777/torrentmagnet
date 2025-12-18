import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

export const StaticPage = () => {
    const { page } = useParams();
    const title = page ? page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ') : 'Page';

    return (
        <>
            <Helmet>
                <title>{title} - MagnetFinder</title>
            </Helmet>
            <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h1>{title}</h1>
                <p>Content coming soon...</p>
            </div>
        </>
    );
};
