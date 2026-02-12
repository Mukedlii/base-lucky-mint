import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Base Lucky Lotto</h1>
        <p>Mint a lucky ticket NFT on Base (fixed supply, fixed price).</p>
        <div className={styles.ctas}>
          <Link className={styles.primary} href="/mint">
            Go to mint
          </Link>
        </div>
        <p style={{ opacity: 0.75, fontSize: 13 }}>
          Share this URL in Farcaster to render as a Frame.
        </p>
      </main>
    </div>
  );
}
