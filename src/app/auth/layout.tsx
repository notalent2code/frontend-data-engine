import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Authentication - Indigo Data Engine',
  description: 'Authentication for Indigo Data Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='container mx-auto h-full'>
      <Navbar logo />
      <main className='pt-44'>{children}</main>
    </div>
  );
}
