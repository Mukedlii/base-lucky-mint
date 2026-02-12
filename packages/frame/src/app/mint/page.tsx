'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ABI, CONTRACT_ADDRESS, MINT_PRICE_ETH } from '../../lib/contract';

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
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Mint</h2>
        <ConnectButton />
      </div>

      {!canMint && (
        <div style={{ marginTop: 16, padding: 12, border: '1px solid #444', borderRadius: 10 }}>
          <b>Missing config:</b> set <code>NEXT_PUBLIC_CONTRACT_ADDRESS</code> in Vercel.
        </div>
      )}

      <div style={{ marginTop: 16, padding: 12, border: '1px solid #444', borderRadius: 10 }}>
        <div>Price: <b>{MINT_PRICE_ETH} ETH</b></div>
        <div>
          Supply:{' '}
          <b>
            {totalMinted?.toString() ?? '…'} / {maxSupply?.toString() ?? '…'}
          </b>
        </div>
      </div>

      <button
        style={{
          marginTop: 16,
          padding: '12px 16px',
          borderRadius: 12,
          border: 0,
          background: '#2b59ff',
          color: 'white',
          fontWeight: 700,
          cursor: canMint ? 'pointer' : 'not-allowed',
          opacity: canMint ? 1 : 0.5,
        }}
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

      {txHash && (
        <div style={{ marginTop: 12, fontSize: 14, opacity: 0.85 }}>
          Tx: <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noreferrer">{txHash}</a>
        </div>
      )}

      {isSuccess && (
        <div style={{ marginTop: 12, padding: 12, border: '1px solid #2a7', borderRadius: 10 }}>
          Mint success. You can view it in your wallet / OpenSea.
        </div>
      )}

      {error && (
        <div style={{ marginTop: 12, padding: 12, border: '1px solid #a22', borderRadius: 10 }}>
          {String(error.message || error)}
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <Link href="/">← back</Link>
      </div>
    </div>
  );
}
