import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { Employee, Request, Shift, apiService } from '../services/api';

interface AppContextType {
  userRole: 'manager' | 'employee';
  currentEmployee: Employee | null;
  employees: Employee[];
  shifts: Shift[];
  requests: Request[];
  loading: boolean;
  setUserRole: (role: 'manager' | 'employee') => void;
  setCurrentEmployee: (employee: Employee | null) => void;
  refreshData: () => Promise<void>;
  createShift: (shift: Omit<Shift, 'shift_id'>) => Promise<void>;
  createRequest: (request: Omit<Request, 'request_id'>) => Promise<void>;
  updateRequestStatus: (id: string, status: 'approved' | 'denied') => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<'manager' | 'employee'>('manager');
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [employeesData, shiftsData, requestsData] = await Promise.all([
        apiService.getEmployees(),
        apiService.getShifts(),
        apiService.getRequests(),
      ]);
      
      setEmployees(employeesData.data);
      setShifts(shiftsData.data);
      setRequests(requestsData.data);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createShift = async (shift: Omit<Shift, 'shift_id'>) => {
    try {
      await apiService.createShift(shift);
      await refreshData();
    } catch (error) {
      console.error('Error creating shift:', error);
      throw error;
    }
  };

  const createRequest = async (request: Omit<Request, 'request_id'>) => {
    try {
      await apiService.createRequest(request);
      await refreshData();
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  };

  const updateRequestStatus = async (id: string, status: 'approved' | 'denied') => {
    try {
      await apiService.updateRequestStatus(id, status);
      await refreshData();
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const value: AppContextType = {
    userRole,
    currentEmployee,
    employees,
    shifts,
    requests,
    loading,
    setUserRole,
    setCurrentEmployee,
    refreshData,
    createShift,
    createRequest,
    updateRequestStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
