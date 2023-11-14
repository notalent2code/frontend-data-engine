import '@/styles/globals.css';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

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
        <div className='container mx-auto p-8 pt-20'>{children}</div>
      </main>
    </div>
  );
}
