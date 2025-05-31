export interface Employee {
  _id: string;
  username: string;
  designation?: string;
  department?: string;
  email: string;
  role: "employee";
  company: string;
  createdAt: string;
  updatedAt: string;
}


export interface Shift {
  _id: string;
  employee: Employee; 
  startTime: string;
  endTime?: string;
  workSummary?: string;
  totalHours?: number; 
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string; 
  title: string;
  description?: string;
  assignedTo: Employee;
  assignedBy: Employee;  
  dueDate: string;
  scheduledFor?: string;
  isScheduled: boolean;
  status: "pending" | "assigned" | "in-progress" | "completed";
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
