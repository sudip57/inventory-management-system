import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar, { Wordmark } from './Sidebar';
import IconButton from '@/components/ui/IconButton';

export default function AppLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-ink-200 bg-white px-4 lg:hidden">
          <IconButton label="Open menu" onClick={() => setNavOpen(true)}>
            <Menu size={20} />
          </IconButton>
          <Wordmark />
        </header>

        <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 py-6 sm:px-8 sm:py-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
