import type { Metadata } from 'next';
import '@/styles/globals.css';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Dashboard - Indigo Data Engine',
  description: 'Dashboard for Indigo Data Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex'>
      <Sidebar />
      <main className='flex-1'>
        <Navbar logo={false} />
        <div className='container mx-auto p-8 pt-16'>{children}</div>
      </main>
    </div>
  );
}
