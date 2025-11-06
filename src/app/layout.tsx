import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/layout/theme-provider';
import RootLayoutClient from './layout-client';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://fruqvideos.com'),
  title: {
    default: 'FruqVideos - Watch Amazing Video Content',
    template: '%s | FruqVideos',
  },
  description: 'Discover and watch amazing video content across multiple categories. Browse tutorials, guides, cooking, fitness, DIY, education and more on FruqVideos.',
  keywords: ['videos', 'tutorials', 'guides', 'education', 'cooking', 'fitness', 'DIY', 'learning'],
  authors: [{ name: 'FruqVideos' }],
  creator: 'FruqVideos',
  publisher: 'FruqVideos',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'FruqVideos - Watch Amazing Video Content',
    description: 'Discover and watch amazing video content across multiple categories.',
    siteName: 'FruqVideos',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FruqVideos - Watch Amazing Video Content',
    description: 'Discover and watch amazing video content across multiple categories.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-background font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <RootLayoutClient>
            {children}
          </RootLayoutClient>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
