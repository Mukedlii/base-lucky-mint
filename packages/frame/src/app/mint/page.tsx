'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ABI, CONTRACT_ADDRESS, MINT_PRICE_ETH } from '../../lib/contract';
import styles from './mint.module.css';

export default function MintPage() {
  const { data: totalMinted } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'totalMinted',
    query: { enabled: Boolean(CONTRACT_ADDRESS) },
  });

  const { data: maxSupply } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'MAX_SUPPLY',
    query: { enabled: Boolean(CONTRACT_ADDRESS) },
  });

  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const canMint = Boolean(CONTRACT_ADDRESS);

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.header}>
          <div className={styles.brand}>
            <h2 className={styles.brandTitle}>Mint a Lucky Ticket</h2>
            <p className={styles.brandSub}>Base Lucky Lotto • on-chain ticket NFT</p>
          </div>
          <ConnectButton />
        </div>

        <div className={styles.card}>
          <div className={styles.cardInner}>
            {!canMint && (
              <div className={styles.alert}>
                <b>Missing config:</b> set <code>NEXT_PUBLIC_CONTRACT_ADDRESS</code> in Vercel.
              </div>
            )}

            <div className={styles.row}>
              <div className={styles.stat}>
                <div className={styles.statLabel}>Price</div>
                <div className={styles.statValue}>{MINT_PRICE_ETH} ETH</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statLabel}>Supply</div>
                <div className={styles.statValue}>
                  {totalMinted?.toString() ?? '…'} / {maxSupply?.toString() ?? '…'}
                </div>
              </div>
            </div>

            <div className={styles.badgeRow}>
              <span className={styles.badge}>Fixed price</span>
              <span className={styles.badge}>Fixed supply</span>
              <span className={styles.badge}>Base</span>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.primaryBtn}
                disabled={!canMint || isPending || isConfirming}
                onClick={() => {
                  writeContract({
                    abi: ABI,
                    address: CONTRACT_ADDRESS,
                    functionName: 'mint',
                    value: parseEther(MINT_PRICE_ETH),
                  });
                }}
              >
                {isPending ? 'Confirm in wallet…' : isConfirming ? 'Minting…' : 'Mint now'}
              </button>
              <Link className={styles.secondaryLink} href="/">
                ← back
              </Link>
            </div>

            {txHash && (
              <div className={styles.small}>
                Tx:{' '}
                <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noreferrer">
                  {txHash}
                </a>
              </div>
            )}

            {isSuccess && <div className={styles.success}>Mint success. Check your wallet / OpenSea.</div>}

            {error && <div className={styles.error}>{String(error.message || error)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
