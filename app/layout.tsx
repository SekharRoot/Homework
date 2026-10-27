import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Homework - WhatsApp Subject Digest & Card Generator',
  description: 'Organize daily homework and topics for Physics, Chemistry, Biology, Math, and English into clean, sharp preview cards and high-resolution downloadable PNG images.',
  openGraph: {
    title: 'Homework - WhatsApp Subject Digest & Card Generator',
    description: 'Organize daily homework and topics for Physics, Chemistry, Biology, Math, and English into clean, sharp preview cards and high-resolution downloadable PNG images.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Homework - WhatsApp Subject Digest & Card Generator',
    description: 'Organize daily homework and topics for Physics, Chemistry, Biology, Math, and English into clean, sharp preview cards and high-resolution downloadable PNG images.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
