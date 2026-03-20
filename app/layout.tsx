import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Golf Charity - Score, Play, Give Back',
  description: 'Track your golf scores and contribute to charity through monthly prize draws',
  keywords: 'golf, charity, subscription, draws, fundraising',
  robots: 'index, follow',
  openGraph: {
    title: 'Golf Charity - Score, Play, Give Back',
    description: 'Track your golf scores and contribute to charity through monthly prize draws',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
