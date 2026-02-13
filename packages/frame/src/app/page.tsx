import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <div>
            <h1 className={styles.title}>Base Lucky Lotto</h1>
            <p className={styles.subtitle}>
              Mint = 1 entry. Weekly draw on Base with on-chain payout.
            </p>
            <div className={styles.pills}>
              <span className={styles.pill}>0.00015 ETH</span>
              <span className={styles.pill}>max supply 3000</span>
              <span className={styles.pill}>Base</span>
            </div>

            <div className={styles.raffle}>
              <div className={styles.raffleTitle}>Weekly draw</div>
              <ul className={styles.raffleList}>
                <li><b>Demo</b>: free preview only (no entry, no rewards)</li>
                <li><b>Mint</b> = 1 entry</li>
                <li>Prize: <b>$50</b> (Base)</li>
                <li>Draw: Next Thursday (1 week)</li>
                <li>Min entries: <b>200</b> (otherwise rolls over)</li>
                <li>Payout: on-chain (tx link posted)</li>
              </ul>
            </div>

            <div className={styles.ctas}>
              <Link className={styles.primary} href="/mint?mint=1">
                Get 1 entry
              </Link>
              <a className={styles.secondary} href="/frame.png" target="_blank" rel="noreferrer">
                View frame image
              </a>
            </div>

            <p className={styles.note}>Share this URL in Farcaster to render as a Frame.</p>
          </div>

          <div className={styles.panel}>
            <p className={styles.panelTitle}>Quick link</p>
            <div className={styles.panelBig}>/mint</div>
            <p className={styles.note} style={{ marginTop: 10 }}>
              Tip: after setting Vercel env vars, redeploy for the contract config to appear.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
