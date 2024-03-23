// Footer.js
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        &copy; {new Date().getFullYear()} Daniel Silverio.{' '}
        <a 
          href="https://github.com/dsilverio123/" 
          className={styles.link} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Visit My GitHub
        </a>
      </p>
    </footer>
  );
}
