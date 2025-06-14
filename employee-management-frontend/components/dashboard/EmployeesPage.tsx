"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Trash2,
  Eye,
  Filter,
  Users,
  AlertCircle,
  Clock, // Import Clock for shift times
  Calendar, // Import Calendar for shift dates
} from "lucide-react";
import axios from "@/lib/axios";
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
import { useToast } from "@/components/hooks/use-toast";
import { Backend_Url } from "@/config";
import { Employee, Shift } from "@/lib/types"; // Ensure Shift type is imported
import { Badge } from "@/components/ui/badge"; // Import Badge component

const EmployeesPage = () => {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]); // State to store shifts
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    username: "",
    email: "",
    password: "",
    designation: "",
    department: "",
  });

  const [isViewShiftsModalOpen, setIsViewShiftsModalOpen] = useState(false);
  const [selectedEmployeeShifts, setSelectedEmployeeShifts] = useState<Shift[]>([]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [currentLiveTime, setCurrentLiveTime] = useState(new Date()); // For live shift duration

  const { toast } = useToast();

  const departments = [
    "Engineering",
    "Product",
    "Design",
    "Marketing",
    "Sales",
    "HR",
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesResponse, shiftsResponse] = await Promise.all([
        axios.get<Employee[]>(`${Backend_Url}/api/employees`),
        axios.get<Shift[]>(`${Backend_Url}/api/shifts`), // Fetch shifts
      ]);

      // Sort shifts by startTime (most recent first) for display in modal
      const sortedShifts = shiftsResponse.data.sort((a, b) => {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      });

      setEmployees(employeesResponse.data.map((emp) => ({ ...emp })));
      setShifts(sortedShifts);
    } catch (error: any) {
      toast({
        title: "Error fetching data",
        description:
          error.response?.data?.message || "Failed to load employees or shifts.",
        variant: "destructive",
      });
      setEmployees([]);
      setShifts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up interval to update currentLiveTime every minute
    const interval = setInterval(() => {
      setCurrentLiveTime(new Date());
    }, 60 * 1000); // Update every minute

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  const isEmployeeActive = (employeeId: string): boolean => {
    const now = currentLiveTime.getTime();
    return shifts.some((shift) => {
      const shiftStartTime = new Date(shift.startTime).getTime();
      const shiftEndTime = shift.endTime ? new Date(shift.endTime).getTime() : Infinity; // Ongoing if no end time

      return (
        shift.employee === employeeId &&
        now >= shiftStartTime &&
        now < shiftEndTime
      );
    });
  };

  const getShiftDuration = (shift: Shift) => {
    if (typeof shift.totalHours === 'number' && shift.endTime) {
      return shift.totalHours;
    }
    if (shift.startTime && !shift.endTime) {
      const start = new Date(shift.startTime);
      const diffMs = currentLiveTime.getTime() - start.getTime();
      const hours = diffMs / (1000 * 60 * 60);
      return hours;
    }
    return 0;
  };

  const formatTime = (timeString: string | Date) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredEmployees = employees.filter((employee) => {
    const employeeUsername = employee.username || "";
    const employeeEmail = employee.email || "";
    const employeeDesignation = employee.designation || "";
    const employeeDepartment = employee.department || "";

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const matchesSearch =
      employeeUsername.toLowerCase().includes(lowerCaseSearchTerm) ||
      employeeEmail.toLowerCase().includes(lowerCaseSearchTerm) ||
      employeeDesignation.toLowerCase().includes(lowerCaseSearchTerm);

    const matchesDepartment =
      departmentFilter === "all" || employeeDepartment === departmentFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && isEmployeeActive(employee._id)) ||
      (statusFilter === "inactive" && !isEmployeeActive(employee._id));

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleCreateEmployee = async () => {
    setIsCreating(true);
    try {
      await axios.post<Employee>(`${Backend_Url}/api/employees`, newEmployee);

      fetchData(); // Re-fetch all data to update both employees and shifts

      setNewEmployee({
        username: "",
        email: "",
        password: "",
        designation: "",
        department: "",
      });
      setIsCreateModalOpen(false);

      toast({
        title: "Employee created successfully",
        description: `${newEmployee.username} has been added to the team.`,
      });
    } catch (error: any) {
      toast({
        title: "Error creating employee",
        description: error.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Function to open the delete confirmation modal
  const handleDeleteEmployee = (id: string, name: string) => {
    setEmployeeToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  // Function to perform the actual deletion after confirmation
  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await axios.delete(`${Backend_Url}/api/employees/${employeeToDelete.id}`);
      fetchData(); // Re-fetch all data to update both employees and shifts after deletion
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);

      toast({
        title: "Employee deleted",
        description: `${employeeToDelete.name} has been removed from the team.`,
      });
    } catch (error: any) {
      toast({
        title: "Error deleting employee",
        description:
          error.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleViewShifts = (employeeId: string, employeeName: string) => {
    const employeeShifts = shifts.filter(shift => shift.employee === employeeId);
    setSelectedEmployeeShifts(employeeShifts);
    setSelectedEmployeeName(employeeName);
    setIsViewShiftsModalOpen(true);
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
          <h2 className="text-3xl font-bold text-text">Employees</h2>
          <p className="text-text-secondary mt-1">Manage your team members</p>
        </div>

        {/* Create Employee Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover flex items-center gap-2">
              <Plus size={16} />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-surface">
            <DialogHeader>
              <DialogTitle>Create New Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newEmployee.username}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, username: e.target.value })
                  }
                  placeholder="Enter employee username"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newEmployee.password}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
              </div>
              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={newEmployee.designation}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      designation: e.target.value,
                    })
                  }
                  placeholder="Enter job designation"
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  onValueChange={(value) =>
                    setNewEmployee({ ...newEmployee, department: value })
                  }
                  value={newEmployee.department}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEmployee}
                  disabled={
                    isCreating ||
                    !newEmployee.username ||
                    !newEmployee.email ||
                    !newEmployee.password ||
                    !newEmployee.department
                  }
                  className="bg-primary hover:bg-primary-hover"
                >
                  {isCreating ? "Creating..." : "Create Employee"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-surface rounded-lg p-4 mb-6 border border-gray-200 animate-slide-up">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Input
              icon={<Search size={16} />}
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 text-text-secondary">
            <Filter size={16} />
            <span className="text-sm">
              {filteredEmployees.length} employees
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee, index) => (
          <div
            key={employee._id}
            className="bg-surface rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {(employee.username || "")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-text">
                    {employee.username}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {employee.designation}
                  </p>
                </div>
              </div>
              {isEmployeeActive(employee._id) && (
                <Badge className="bg-green-500 text-white px-3 py-1 text-xs font-medium">
                  Active Now
                </Badge>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-text-secondary">{employee.email}</p>
              <p className="text-sm text-text-secondary">
                {employee.department}
              </p>
              <p className="text-sm text-text-secondary">
                Joined: {new Date(employee.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap"> {/* Added flex-wrap for buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(`/adminDashboard/employees/${employee._id}`)
                }
                className="flex-1 flex items-center justify-center gap-2 min-w-[120px]"
              >
                <Eye size={14} />
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewShifts(employee._id, employee.username)}
                className="flex-1 flex items-center justify-center gap-2 min-w-[120px]"
              >
                <Clock size={14} />
                View Shifts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleDeleteEmployee(employee._id, employee.username)
                }
                className="text-error border-error hover:bg-error hover:text-white flex-shrink-0"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <Users size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text mb-2">
            No employees found
          </h3>
          <p className="text-text-secondary">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-surface sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-error">
              <AlertCircle size={20} /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="mt-2">
              Are you sure you want to delete **{employeeToDelete?.name}**? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Shifts Modal */}
      <Dialog open={isViewShiftsModalOpen} onOpenChange={setIsViewShiftsModalOpen}>
        <DialogContent className="bg-surface max-w-2xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Shifts for {selectedEmployeeName}</DialogTitle>
            <DialogDescription>
              Recent shifts for {selectedEmployeeName}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 p-2 -mx-2"> {/* Added p-2 -mx-2 for internal padding but still aligning with modal */}
            {selectedEmployeeShifts.length > 0 ? (
              selectedEmployeeShifts.map((shift) => (
                <div key={shift._id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Calendar size={16} />
                      <span>{formatDate(shift.startTime)}</span>
                    </div>
                    {!shift.endTime && (
                      <Badge className="bg-green-500 text-white text-xs">Active</Badge>
                    )}
                  </div>
                  <p className="text-lg font-semibold text-text mb-2">
                    {formatTime(shift.startTime)} - {shift.endTime ? formatTime(shift.endTime) : 'Ongoing'}
                  </p>
                  <p className="text-sm text-text-secondary">
                    Duration: {getShiftDuration(shift).toFixed(1)} hours
                  </p>
                  {shift.workSummary && (
                    <p className="text-xs text-text-secondary mt-2 line-clamp-2">
                      <span className="font-medium text-text">Summary:</span> {shift.workSummary}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <p>No shifts found for this employee.</p>
              </div>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button onClick={() => setIsViewShiftsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesPage;