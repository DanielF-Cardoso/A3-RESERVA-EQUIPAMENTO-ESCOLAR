'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './sidebar';
import { Footer } from './footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 overflow-y-auto w-full flex flex-col">
        {/* Mobile Header com botão hambúrguer */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={24} className="text-slate-700" />
          </button>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>

        <Footer />
      </main>
    </div>
  );
}
