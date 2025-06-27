import Navbar from '@theme/components/layout/navbar';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import { ReactNode } from 'react';

// Theme-specific fonts - only loaded when this theme is active
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-noto-sans-arabic'
});

export default function ThemeContent({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.className} ${notoSansArabic.className}`}>
      <Navbar />
      {children}
    </div>
  );
}
