import axios from 'axios';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Token will be added by AuthContext when available
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    profile: '/auth/profile',
    refresh: '/auth/refresh',
  },
  
  // Shifts
  shifts: {
    list: '/shifts',
    create: '/shifts',
    update: (id) => `/shifts/${id}`,
    delete: (id) => `/shifts/${id}`,
    status: (id) => `/shifts/${id}/status`,
    aiGenerate: '/shifts/ai-generate',
  },
  
  // Rosters
  rosters: {
    list: '/rosters',
    create: '/rosters',
    approve: (id) => `/rosters/${id}/approve`,
    reject: (id) => `/rosters/${id}/reject`,
  },
  
  // Requests
  requests: {
    pending: '/requests/pending',
    swap: '/requests/swap',
    leave: '/requests/leave',
    approve: (id) => `/requests/${id}/approve`,
    deny: (id) => `/requests/${id}/deny`,
  },
  
  // Employees
  employees: {
    list: '/employees',
    create: '/employees',
    update: (id) => `/employees/${id}`,
    delete: (id) => `/employees/${id}`,
  },
  
  // Messages
  messages: {
    broadcast: '/messages/broadcast',
    list: '/messages',
    send: '/messages/send',
  },
  
  // Analytics
  analytics: {
    dashboard: '/analytics/dashboard',
    reports: '/analytics/reports',
  },
}; 