import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/theme';

// Screens
import ManagerDashboardScreen from '../screens/manager/DashboardScreen';
import RosterManagementScreen from '../screens/manager/RosterManagementScreen';
import AIShiftCreationScreen from '../screens/manager/AIShiftCreationScreen';
import RequestsScreen from '../screens/manager/RequestsScreen';
import AnalyticsScreen from '../screens/manager/AnalyticsScreen';
import EmployeeManagementScreen from '../screens/manager/EmployeeManagementScreen';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ManagerStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ManagerDashboard" component={ManagerDashboardScreen} />
      <Stack.Screen name="RosterManagement" component={RosterManagementScreen} />
      <Stack.Screen name="AIShiftCreation" component={AIShiftCreationScreen} />
      <Stack.Screen name="EmployeeManagement" component={EmployeeManagementScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

const ManagerNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Roster':
              iconName = 'calendar-today';
              break;
            case 'Requests':
              iconName = 'swap-horiz';
              break;
            case 'Analytics':
              iconName = 'analytics';
              break;
            default:
              iconName = 'dashboard';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={ManagerStack} />
      <Tab.Screen name="Roster" component={RosterManagementScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
};

export default ManagerNavigator; 