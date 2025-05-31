// app/employeedashboard/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar'; 
import Header from '@/components/ui/header'
import { Calendar, CheckSquare, Menu, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react'; 
import type { ReactNode } from 'react';

export default function EmployeeDashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: Users,
      path: '/employeedashboard', // Points to the main dashboard page (Active Tasks)
      description: 'Your active tasks and shift status',
    },
    {
      name: 'Task History',
      icon: CheckSquare,
      path: '/employeedashboard/task', // Points to the task history list page
      description: 'Review past and current tasks',
    },
    {
      name: 'Shift History',
      icon: Calendar,
      path: '/employeedashboard/shift', // Points to the shift history page
      description: 'Overview of your past shifts',
    },
  ];

  useEffect(() => {
    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, [router]); 

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
            className="h-full fixed top-0 left-0 z-20" // Add fixed positioning and z-index
          >
            <Sidebar menuItem={menuItems} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key="content-area" 
        className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarOpen ? '256px' : '0px' }} 
      >
        <Header nametype={"Employee"} aboolean={sidebarOpen} setFunction={()=>setSidebarOpen(!sidebarOpen)} /> 

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