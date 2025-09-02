import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import ManagerNavigator from './ManagerNavigator';
import EmployeeNavigator from './EmployeeNavigator';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'manager';

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {isManager ? (
        <Tab.Screen name="Manager" component={ManagerNavigator} />
      ) : (
        <Tab.Screen name="Employee" component={EmployeeNavigator} />
      )}
    </Tab.Navigator>
  );
};

export default MainNavigator; 