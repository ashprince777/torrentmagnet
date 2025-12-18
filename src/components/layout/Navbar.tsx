import { Link } from 'react-router-dom';
import { Magnet } from 'lucide-react';
import styles from './Navbar.module.css';

export const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <Magnet className={styles.icon} size={28} />
                    <span className={styles.brand}>MagnetFinder</span>
                </Link>
                <div className={styles.links}>
                    <Link to="/about">About</Link>
                </div>
            </div>
        </nav>
    );
};
