'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import { Calendar, CheckSquare, Menu, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ReactNode } from 'react';
import Header from '@/components/ui/header'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const menuItems = [
    {
      name: 'Employees',
      icon: Users,
      path: '/adminDashboard/employees',
      description: 'Manage team members',
    },
    {
      name: 'Tasks',
      icon: CheckSquare,
      path: '/adminDashboard/tasks',
      description: 'Track assignments',
    },
    {
      name: 'Shifts',
      icon: Calendar,
      path: '/adminDashboard/shifts',
      description: 'Schedule overview',
    },
  ];

  useEffect(() => {
    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }

    if(localStorage.getItem("role") !== "admin"){
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
            <Sidebar menuItem={menuItems} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
        <Header nametype={"Admin"} aboolean={sidebarOpen} setFunction={()=>setSidebarOpen(!sidebarOpen)} /> 


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
