// components/Header.js
import Link from 'next/link';
import styles from './Header.module.css'; // Assuming you are using CSS modules


export default function Header({ title }) {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Link href="/">Home</Link>
        <Link href="https://github.com/dsilverio123">My GitHub</Link>
        <Link href="https://developers.google.com/civic-information/">Google Civic API</Link>
      </nav>
      <title></title>
    </header>
  );
}
