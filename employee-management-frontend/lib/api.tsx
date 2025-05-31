import axios from '@/lib/axios';
import { Backend_Url } from '@/config'; 
import { Task, Shift, Employee } from '@/lib/types'; 

export const dashboardAPI = {
  getCurrentEmployee: async (): Promise<Employee> => {
    const response = await axios.get<Employee>(`${Backend_Url}/api/employees/my`);
    return response.data;
  },

  getTasks: async (): Promise<Task[]> => {
    const response = await axios.get<Task[]>(`${Backend_Url}/api/tasks/my`); 
    return response.data;
  },

  getTaskById: async (taskId: string): Promise<Task> => {
    const response = await axios.get<Task>(`${Backend_Url}/api/tasks/${taskId}`);
    return response.data;
  },
  updateTaskStatus: async (taskId: string, status: Task['status']): Promise<Task> => {
    const response = await axios.put<Task>(`${Backend_Url}/api/tasks/update/${taskId}`, { status });
    return response.data;
  },  
  startShift: async (): Promise<Shift> => {
    const response = await axios.post<Shift>(`${Backend_Url}/api/shifts/start`);
    return response.data;
  },

  endShift: async (shiftId: string, workSummary: string): Promise<Shift> => {
    const response = await axios.put<Shift>(`${Backend_Url}/api/shifts/end/${shiftId}`, { workSummary });
    return response.data;
  },
  getShifts: async (): Promise<Shift[]> => {
    const response = await axios.get<Shift[]>(`${Backend_Url}/api/shifts`); // Assuming this fetches shifts for the logged-in employee
    return response.data;
  },
};