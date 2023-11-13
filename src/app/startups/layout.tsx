import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
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
  return <div className='container mx-auto h-full'>{children}</div>;
}
