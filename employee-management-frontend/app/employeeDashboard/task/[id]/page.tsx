"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react"; 

import {
  ArrowLeft,
  Info,
  CheckSquare,
  Play,
  Loader,
  CalendarDays, 
  FileText, 
  CalendarPlus, 
} from "lucide-react";

import { dashboardAPI } from "@/lib/api"; 
import { Task } from "@/lib/types"; 
import { useToast } from "@/components/hooks/use-toast"; 
import Button from "@/components/ui/button"; 
import { Label } from "@/components/ui/label"; 
import { Badge } from "@/components/ui/badge"; 
import MyLoader from "@/components/ui/loader";
import { updateEmployee } from '../../../../../employee-management-backend/src/controllers/employeeController';

const TaskDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const { toast } = useToast();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatedStatus, setIsUpdatedStatus] = useState(false);

  const fetchTaskDetails = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedTask = await dashboardAPI.getTaskById(taskId);
      setTask(fetchedTask);
    } catch (error: any) {
      console.error("Failed to fetch task details:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to load task details.",
        variant: "destructive",
      });
      router.push("/employeeDashboard/task");
    } finally {
      setLoading(false);
    }
  }, [taskId, toast, router]);

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId, fetchTaskDetails,isUpdatedStatus]);

  const handleStatusUpdate = async (newStatus: Task["status"]) => {
    if (!task) return;

    setIsUpdatingStatus(true);
    try {
      const updatedTask = await dashboardAPI.updateTaskStatus(
        task._id,
        newStatus
      );
      setTask(updatedTask);
      toast({
        title: "Status Updated",
        description: `Task status changed to "${newStatus}".`,
      });
    } catch (error: any) {
      console.error("Failed to update task status:", error);
      toast({
        title: "Update Failed",
        description:
          error.response?.data?.message ||
          "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
      setIsUpdatedStatus((prev)=>!prev)
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "assigned":
        return "bg-blue-500 text-white";
      case "in-progress":
        return "bg-primary text-white";
      case "completed":
        return "bg-success text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const isOverdue =
    task && new Date(task.dueDate) < new Date() && task.status !== "completed";

  if (loading) {
    return (
      <MyLoader/>
    );
  }

  if (!task) {
    return (
      <div className="animate-fade-in text-center py-12">
        <h3 className="text-lg font-medium text-text mb-2">Task not found</h3>
        <Button onClick={() => router.push("/employeeDashboard/task")}>Back to Tasks</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/employeeDashboard/task")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Tasks
          </Button>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-text">{task.title}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface rounded-lg p-6 border border-gray-200 animate-slide-up">
              <h3 className="text-xl font-semibold text-text mb-6 flex items-center gap-2">
                <Info size={20} />
                Task Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Task Title field */}
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <p className="mt-1 text-text">{task.title}</p>
                </div>

                {/* Date fields */}
                <div>
                  <Label>Assigned Date</Label>
                  <p className="mt-1 text-text flex items-center gap-2">
                    <CalendarPlus size={16} className="text-text-secondary" />
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <Label>Deadline</Label>
                  <p
                    className={`mt-1 text-text flex items-center gap-2 ${
                      isOverdue ? "text-error font-medium" : ""
                    }`}
                  >
                    <CalendarDays size={16} className="text-text-secondary" />
                    {new Date(task.dueDate).toLocaleDateString()}
                    {isOverdue && " (Overdue)"}
                  </p>
                </div>

                {task.startedAt && (
                  <div>
                    <Label>Started At</Label>
                    <p className="mt-1 text-text flex items-center gap-2">
                      <Play size={16} className="text-text-secondary" />
                      {new Date(task.startedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {task.completedAt && (
                  <div>
                    <Label>Completed At</Label>
                    <p className="mt-1 text-text flex items-center gap-2">
                      <CheckSquare size={16} className="text-text-secondary" />
                      {new Date(task.completedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-surface rounded-lg p-6 border border-gray-200 animate-slide-up">
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <FileText size={20} /> Task Description
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {task.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Task Summary Card (remains in right column) */}
            <div className="bg-surface rounded-lg p-6 border border-gray-200 animate-slide-up">
              <h3 className="text-lg font-semibold text-text mb-4">
                Task Summary
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Current Status</span>
                  <Badge
                    className={`px-3 py-1 text-xs ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Task ID</span>
                  <span className="font-mono text-sm">{task._id}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Overdue</span>
                  <Badge variant={isOverdue ? "destructive" : "secondary"}>
                    {isOverdue ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Actions Card (remains in right column) */}
            <div className="bg-surface rounded-lg p-6 border border-gray-200 animate-slide-up">
              <h3 className="text-lg font-semibold text-text mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                {task.status !== "completed" ? (
                  <>
                    {task.status === "assigned" && (
                      <Button
                        onClick={() => handleStatusUpdate("in-progress")}
                        disabled={isUpdatingStatus}
                        className="w-full justify-start bg-primary hover:bg-primary-hover text-white flex items-center gap-2"
                      >
                        {isUpdatingStatus ? (
                          <Loader size={16} className="animate-spin" />
                        ) : (
                          <Play size={16} />
                        )}
                        Start Task
                      </Button>
                    )}

                    {task.status === "in-progress" && (
                      <Button
                        onClick={() => handleStatusUpdate("completed")}
                        disabled={isUpdatingStatus}
                        className="w-full justify-start bg-success hover:bg-green-600 text-white flex items-center gap-2"
                      >
                        {isUpdatingStatus ? (
                          <Loader size={16} className="animate-spin" />
                        ) : (
                          <CheckSquare size={16} />
                        )}
                        Mark as Complete
                      </Button>
                    )}
                  </>
                ) : (
                  <p className="text-text-secondary text-center text-sm py-4">
                    This task is completed.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetailPage;
