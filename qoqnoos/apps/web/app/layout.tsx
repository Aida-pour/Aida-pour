import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const vazirmatn = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazir', display: 'swap' });

export const metadata: Metadata = {
  title: 'Qoqnoos — Rise from the Ashes | \u0642\u0642\u0646\u0648\u0633',
  description: 'Persian AI wellness companion. Healing rooted in culture, psychology, and wisdom.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html suppressHydrationWarning><body className={`${vazirmatn.variable} font-vazir`}><Providers>{children}</Providers></body></html>);
}
