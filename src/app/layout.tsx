import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import StoreProvider from '~/store/StoreProvider';
import { WagmiProviderWrapper } from '~/components/provider/WagmiProviderWrapper';
import { connectToDatabase } from '~/config/mongo.config';
import dbConnect from '~/lib/db.connect';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Work Ledger',
  description: 'Blockchain-based attendance system',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await dbConnect();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <WagmiProviderWrapper>
            {children}
            </WagmiProviderWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
