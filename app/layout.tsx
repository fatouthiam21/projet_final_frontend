import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Urban Style | Mode Masculine Premium',
    template: '%s | Urban Style',
  },
  description:
    'Découvrez Urban Style - votre destination mode masculine premium. Jeans, cargos, sneakers, chemises et plus. Livraison au Sénégal.',
  keywords: ['mode homme', 'vêtements', 'sneakers', 'jeans', 'Sénégal', 'Dakar', 'Urban Style'],
  authors: [{ name: 'Urban Style' }],
  creator: 'Urban Style',
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Urban Style',
    title: 'Urban Style | Mode Masculine Premium',
    description: 'Votre destination mode masculine premium au Sénégal',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Urban Style' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Urban Style | Mode Masculine Premium',
    description: 'Votre destination mode masculine premium au Sénégal',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { background: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))', border: '1px solid hsl(var(--border))' },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
