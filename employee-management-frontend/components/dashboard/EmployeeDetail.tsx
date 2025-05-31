"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog'; // Added DialogFooter, DialogDescription

import {
  ArrowLeft,
  Save,
  Edit,
  Mail,
  Calendar,
  Building2,
  User,
  CheckSquare,
  AlertCircle,
} from "lucide-react";
import axios from "@/lib/axios";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
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
import { Backend_Url } from "@/config";

interface Employee {
  _id: string;
  username: string;
  email: string;
  designation?: string;
  department?: string;
  company: string;
  role: "admin" | "employee";
  createdAt: string;
  updatedAt: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  assignedTo: string;
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

const EmployeeDetail = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { toast } = useToast();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Employee>>({});
    const [employeeToDelete, setEmployeeToDelete] = useState<{ id: string; name: string } | null>(null); // New state to store employee to delete
      const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // New state for delete modal
    
  useEffect(() => {
    if (!id) return;

    const fetchEmployeeAndTasks = async () => {
      try {
        setLoading(true);
        const employeeResponse = await axios.get<Employee>(
          `${Backend_Url}/api/employees/${id}`
        );
        setEmployee({ ...employeeResponse.data });
        setEditForm(employeeResponse.data);

        const tasksResponse = await axios.get<Task[]>(
          `${Backend_Url}/api/tasks/employee/${id}`
        );
        setTasks(tasksResponse.data);
      } catch (error: any) {
        toast({
          title: "Error fetching details",
          description:
            error.response?.data?.message ||
            "Failed to load employee details or tasks.",
          variant: "destructive",
        });
        setEmployee(null);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeAndTasks();
  }, [id, toast,isEdited]);

  const handleSave = async () => {
    try {
      const updatedData = {
        username: editForm.username,
        email: editForm.email,
        designation: editForm.designation,
        department: editForm.department,
      };

      const response = await axios.put<Employee>(
        `${Backend_Url}/api/employees/${id}`,
        updatedData
      );
      setEmployee({ ...response.data });
      setIsEditing(false);

      toast({
        title: "Employee updated successfully",
        description: "Changes have been saved.",
      });
      setIsEdited((prev)=>!prev)
    } catch (error: any) {
      toast({
        title: "Error updating employee",
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
      case "assigned":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
      case "pending":
        return "bg-gray-500 text-white";
    }
  };

  const handleDeleteEmployee = (id: string, name: string) => {
    setEmployeeToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

    // Function to perform the actual deletion after confirmation
    const confirmDelete = async () => {
      if (!employeeToDelete) return; // Should not happen if modal is open
  
      try {
        await axios.delete(`${Backend_Url}/api/employees/${employeeToDelete.id}`);
        setIsDeleteModalOpen(false); // Close the modal
        setEmployeeToDelete(null); // Clear employee to delete
        
        toast({
          title: 'Employee deleted',
          description: `${employeeToDelete.name} has been removed from the team.`,
        });
        router.push("/adminDashboard/employees")
      } catch (error: any) {
        toast({
          title: 'Error deleting employee',
          description: error.response?.data?.message || 'Please try again later.',
          variant: 'destructive',
        });
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

  if (!employee) {
    return (
      <div className="animate-fade-in text-center py-12">
        <h3 className="text-lg font-medium text-text mb-2">
          Employee not found
        </h3>
        <Button onClick={() => router.push("/adminDashboard/employees")}>
          Back to Employees
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/adminDashboard/employees")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Employees
        </Button>

        <div className="flex-1">
          <h2 className="text-3xl font-bold text-text">{employee.username}</h2>
          <p className="text-text-secondary">
            {employee.designation} • {employee.department}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary-hover flex items-center gap-2"
              >
                <Save size={16} />
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit size={16} />
              Edit Employee
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-lg p-6 border border-gray-200 animate-slide-up">
            <h3 className="text-xl font-semibold text-text mb-6 flex items-center gap-2">
              <User size={20} />
              Employee Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="username">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="username"
                    value={editForm.username || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, username: e.target.value })
                    }
                  />
                ) : (
                  <p className="mt-1 text-text">{employee.username}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                  />
                ) : (
                  <p className="mt-1 text-text flex items-center gap-2">
                    <Mail size={16} className="text-text-secondary" />
                    {employee.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="designation">Designation</Label>
                {isEditing ? (
                  <Input
                    id="designation"
                    value={editForm.designation || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, designation: e.target.value })
                    }
                  />
                ) : (
                  <p className="mt-1 text-text">{employee.designation}</p>
                )}
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                {isEditing ? (
                  <Select
                    value={editForm.department || ""}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, department: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-text flex items-center gap-2">
                    <Building2 size={16} className="text-text-secondary" />
                    {employee.department}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="joinDate">Join Date</Label>
                <p className="mt-1 text-text flex items-center gap-2">
                  <Calendar size={16} className="text-text-secondary" />
                  {new Date(employee.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-6 border border-gray-200 animate-slide-up">
            <h3 className="text-xl font-semibold text-text mb-6 flex items-center gap-2">
              <CheckSquare size={20} />
              Assigned Tasks ({tasks.length})
            </h3>

            <div className="space-y-4">
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <div
                    key={task._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-text">{task.title}</h4>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-text-secondary text-sm mb-3">
                      {task.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <span>
                        Assigned:{" "}
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-text-secondary">
                  No tasks assigned yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface rounded-lg p-6 border border-gray-200 animate-slide-up">
            <h3 className="text-lg font-semibold text-text mb-4">Status</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Current Status</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Employee ID</span>
                <span className="font-mono text-sm">{employee._id}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Tasks Assigned</span>
                <span className="font-semibold">{tasks.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Tasks Completed</span>
                <span className="font-semibold text-success">
                  {tasks.filter((t) => t.status === "completed").length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-6 border border-gray-200 animate-slide-up">
            <h3 className="text-lg font-semibold text-text mb-4">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/adminDashboard/tasks")}
              >
                Assign New Task
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/adminDashboard/shifts")}
              >
                View Schedule
              </Button>
              <Button
                onClick={() => handleDeleteEmployee(id, employee.username)} // Calls the new handler

                variant="outline"
                className="w-full justify-start text-error border-error hover:bg-error hover:text-white"
              >
                Deactivate Employee
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-surface sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-error">
              <AlertCircle size={20} /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="mt-2">
              Are you sure you want to delete **{employeeToDelete?.name}**? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeDetail;
