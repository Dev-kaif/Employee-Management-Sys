// app/tasks/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react"; // Using framer-motion as suggested earlier
import TaskCard from "@/components/ui/taskCard";
import { dashboardAPI } from "@/lib/api"; // Import your API client
import { Task, Employee } from "@/lib/types"; // Import Task and Employee types
import { useToast } from "@/components/hooks/use-toast";
import { Search, Filter, CheckSquare } from "lucide-react"; // Icons for search and filter
import Input from "@/components/ui/input"; // Your Input component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MyLoader from "@/components/ui/loader";

const TasksDashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksData] = await Promise.all([
        dashboardAPI.getTasks(),
      ]);
      console.log(tasksData);
      
      setTasks(tasksData);
    } catch (error: any) {
      console.error("Failed to fetch tasks or employees:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to load tasks or employees.",
        variant: "destructive",
      });
    } finally {
        setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.assignedTo &&
        task.assignedTo.username
          .toLowerCase()
          .includes(searchTerm.toLowerCase())); // Check for assignedTo existence

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <MyLoader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-text">All Tasks</h2>
            <p className="text-text-secondary mt-1">
              Browse and manage all assigned tasks.
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-surface rounded-lg p-4 mb-6 border border-gray-200 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Input
                icon={<Search size={16} />}
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-text-secondary">
              <Filter size={16} />
              <span className="text-sm">{filteredTasks.length} tasks</span>
            </div>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <TaskCard task={task} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 animate-fade-in">
              <CheckSquare
                size={48}
                className="text-text-secondary mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-text mb-2">
                No tasks found
              </h3>
              <p className="text-text-secondary">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TasksDashboardPage;
