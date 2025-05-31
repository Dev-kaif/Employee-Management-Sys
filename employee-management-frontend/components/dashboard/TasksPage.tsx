"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Calendar,
  User,
  Filter,
  CheckSquare,
} from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/hooks/use-toast";
import axios from "@/lib/axios";
import { Backend_Url } from "@/config";
import { Employee, Task } from "@/lib/types";



const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
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
  });
  const [isCreating, setIsCreating] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksResponse, employeesResponse] = await Promise.all([
          axios.get<Task[]>(`${Backend_Url}/api/tasks`),
          axios.get<Employee[]>(`${Backend_Url}/api/employees`),
        ]);
        setTasks(tasksResponse.data);
        setEmployees(employeesResponse.data);
      } catch (error: any) {
        toast({
          title: "Error fetching data",
          description:
            error.response?.data?.message ||
            "Failed to load tasks or employees.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const filteredTasks = tasks.filter((task) => {
    const assignedToName = task.assignedTo?.username?.toLowerCase() || "";
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "" ||
      assignedToName.includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    // const matchesPriority = priorityFilter === 'all' || (task.priority === priorityFilter);
    const matchesAssignee =
      assigneeFilter === "all" || task.assignedTo?._id === assigneeFilter;

    // return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const handleCreateTask = async () => {
    try {
      const response = await axios.post(`${Backend_Url}/api/tasks/assign`, {
        ...newTask,
        dueDate: new Date(newTask.dueDate).toISOString(),
        scheduledFor: newTask.dueDate
          ? new Date(newTask.dueDate).toISOString()
          : undefined,
      });
      setTasks((prev) => [
        {
          ...response.data.task,
          assignedTo: employees.find((emp) => emp._id === newTask.assignedTo),
          assignedBy: { _id: "current_user_id", username: "Current User" },
        },
        ...prev,
      ]); // Adjust assignedBy with actual user data if available
      setNewTask({ title: "", description: "", assignedTo: "", dueDate: "" });
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
    }
  };

  const getStatusColor = (status: string) => {
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
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Enter task description"
                  rows={3}
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
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
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
              </div>
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
        {filteredTasks.map((task, index) => (
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

                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {task.assignedTo?.username || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <span>
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(task.status)}>
                {task.status.replace("-", " ")}
              </Badge>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-error border-error hover:bg-error hover:text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
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
    </div>
  );
};

export default TasksPage;
