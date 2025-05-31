'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex w-full overflow-hidden">
      {/* Sidebar with animation */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-full"
          >
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key="content"
        className="flex-1 flex flex-col"
        initial={false}
        animate={{
          paddingLeft: sidebarOpen ? 0 : 0, 
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Header */}
        <header className="bg-surface border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="text-2xl font-semibold text-text">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <motion.main
          key="main-content"
          className="flex-1 p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </motion.div>
    </div>
  );
}
