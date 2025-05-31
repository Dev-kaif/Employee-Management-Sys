'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Filter, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Input from '@/components/ui/input';
import { useToast } from '@/components/hooks/use-toast';
import axios from '@/lib/axios';
import { Backend_Url } from '@/config';

interface Employee {
  _id: string;
  username: string;
  designation?: string;
  department?: string;
}

interface Shift {
  _id: string;
  employee: Employee; 
  startTime: string;
  endTime?: string; 
  workSummary?: string;
  totalHours?: number; 
  createdAt: string;
  updatedAt: string;
}

const ShiftsPage = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const { toast } = useToast();

  useEffect(() => {
    const fetchShiftsAndEmployees = async () => {
      try {
        setLoading(true);
        const [shiftsResponse, employeesResponse] = await Promise.all([
          axios.get<Shift[]>(`${Backend_Url}/api/shifts`),
          axios.get<Employee[]>(`${Backend_Url}/api/employees`) 
        ]);
        setShifts(shiftsResponse.data);
        setEmployees(employeesResponse.data);
      } catch (error: any) {
        toast({
          title: 'Error fetching data',
          description: error.response?.data?.message || 'Failed to load shifts or employees.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShiftsAndEmployees();
  }, [toast]);

  const filteredShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.startTime).toISOString().split('T')[0];
    const matchesDate = !dateFilter || shiftDate === dateFilter;
    const matchesEmployee = employeeFilter === 'all' || shift.employee?._id === employeeFilter;
    const matchesDepartment = departmentFilter === 'all' || shift.employee?.department === departmentFilter;
    
    return matchesDate && matchesEmployee && matchesDepartment;
  });

  const groupedShifts = filteredShifts.reduce((acc, shift) => {
    const date = new Date(shift.startTime).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(shift);
    return acc;
  }, {} as Record<string, Shift[]>);

  const getShiftStatus = (shift: Shift) => {
    if (shift.endTime) {
      return 'completed';
    }
    return 'in-progress';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-white';
      case 'in-progress': return 'bg-warning text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getShiftDuration = (shift: Shift) => {
    if (typeof shift.totalHours === 'number') {
      return shift.totalHours;
    }
    if (shift.startTime && !shift.endTime) {
      const start = new Date(shift.startTime);
      const now = new Date();
      const diffMs = now.getTime() - start.getTime();
      return Math.round(diffMs / (1000 * 60 * 60) * 10) / 10; // Calculate approximate ongoing hours
    }
    return 0;
  };

  const calculateTotalHoursForDay = (dayShifts: Shift[]) => {
    return dayShifts.reduce((total, shift) => {
      return total + (typeof shift.totalHours === 'number' ? shift.totalHours : 0);
    }, 0);
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

  const uniqueDepartments = Array.from(new Set(employees.map(emp => emp.department).filter(Boolean))) as string[];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-text">Shifts</h2>
          <p className="text-text-secondary mt-1">Employee schedule and attendance tracking</p>
        </div>
      </div>

      <div className="bg-surface rounded-lg p-4 mb-6 border border-gray-200 animate-slide-up">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
            />
          </div>
          
          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Employees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees.map(emp => (
                <SelectItem key={emp._id} value={emp._id}>{emp.username}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {uniqueDepartments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 text-text-secondary">
            <Filter size={16} />
            <span className="text-sm">{filteredShifts.length} shifts</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedShifts)
          .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
          .map(([date, dayShifts], dateIndex) => (
          <div 
            key={date}
            className="bg-surface rounded-lg border border-gray-200 animate-slide-up"
            style={{ animationDelay: `${dateIndex * 0.1}s` }}
          >
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-text">{formatDate(date)}</h3>
                    <p className="text-text-secondary text-sm">{dayShifts.length} shifts logged</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-secondary">Total Hours</p>
                  <p className="text-lg font-semibold text-text">{calculateTotalHoursForDay(dayShifts).toFixed(1)}h</p> {/* Updated */}
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                {dayShifts.map((shift, shiftIndex) => (
                  <div 
                    key={shift._id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow animate-fade-in"
                    style={{ animationDelay: `${(dateIndex * 0.1) + (shiftIndex * 0.05)}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {shift.employee?.username ? shift.employee.username.split(' ').map(n => n[0]).join('') : 'N/A'}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-text">{shift.employee?.username || 'Unknown Employee'}</h4>
                        <p className="text-sm text-text-secondary">{shift.employee?.designation || 'N/A'} • {shift.employee?.department || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-2 text-text-secondary text-sm">
                          <Clock size={14} />
                          <span>{formatTime(shift.startTime)} - {shift.endTime ? formatTime(shift.endTime) : 'Ongoing'}</span>
                        </div>
                        {typeof shift.totalHours === 'number' && ( // Updated: Check for stored totalHours
                          <p className="text-text font-medium text-sm mt-1">
                            {shift.totalHours.toFixed(1)}h worked
                          </p>
                        )}
                        {!shift.endTime && shift.startTime && ( // Display approximate for ongoing shifts
                          <p className="text-text font-medium text-sm mt-1 text-text-secondary">
                            Ongoing ({getShiftDuration(shift).toFixed(1)}h so far)
                          </p>
                        )}
                      </div>

                      <Badge className={getStatusColor(getShiftStatus(shift))}>
                        {getShiftStatus(shift)}
                      </Badge>

                      {shift.workSummary && (
                        <div className="max-w-32">
                          <p className="text-xs text-text-secondary truncate" title={shift.workSummary}>
                            {shift.workSummary}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(groupedShifts).length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <Calendar size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text mb-2">No shifts found</h3>
          <p className="text-text-secondary">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default ShiftsPage;