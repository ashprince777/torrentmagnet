import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.disclaimer}>
                        <h3>MagnetFinder</h3>
                        <p>
                            This website does not host any files. It only indexes publicly available torrent metadata.
                            Users are responsible for how they use magnet links.
                        </p>
                    </div>
                    <div className={styles.links}>
                        <Link to="/dmca">DMCA</Link>
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <Link to="/contact">Contact</Link>
                        <Link to="/about">About</Link>
                    </div>
                </div>
                <div className={styles.copyright}>
                    &copy; {new Date().getFullYear()} MagnetFinder. Open Source & Free.
                </div>
            </div>
        </footer>
    );
};
