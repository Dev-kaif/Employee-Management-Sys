"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Calendar,
  User,
  Filter,
  CheckSquare,
  Trash2,
} from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/hooks/use-toast";
import axios from "@/lib/axios";
import { Backend_Url } from "@/config";
import { Employee } from "@/lib/types";

interface employee {
  _id: string;
  email: string;
  username: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  assignedTo: employee;
  assignedBy: string;
  dueDate: string;
  scheduledFor?: string;
  isScheduled: boolean;
  status: "pending" | "assigned" | "in-progress" | "completed";
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    scheduledFor: "",
  });
  const [isCreated, setIsCreated] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  const [taskToDeleteTitle, setTaskToDeleteTitle] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, employeesResponse] = await Promise.all([
        axios.get<Task[]>(`${Backend_Url}/api/tasks`),
        axios.get<employee[]>(`${Backend_Url}/api/employees`),
      ]);
      // Sort tasks by createdAt in descending order (most recent first)
      const sortedTasks = tasksResponse.data.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setTasks(sortedTasks);
      setEmployees(employeesResponse.data);
    } catch (error: any) {
      toast({
        title: "Error fetching data",
        description:
          error.response?.data?.message || "Failed to load tasks or employees.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [toast, isCreated, isDeleting]);

  const getEmployeeDetails = (employeeId: string): employee | undefined => {
    return employees.find((emp) => emp._id === employeeId);
  };

  const filteredTasks = tasks.filter((task) => {
    const assignedToEmployee = task.assignedTo
      ? getEmployeeDetails(task.assignedTo._id)
      : undefined;

    const assignedToName = assignedToEmployee?.username?.toLowerCase() || "";

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignedToName.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    const matchesAssignee =
      assigneeFilter === "all" || task.assignedTo?._id === assigneeFilter;

    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const handleCreateTask = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let isScheduled = false;
    let scheduledForISO: string | undefined = undefined;

    if (newTask.scheduledFor) {
      const selectedScheduledDate = new Date(newTask.scheduledFor);
      selectedScheduledDate.setHours(0, 0, 0, 0);

      if (selectedScheduledDate.getTime() !== today.getTime()) {
        isScheduled = true;
      }
      scheduledForISO = selectedScheduledDate.toISOString();
    }

    try {
      const payload = {
        ...newTask,
        dueDate: new Date(newTask.dueDate).toISOString(),
        scheduledFor: scheduledForISO,
        isScheduled: isScheduled,
      };

      const response = await axios.post(
        `${Backend_Url}/api/tasks/assign`,
        payload
      );
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        scheduledFor: "",
      });
      setIsCreateModalOpen(false);

      toast({
        title: "Task created successfully",
        description: response.data.message || "Task assigned successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating task",
        description: error.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCreated((prev) => !prev);
    }
  };

  const handleDeleteClick = (taskId: string, taskTitle: string) => {
    setTaskToDeleteId(taskId);
    setTaskToDeleteTitle(taskTitle);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDeleteId) return;
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${Backend_Url}/api/tasks/${taskToDeleteId}`
      );
      toast({
        title: "Task Deleted",
        description: response.data.message || "Task removed successfully.",
      });
      setIsDeleteConfirmModalOpen(false);
      setTaskToDeleteId(null);
      setTaskToDeleteTitle("");
    } catch (error: any) {
      toast({
        title: "Deletion Failed",
        description:
          error.response?.data?.message ||
          "Failed to delete the task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string, isPastDeadline: boolean) => {
    if (isPastDeadline && status !== "completed") { // Only show red if not completed
      return "bg-red-600 text-white";
    }
    switch (status) {
      case "completed":
        return "bg-success text-white";
      case "in-progress":
        return "bg-warning text-white";
      case "pending":
        return "bg-gray-500 text-white";
      case "assigned":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getDeadlineStatus = (dueDate: string, status: string) => {
    if (status.toLowerCase() === "completed") {
      return { text: "Completed", isPastDeadline: false }; // Indicate completion
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(dueDate);
    deadline.setHours(0, 0, 0, 0);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return {
        text: `Passed Deadline (${Math.abs(diffDays)} days ago)`,
        isPastDeadline: true,
      };
    } else if (diffDays === 0) {
      return { text: "Due Today!", isPastDeadline: false };
    } else if (diffDays === 1) {
      return { text: "Due Tomorrow!", isPastDeadline: false };
    } else {
      return { text: `${diffDays} days left`, isPastDeadline: false };
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-text">Tasks</h2>
          <p className="text-text-secondary mt-1">
            Manage and track project assignments
          </p>
        </div>

        {/* Create Task Dialog */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover flex items-center gap-2">
              <Plus size={16} />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-surface">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Enter task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignee">Assign To</Label>
                  <Select
                    value={newTask.assignedTo}
                    onValueChange={(value) =>
                      setNewTask({ ...newTask, assignedTo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp._id} value={emp._id}>
                          {emp.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduledFor">Assignment Start Date</Label>
                  <Input
                    id="scheduledFor"
                    type="date"
                    value={newTask.scheduledFor}
                    onChange={(e) =>
                      setNewTask({ ...newTask, scheduledFor: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="dueDate">Completion Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                />
              </div>
              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTask}
                  disabled={
                    !newTask.title || !newTask.assignedTo || !newTask.dueDate
                  }
                  className="bg-primary hover:bg-primary-hover"
                >
                  Create Task
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-surface rounded-lg p-4 mb-6 border border-gray-200 animate-slide-up">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {employees.map((emp) => (
                <SelectItem key={emp._id} value={emp._id}>
                  {emp.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 text-text-secondary">
            <Filter size={16} />
            <span className="text-sm">{filteredTasks.length} tasks</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task, index) => {
          const assignedToEmployee = getEmployeeDetails(task.assignedTo._id);
          const deadlineStatus = getDeadlineStatus(task.dueDate, task.status);
          const isPastDeadline = deadlineStatus.isPastDeadline;

          return (
            <div
              key={task._id}
              className="bg-surface rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text mb-2">
                    {task.title}
                  </h3>
                  <p className="text-text-secondary mb-3">{task.description}</p>

                  <div className="flex items-center gap-4 text-sm text-text-secondary flex-wrap">
                    {" "}
                    {/* Added flex-wrap */}
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {assignedToEmployee?.username || "N/A"}{" "}
                      {/* Corrected: Use looked-up employee */}
                    </span>
                    {/* Display Due Date / Completion Status */}
                    <span className="flex items-center gap-1">
                      <Calendar
                        size={14}
                        className={isPastDeadline ? "text-red-500" : ""}
                      />
                      {task.status === "completed" ? (
                        <>
                          Completed By:{" "}
                          {new Date(task.dueDate).toLocaleDateString()}
                          {` (`}
                          <span className="font-medium text-success">
                            {deadlineStatus.text}
                          </span>
                          {`)`}
                        </>
                      ) : (
                        <>
                          Complete By:{" "}
                          {new Date(task.dueDate).toLocaleDateString()}
                          {` (`}
                          <span
                            className={
                              isPastDeadline
                                ? "font-bold text-red-600"
                                : "font-medium text-blue-600"
                            }
                          >
                            {deadlineStatus.text}
                          </span>
                          {`)`}
                        </>
                      )}
                    </span>
                    {task.scheduledFor && (
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-purple-500" />
                        Planned Assignment:{" "}
                        {new Date(task.scheduledFor).toLocaleDateString()}
                      </span>
                    )}
                    {task.status === "completed" && task.startedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-blue-500" />
                        Started At:{" "}
                        {new Date(task.startedAt).toLocaleDateString()}
                      </span>
                    )}
                    {task.status === "completed" && task.completedAt && (
                      <span className="flex items-center gap-1">
                        <CheckSquare size={14} className="text-green-500" />
                        Completed At:{" "}
                        {new Date(task.completedAt).toLocaleDateString()}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <CheckSquare size={14} />
                      Scheduled: {task.isScheduled ? "Yes" : "No"}
                    </span>
                    <span>
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {/* Status Badge - now conditional on deadline */}
                <Badge className={getStatusColor(task.status, isPastDeadline)}>
                  {isPastDeadline && task.status !== "completed"
                    ? "Passed Deadline"
                    : task.status.replace("-", " ")}
                </Badge>

                {task.status !== "completed" && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-error border-error hover:bg-error hover:text-white"
                      onClick={() => handleDeleteClick(task._id, task.title)}
                      disabled={isDeleting}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <CheckSquare size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text mb-2">No tasks found</h3>
          <p className="text-text-secondary">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmModalOpen}
        onOpenChange={setIsDeleteConfirmModalOpen}
      >
        <DialogContent className="bg-surface sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the task " **{taskToDeleteTitle}**
              "? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteConfirmModalOpen(false);
                setTaskToDeleteId(null);
                setTaskToDeleteTitle("");
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                "Delete Task"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksPage;