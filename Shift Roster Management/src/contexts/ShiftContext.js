import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const ShiftContext = createContext({});

export const useShift = () => {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error('useShift must be used within a ShiftProvider');
  }
  return context;
};

export const ShiftProvider = ({ children }) => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [currentRoster, setCurrentRoster] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadShifts();
      loadEmployees();
      loadPendingRequests();
    }
  }, [user]);

  const loadShifts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/shifts');
      setShifts(response.data);
    } catch (error) {
      console.error('Error loading shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const response = await api.get('/requests/pending');
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  };

  const createShift = async (shiftData) => {
    try {
      setLoading(true);
      const response = await api.post('/shifts', shiftData);
      setShifts(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating shift:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create shift' 
      };
    } finally {
      setLoading(false);
    }
  };

  const generateAIShift = async (params) => {
    try {
      setLoading(true);
      const response = await api.post('/shifts/ai-generate', params);
      setCurrentRoster(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error generating AI shift:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to generate shift' 
      };
    } finally {
      setLoading(false);
    }
  };

  const approveRoster = async (rosterId) => {
    try {
      setLoading(true);
      const response = await api.post(`/rosters/${rosterId}/approve`);
      setCurrentRoster(null);
      await loadShifts();
      return { success: true };
    } catch (error) {
      console.error('Error approving roster:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to approve roster' 
      };
    } finally {
      setLoading(false);
    }
  };

  const requestShiftSwap = async (requestData) => {
    try {
      setLoading(true);
      const response = await api.post('/requests/swap', requestData);
      await loadPendingRequests();
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error requesting shift swap:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to request swap' 
      };
    } finally {
      setLoading(false);
    }
  };

  const requestLeave = async (leaveData) => {
    try {
      setLoading(true);
      const response = await api.post('/requests/leave', leaveData);
      await loadPendingRequests();
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error requesting leave:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to request leave' 
      };
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (requestId, type) => {
    try {
      setLoading(true);
      await api.post(`/requests/${requestId}/approve`, { type });
      await loadPendingRequests();
      await loadShifts();
      return { success: true };
    } catch (error) {
      console.error('Error approving request:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to approve request' 
      };
    } finally {
      setLoading(false);
    }
  };

  const denyRequest = async (requestId, type) => {
    try {
      setLoading(true);
      await api.post(`/requests/${requestId}/deny`, { type });
      await loadPendingRequests();
      return { success: true };
    } catch (error) {
      console.error('Error denying request:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to deny request' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateShiftStatus = async (shiftId, status) => {
    try {
      setLoading(true);
      const response = await api.put(`/shifts/${shiftId}/status`, { status });
      setShifts(prev => 
        prev.map(shift => 
          shift.id === shiftId ? { ...shift, status } : shift
        )
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating shift status:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update status' 
      };
    } finally {
      setLoading(false);
    }
  };

  const broadcastMessage = async (message) => {
    try {
      setLoading(true);
      const response = await api.post('/messages/broadcast', { message });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error broadcasting message:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to broadcast message' 
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    shifts,
    currentRoster,
    pendingRequests,
    employees,
    loading,
    createShift,
    generateAIShift,
    approveRoster,
    requestShiftSwap,
    requestLeave,
    approveRequest,
    denyRequest,
    updateShiftStatus,
    broadcastMessage,
    loadShifts,
    loadEmployees,
    loadPendingRequests,
  };

  return (
    <ShiftContext.Provider value={value}>
      {children}
    </ShiftContext.Provider>
  );
}; 