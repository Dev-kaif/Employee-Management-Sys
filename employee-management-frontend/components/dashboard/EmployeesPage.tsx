'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Trash2, Eye, Filter, Users } from 'lucide-react';
import axios from '@/lib/axios';
import Button  from '@/components/ui/button';
import  Input  from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/hooks/use-toast';
import { Backend_Url } from '@/config';

interface Employee {
  _id: string;
  username: string;
  email: string;
  designation?: string;
  department?: string;
  company: string;
  role: 'admin' | 'employee';
  createdAt: string;
  updatedAt: string;
  // status?: 'active' | 'inactive';
  avatar?: string;
}

const EmployeesPage = () => {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    username: '',
    email: '',
    password: '',
    designation: '',
    department: '',
  });

  const { toast } = useToast();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Employee[]>(`${Backend_Url}/api/employees`);
      // For status, you might need a custom logic or add it to your backend schema
      setEmployees(response.data.map(emp => ({ ...emp, status: 'active' }))); // Default to active for now
    } catch (error: any) {
      toast({
        title: 'Error fetching employees',
        description: error.response?.data?.message || 'Failed to load employee data.',
        variant: 'destructive',
      });
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.username.includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (employee.designation && employee.designation.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    // const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    
    // return matchesSearch && matchesDepartment && matchesStatus;
    return matchesSearch && matchesDepartment;
  });

  const handleCreateEmployee = async () => {
    try {
      const response = await axios.post<Employee>(`${Backend_Url}/api/employees`, newEmployee);
      setEmployees(prev => [{ ...response.data, status: 'active' }, ...prev]); // Default status on creation
      setNewEmployee({ username: '', email: '', password: '', designation: '', department: '' });
      setIsCreateModalOpen(false);
      
      toast({
        title: 'Employee created successfully',
        description: `${response.data.username} has been added to the team.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error creating employee',
        description: error.response?.data?.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await axios.delete(`${Backend_Url}/api/employees/${id}`);
      setEmployees(employees.filter(emp => emp._id !== id));
      
      toast({
        title: 'Employee deleted',
        description: `${name} has been removed from the team.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error deleting employee',
        description: error.response?.data?.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR'];

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
                  onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
                  placeholder="Enter employee username"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={newEmployee.designation}
                  onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})}
                  placeholder="Enter job designation"
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateEmployee}
                  disabled={!newEmployee.username || !newEmployee.email || !newEmployee.password}
                  className="bg-primary hover:bg-primary-hover"
                >
                  Create Employee
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-surface rounded-lg p-4 mb-6 border border-gray-200 animate-slide-up">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
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
            <span className="text-sm">{filteredEmployees.length} employees</span>
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
                    {employee.username.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-text">{employee.username}</h3>
                  <p className="text-sm text-text-secondary">{employee.designation}</p>
                </div>
              </div>
              {/* later make active inactive based on shift */}
              {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                employee.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {employee.status}
              </span> */}
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-text-secondary">{employee.email}</p>
              <p className="text-sm text-text-secondary">{employee.department}</p>
              <p className="text-sm text-text-secondary">Joined: {new Date(employee.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/employees/${employee._id}`)}
                className="flex-1 flex items-center gap-2"
              >
                <Eye size={14} />
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteEmployee(employee._id, employee.username)}
                className="text-error border-error hover:bg-error hover:text-white"
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
          <h3 className="text-lg font-medium text-text mb-2">No employees found</h3>
          <p className="text-text-secondary">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;