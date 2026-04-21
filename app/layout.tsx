import type {Metadata} from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Sona | Offline Transcript Editor',
  description: 'Powerful, offline transcript editor built with Tauri, React, and Sherpa-onnx. Fast, accurate, and private speech-to-text.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorantGaramond.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-[#F7F5F2] text-[#2D2D2D] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
