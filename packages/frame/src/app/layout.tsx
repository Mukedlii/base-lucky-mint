import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';
import { Providers } from './providers';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Mini App Embed (Frames v2 successor). This makes Warpcast open the app in an in-app modal
// instead of bouncing users out to Safari when they interact with the embed.
const miniAppEmbed = {
  version: '1',
  imageUrl: `${baseUrl}/frame.png`,
  button: {
    title: 'Mint',
    action: {
      type: 'launch_frame',
      name: 'Base Lucky Lotto',
      url: `${baseUrl}/mint`,
      splashImageUrl: `${baseUrl}/icon.png`,
      splashBackgroundColor: '#0a0a12',
    },
  },
};

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
    // New (Mini Apps)
    'fc:miniapp': JSON.stringify(miniAppEmbed),

    // Backward compatibility: clients that still look for fc:frame can parse the same embed.
    // Avoid legacy button/link tags here, because those can force a browser redirect.
    'fc:frame': JSON.stringify(miniAppEmbed),
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
