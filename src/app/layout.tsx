import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Flight Travel Agency - Your Journey Begins Here',
    template: '%s | Flight Travel Agency',
  },
  description:
    'Discover amazing travel destinations, read travel blogs, and plan your next adventure with Flight Travel Agency.',
  keywords: ['travel', 'agency', 'vacation', 'tours', 'travel blog', 'destinations'],
  authors: [{ name: 'Flight Travel Agency' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://flight-travel-agency.com',
    siteName: 'Flight Travel Agency',
    title: 'Flight Travel Agency - Your Journey Begins Here',
    description: 'Discover amazing travel destinations and plan your next adventure.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flight Travel Agency',
    description: 'Discover amazing travel destinations and plan your next adventure.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
