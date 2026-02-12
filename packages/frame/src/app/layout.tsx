import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';
import { Providers } from './providers';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Base Lucky Lotto',
  description: 'Mint an on-chain lucky ticket on Base.',
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: 'Base Lucky Lotto',
    description: 'Mint an on-chain lucky ticket on Base.',
    images: ['/frame.png'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${baseUrl}/frame.png`,
    'fc:frame:button:1': 'Mint',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${baseUrl}/mint`,
    'fc:frame:button:2': 'View contract',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': process.env.NEXT_PUBLIC_BASESCAN_URL || 'https://basescan.org',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
