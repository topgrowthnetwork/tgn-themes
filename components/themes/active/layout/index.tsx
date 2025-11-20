import Container from '@theme/components/container';
import FontProvider from '@theme/components/font-provider';
import Footer from '@theme/components/layout/footer';
import Navbar from '@theme/components/layout/navbar';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import { ReactNode, Suspense } from 'react';

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
    <FontProvider fontClasses={[inter.variable, notoSansArabic.variable]}>
      <Navbar />
      {children}
      <Suspense>
        <div className="border-t bg-[#0f2f3d] text-white">
          <Container>
            <Footer />
          </Container>
        </div>
      </Suspense>
    </FontProvider>
  );
}
