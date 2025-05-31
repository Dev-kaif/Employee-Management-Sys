"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react"; 
import { Task, Shift } from "@/lib/types";
import {
  Clock,
  ListTodo,
  Play,
  Pause,
  Loader,
  CircleDashed,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/input";
import { dashboardAPI } from "@/lib/api";
import { useToast } from "@/components/hooks/use-toast";
import MyLoader from "@/components/ui/loader";

const MainDashboardEmployee: React.FC = () => {
  const { toast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingShiftAction, setLoadingShiftAction] = useState(false);

  const [shiftTime, setShiftTime] = useState(0);
  const [isEndShiftModalOpen, setIsEndShiftModalOpen] = useState(false);
  const [workSummary, setWorkSummary] = useState("");

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "in-progress":
        return "bg-primary text-white";
      case "completed":
        return "bg-success text-white";
      case "assigned":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const currentShift = shifts.find((shift) => !shift.endTime);
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const assignedTasks = tasks.filter((task) => task.status === "assigned");

  // Function to load all necessary data (tasks and shifts)
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksData, shiftsData] = await Promise.all([
        dashboardAPI.getTasks(),
        dashboardAPI.getShifts(),
      ]);
      setTasks(tasksData);
      setShifts(shiftsData);
    } catch (error: any) {
      console.error("Failed to load active tasks and shifts data:", error);
      toast({
        title: "Error loading data",
        description:
          error.response?.data?.message || "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData,loadingShiftAction]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (currentShift && currentShift.startTime) {
      const startTimeValue = new Date(currentShift.startTime).getTime();

      if (isNaN(startTimeValue)) {
        console.error(
          "Invalid shift startTime encountered:",
          currentShift.startTime
        );
        setShiftTime(0); 
        return; 
      }

      // Initialize shiftTime immediately without waiting for the first interval tick
      const now = new Date().getTime();
      const initialElapsed = Math.floor((now - startTimeValue) / 1000);
      setShiftTime(initialElapsed > 0 ? initialElapsed : 0); // Ensure non-negative

      timer = setInterval(() => {
        const currentNow = new Date().getTime();
        const elapsed = Math.floor((currentNow - startTimeValue) / 1000);
        setShiftTime(elapsed);
      }, 1000);
    } else {
      setShiftTime(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentShift]);

  const handleShiftStart = async () => {
    setLoadingShiftAction(true);
    try {
      const newShift = await dashboardAPI.startShift();
      setShifts((prev) => [newShift, ...prev]);
      toast({
        title: "Shift started",
        description: "Your shift has begun.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Failed to start shift:", error);
      toast({
        title: "Error starting shift",
        description: error.response?.data?.message || "Failed to start shift.",
        variant: "destructive",
      });
    } finally {
      setLoadingShiftAction(false);
    }
  };

  const handleShiftEnd = async () => {
    if (!currentShift) {
      toast({
        title: "Error",
        description: "No active shift found to end.",
        variant: "destructive",
      });
      return;
    }
    if (!workSummary.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide a summary of your work.",
        variant: "destructive",
      });
      return;
    }

    setLoadingShiftAction(true);
    try {
      console.log(currentShift._id);

      const endedShift = await dashboardAPI.endShift(
        currentShift._id,
        workSummary
      );
      setShifts((prev) =>
        prev.map((s) => (s._id === endedShift._id ? endedShift : s))
      ); // Update the ended shift
      setWorkSummary(""); // Clear summary
      setIsEndShiftModalOpen(false); // Close modal
      toast({
        title: "Shift Ended",
        description: "Your shift has been successfully ended.",
      });
    } catch (error: any) {
      console.error("Failed to end shift:", error);
      toast({
        title: "Error ending shift",
        description: error.response?.data?.message || "Failed to end shift.",
        variant: "destructive",
      });
    } finally {
      setLoadingShiftAction(false);
    }
  };

  if (loading) {
    return <MyLoader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Applied motion to the main title */}
      <motion.h2
        className="text-3xl font-bold text-text mb-6"
        initial={{ y: 20, opacity: 0, filter: "blur(8px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Active Dashboard
      </motion.h2>

      {/* Shift Controls Card with blur animation */}
      <motion.div
        initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} className="text-primary" /> Shift Status
            </CardTitle>
            <CardDescription>Manage your daily work shifts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text mb-1">
                  Shift Status
                </h3>
                {currentShift ? (
                  <div className="text-sm text-text-secondary">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-success text-white text-xs font-medium mr-2">
                      Active
                    </span>
                    <span className="text-lg font-mono font-semibold text-primary">
                      {formatTime(shiftTime)}
                    </span>
                    <br />
                    <span className="text-xs">
                      Started at{" "}
                      {new Date(currentShift.startTime).toLocaleTimeString()}
                    </span>
                  </div>
                ) : (
                  <p className="text-text-secondary">No active shift</p>
                )}
              </div>

              <div className="flex space-x-3">
                {!currentShift ? (
                  <Button
                    onClick={handleShiftStart}
                    disabled={loadingShiftAction}
                    className="bg-primary text-white flex items-center gap-2 px-6 py-2"
                  >
                    {loadingShiftAction ? (
                      <Loader className="animate-spin" size={16} />
                    ) : (
                      <Play size={16} />
                    )}
                    Start Shift
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsEndShiftModalOpen(true)}
                    disabled={loadingShiftAction}
                    className="bg-error hover:bg-red-600 text-white flex items-center gap-2 px-6 py-2"
                  >
                    {loadingShiftAction ? (
                      <Loader className="animate-spin" size={16} />
                    ) : (
                      <Pause size={16} />
                    )}
                    End Shift
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Assigned Tasks Section with blur animation */}
      {assignedTasks.length > 0 && (
        <motion.section
          initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListTodo size={20} className="text-blue-500" /> Assigned Tasks
              </CardTitle>
              <CardDescription>
                New tasks assigned to you, awaiting your action.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignedTasks.map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
                >
                  <div>
                    <h3 className="font-semibold text-text">{task.title}</h3>
                    <p className="text-sm text-text-secondary">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace("-", " ")}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.section>
      )}

      {/* In Progress Tasks Section with blur animation */}
      {inProgressTasks.length > 0 && (
        <motion.section
          initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleDashed size={20} className="text-primary" /> In Progress
                Tasks
              </CardTitle>
              <CardDescription>
                Tasks you are currently working on.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {inProgressTasks.map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
                >
                  <div>
                    <h3 className="font-semibold text-text">{task.title}</h3>
                    <p className="text-sm text-text-secondary">
                      {task.description}
                    </p>
                    {/* Assuming these date fields are available in your Task type and populated */}
                    <div className="mt-2 text-xs text-text-secondary">
                      Deadline:{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace("-", " ")}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.section>
      )}

      {/* End Shift Dialog */}
      <Dialog open={isEndShiftModalOpen} onOpenChange={setIsEndShiftModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Shift</DialogTitle>
            <DialogDescription>
              Please provide a summary of your work during this shift.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="workSummary">Work Summary</Label>
            <Input
              id="workSummary"
              value={workSummary}
              onChange={(e) => setWorkSummary(e.target.value)}
              placeholder="e.g. : Completed project X, attended meeting Y"
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEndShiftModalOpen(false)}
              disabled={loadingShiftAction}

            >
              Cancel
            </Button>
            <Button
              onClick={handleShiftEnd}
              disabled={!workSummary.trim() || loadingShiftAction}
            >
              {loadingShiftAction ? (
                <Loader className="animate-spin mr-2" size={16} />
              ) : null}
              Confirm End Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainDashboardEmployee;
