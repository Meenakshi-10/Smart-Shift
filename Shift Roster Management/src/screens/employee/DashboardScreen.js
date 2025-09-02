import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Avatar,
  Chip,
  Divider,
} from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useShift } from '../../contexts/ShiftContext';
import { theme } from '../../theme/theme';

const EmployeeDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { shifts, loading } = useShift();
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'Leave request for Dec 25th approved',
      type: 'leave',
      timestamp: new Date(),
    },
    {
      id: 2,
      message: 'Shift swap with Jane Doe approved',
      type: 'swap',
      timestamp: new Date(),
    },
  ]);

  // Get upcoming shifts for the current user
  const upcomingShifts = shifts.filter(shift => 
    shift.employeeId === user?.id && 
    new Date(shift.date) > new Date()
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  const nextShift = upcomingShifts[0];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    return time; // Assuming time is already in HH:MM format
  };

  const handleMySchedule = () => {
    navigation.navigate('Schedule');
  };

  const handleRequestSwap = () => {
    navigation.navigate('Request', { type: 'swap' });
  };

  const handleRequestLeave = () => {
    navigation.navigate('Request', { type: 'leave' });
  };

  const handleOpenChat = () => {
    navigation.navigate('Chat');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          
          {/* User Profile */}
          <View style={styles.profileSection}>
            <Avatar.Text 
              size={60} 
              label={user?.name?.charAt(0) || 'E'} 
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'John Doe'}</Text>
              <Text style={styles.userRole}>{user?.role || 'Employee'}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={handleMySchedule}
            style={styles.actionButton}
            contentStyle={styles.buttonContent}
          >
            My Schedule
          </Button>
          
          <Button
            mode="contained"
            onPress={handleRequestSwap}
            style={styles.actionButton}
            contentStyle={styles.buttonContent}
          >
            Request Swap
          </Button>
          
          <Button
            mode="contained"
            onPress={handleRequestLeave}
            style={styles.actionButton}
            contentStyle={styles.buttonContent}
          >
            Request Leave
          </Button>
        </View>

        {/* Upcoming Shift */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Upcoming Shift</Text>
            
            {nextShift ? (
              <View style={styles.shiftInfo}>
                <View style={styles.shiftHeader}>
                  <Text style={styles.shiftDate}>
                    {formatDate(nextShift.date)}
                  </Text>
                  <Chip 
                    mode="outlined" 
                    style={styles.shiftType}
                    textStyle={styles.chipText}
                  >
                    {nextShift.shiftType || 'Regular'}
                  </Chip>
                </View>
                
                <Text style={styles.shiftTime}>
                  {formatTime(nextShift.startTime)} - {formatTime(nextShift.endTime)}
                </Text>
                <Text style={styles.shiftLocation}>
                  {nextShift.location || 'Front Desk'}
                </Text>
              </View>
            ) : (
              <View style={styles.noShiftPlaceholder}>
                <Text style={styles.placeholderText}>No upcoming shifts</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Notifications */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Notifications</Text>
            
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <View key={notification.id}>
                  <View style={styles.notificationItem}>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationText}>
                        {notification.message}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {notification.timestamp.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                    <Chip 
                      mode="outlined" 
                      style={[
                        styles.notificationType,
                        { 
                          backgroundColor: notification.type === 'leave' 
                            ? theme.colors.success + '20' 
                            : theme.colors.info + '20' 
                        }
                      ]}
                      textStyle={[
                        styles.chipText,
                        { 
                          color: notification.type === 'leave' 
                            ? theme.colors.success 
                            : theme.colors.info 
                        }
                      ]}
                    >
                      {notification.type}
                    </Chip>
                  </View>
                  {index < notifications.length - 1 && (
                    <Divider style={styles.divider} />
                  )}
                </View>
              ))
            ) : (
              <View style={styles.noNotificationsPlaceholder}>
                <Text style={styles.placeholderText}>No notifications</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Chat Button */}
        <Button
          mode="contained"
          onPress={handleOpenChat}
          style={styles.chatButton}
          contentStyle={styles.buttonContent}
        >
          Open Chat
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  profileInfo: {
    marginLeft: theme.spacing.md,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  userRole: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  actionButtons: {
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  actionButton: {
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  card: {
    marginBottom: theme.spacing.md,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  shiftInfo: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  shiftDate: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  shiftType: {
    height: 24,
  },
  chipText: {
    fontSize: 12,
  },
  shiftTime: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  shiftLocation: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  noShiftPlaceholder: {
    height: 80,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  notificationContent: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  notificationText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  notificationTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  notificationType: {
    height: 24,
  },
  divider: {
    marginVertical: theme.spacing.sm,
  },
  noNotificationsPlaceholder: {
    height: 60,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  chatButton: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
});

export default EmployeeDashboardScreen; 