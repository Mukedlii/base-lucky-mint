'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ABI, CONTRACT_ADDRESS, MINT_PRICE_ETH } from '../../lib/contract';
import styles from './mint.module.css';

export default function MintPage() {
  const router = useRouter();
  const [mintMode, setMintMode] = useState(false);

  useEffect(() => {
    const qs = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const ok = qs?.get('mint') === '1';
    if (!ok) router.replace('/');
    setMintMode(Boolean(ok));
  }, [router]);

  if (!mintMode) return null;

  const [shareOpened, setShareOpened] = useState(false);
  const [shareConfirmed, setShareConfirmed] = useState(false);

  const shareText = useMemo(() => {
    return `I minted a Lucky Ticket 🎟 from Base Lucky Lotto — hope I get lucky.\n\nGet 1 entry ($50 weekly draw): ${typeof window !== 'undefined' ? window.location.origin : ''}/?t=3`;
  }, []);

  const warpcastShareUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const text = encodeURIComponent(
      `I minted a Lucky Ticket 🎟 from Base Lucky Lotto — hope I get lucky.\n\nGet 1 entry ($50 weekly draw): ${baseUrl}/?t=3`
    );
    const embed = encodeURIComponent(`${baseUrl}/?t=3`);
    return `https://warpcast.com/~/compose?text=${text}&embeds[]=${embed}`;
  }, []);

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
  const shareGateOk = shareOpened && shareConfirmed;

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

            <div className={styles.shareGate}>
              <div className={styles.shareTitle}>Step 1 — Share to unlock mint</div>
              <div className={styles.shareText}>
                {shareText || 'I minted a Lucky Ticket…'}
              </div>
              <div className={styles.shareActions}>
                <a
                  className={styles.shareBtn}
                  href={warpcastShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setShareOpened(true)}
                >
                  Open Warpcast (share)
                </a>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={shareConfirmed}
                    onChange={(e) => setShareConfirmed(e.target.checked)}
                    disabled={!shareOpened}
                  />
                  Posted ✅ (I’m back)
                </label>
              </div>
              {!shareGateOk && (
                <div className={styles.shareHint}>
                  Click mint → it opens Warpcast with the text. Post it, come back, then tick “Posted”.
                </div>
              )}
            </div>

            <div className={styles.actions}>
              <button
                className={styles.primaryBtn}
                disabled={!canMint || isPending || isConfirming}
                onClick={() => {
                  if (!shareGateOk) {
                    setShareOpened(true);
                    // Open Warpcast compose in a new tab; user returns and confirms.
                    window.open(warpcastShareUrl, '_blank', 'noopener,noreferrer');
                    return;
                  }

                  writeContract({
                    abi: ABI,
                    address: CONTRACT_ADDRESS,
                    functionName: 'mint',
                    value: parseEther(MINT_PRICE_ETH),
                  });
                }}
              >
                {!shareGateOk
                  ? 'Share & recast first'
                  : isPending
                    ? 'Confirm in wallet…'
                    : isConfirming
                      ? 'Minting…'
                      : 'Mint now'}
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
