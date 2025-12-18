import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import styles from './Layout.module.css';

export const Layout = () => {
    return (
        <div className={styles.appContainer}>
            <Navbar />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
