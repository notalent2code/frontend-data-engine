import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Portfolio - Indigo Data Engine',
  description: 'List of startups in Indigo Data Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='container mx-auto h-full pb-10'>
      <Navbar logo />
      <main className='pt-16'>{children}</main>
    </div>
  );
}
