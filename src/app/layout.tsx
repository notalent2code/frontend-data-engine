import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import Providers from '@/components/Providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Indigo Data Engine',
  description: 'Frontend App for Indigo Data Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={cn('bg-slate-50 text-slate-900 antialiased', inter.className)}
    >
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body className='min-h-screen bg-slate-50 antialiased'>
        <div className='mx-auto h-full'>
          <Providers>{children}</Providers>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
