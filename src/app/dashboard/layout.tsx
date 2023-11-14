'use client';

import '@/styles/globals.css';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.session);

  if (!user) {
    router.push('/auth/login');
  }

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
