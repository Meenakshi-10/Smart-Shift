import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Employee {
  employee_id: string;
  name: string;
  role: string;
  skills: string[];
  department: string;
  shift_preference: string;
}

export interface Shift {
  shift_id: string;
  date: string;
  start_time: string;
  end_time: string;
  shift_type: string;
  assigned_employee: string;
  status: string;
}

export interface Request {
  request_id: string;
  employee_id: string;
  request_type: 'leave' | 'swap';
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  swap_partner?: string;
}

export const apiService = {
  // Employee endpoints
  getEmployees: () => api.get<Employee[]>('/employees'),
  getEmployee: (id: string) => api.get<Employee>(`/employees/${id}`),

  // Shift endpoints
  getShifts: (params?: { date?: string; employee_id?: string }) => 
    api.get<Shift[]>('/shifts', { params }),
  createShift: (shift: Omit<Shift, 'shift_id'>) => 
    api.post<Shift>('/shifts', shift),
  getShift: (id: string) => api.get<Shift>(`/shifts/${id}`),

  // Request endpoints
  getRequests: (params?: { status?: string; employee_id?: string }) => 
    api.get<Request[]>('/requests', { params }),
  createRequest: (request: Omit<Request, 'request_id'>) => 
    api.post<Request>('/requests', request),
  updateRequestStatus: (id: string, status: 'approved' | 'denied') => 
    api.put<Request>(`/requests/${id}/status`, { status }),
  getRequest: (id: string) => api.get<Request>(`/requests/${id}`),
};

export default apiService;
