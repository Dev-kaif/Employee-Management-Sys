'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Users, Calendar, CheckSquare, ChevronLeft, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Employees',
      icon: Users,
      path: '/dashboard/employees',
      description: 'Manage team members'
    },
    {
      name: 'Tasks',
      icon: CheckSquare,
      path: '/dashboard/tasks',
      description: 'Track assignments'
    },
    {
      name: 'Shifts',
      icon: Calendar,
      path: '/dashboard/shifts',
      description: 'Schedule overview'
    },
  ];

  const isActive = (path: string) => pathname.startsWith(path);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    router.push('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="sidebar"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`h-screen w-64 bg-surface border-r border-gray-200 fixed left-0 top-0 z-30 shadow-md`}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <div>
                <h2 className="font-semibold text-text">Dashboard</h2>
                <p className="text-sm text-text-secondary">Management Portal</p>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <motion.button
                    key={item.name}
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-200 group ${
                      active
                        ? 'bg-primary text-white shadow-lg'
                        : 'hover:bg-gray-100 text-text-secondary hover:text-text'
                    }`}
                    title={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Icon
                      size={20}
                      className={`${active ? 'text-white' : 'text-text-secondary group-hover:text-text'} transition-colors`}
                    />
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <p className={`text-xs ${active ? 'text-blue-100' : 'text-text-secondary'} mt-1`}>
                        {item.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}

              <motion.button
                onClick={handleLogout}
                className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-200 group mt-4 hover:bg-red-100 text-red-600 hover:text-red-700`}
                title="Logout"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: menuItems.length * 0.05 }}
              >
                <LogOut size={20} className="text-red-500 group-hover:text-red-700 transition-colors" />
                <div>
                  <span className="font-medium whitespace-nowrap">Logout</span>
                  <p className="text-xs text-red-400 mt-1 whitespace-nowrap">End session</p>
                </div>
              </motion.button>
            </nav>
          </div>

          <button
            onClick={onToggle}
            className="absolute -right-3 top-8 w-6 h-6 bg-surface border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ChevronLeft
              size={12}
              className={`text-text-secondary transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
