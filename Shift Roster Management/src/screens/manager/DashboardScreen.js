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
  FAB,
  Avatar,
  IconButton,
  Modal,
  Portal,
  TextInput,
} from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useShift } from '../../contexts/ShiftContext';
import { theme } from '../../theme/theme';

const ManagerDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { 
    shifts, 
    pendingRequests, 
    employees, 
    broadcastMessage,
    loading 
  } = useShift();
  
  const [broadcastModalVisible, setBroadcastModalVisible] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');

  const currentShifts = shifts.filter(shift => 
    new Date(shift.date).toDateString() === new Date().toDateString()
  );

  const onDutyCount = currentShifts.filter(shift => shift.status === 'on_duty').length;
  const totalStaff = employees.length;

  const handleBroadcastMessage = async () => {
    if (!broadcastText.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    const result = await broadcastMessage(broadcastText);
    if (result.success) {
      setBroadcastModalVisible(false);
      setBroadcastText('');
      Alert.alert('Success', 'Message broadcasted successfully');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on_duty':
        return theme.colors.success;
      case 'late':
        return theme.colors.warning;
      case 'absent':
        return theme.colors.error;
      case 'scheduled':
        return theme.colors.info;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'on_duty':
        return 'On Time';
      case 'late':
        return 'Late';
      case 'absent':
        return 'Absent';
      case 'scheduled':
        return 'Scheduled';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>{user?.company?.name || 'Your Company Name'}</Text>
        </View>

        {/* Roster Overview */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Roster Overview</Text>
            <Text style={styles.rosterText}>
              {onDutyCount} out of {totalStaff} staff on shift
            </Text>
            <Text style={styles.rosterSubtext}>Today's Schedule</Text>
            
            <View style={styles.rosterPlaceholder}>
              <Text style={styles.placeholderText}>Current roster display</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('AIShiftCreation')}
            style={styles.actionButton}
            contentStyle={styles.buttonContent}
          >
            Create Roster
          </Button>
          
          <Button
            mode="contained"
            onPress={() => navigation.navigate('EmployeeManagement')}
            style={styles.actionButton}
            contentStyle={styles.buttonContent}
          >
            Add New Employee
          </Button>
          
          <Button
            mode="contained"
            onPress={() => setBroadcastModalVisible(true)}
            style={styles.actionButton}
            contentStyle={styles.buttonContent}
          >
            Broadcast Message
          </Button>
        </View>

        {/* Pending Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Pending Actions</Text>
            
            {pendingRequests.length > 0 ? (
              <View>
                <Text style={styles.pendingText}>
                  Pending Shift Swaps: {pendingRequests.filter(r => r.type === 'swap').length} requests
                </Text>
                <Text style={styles.pendingText}>
                  Pending Leaves: {pendingRequests.filter(r => r.type === 'leave').length} requests
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Requests')}
                  style={styles.viewRequestsButton}
                >
                  View Requests
                </Button>
              </View>
            ) : (
              <View style={styles.noPendingPlaceholder}>
                <Text style={styles.placeholderText}>No pending actions</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Real-time Status */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Real-time Status</Text>
            
            {currentShifts.length > 0 ? (
              currentShifts.map((shift, index) => (
                <View key={index} style={styles.statusRow}>
                  <View style={styles.employeeInfo}>
                    <Avatar.Text 
                      size={32} 
                      label={shift.employee?.name?.charAt(0) || 'E'} 
                    />
                    <View style={styles.employeeDetails}>
                      <Text style={styles.employeeName}>
                        {shift.employee?.name || 'Unknown Employee'}
                      </Text>
                      <Text style={styles.shiftTime}>
                        {shift.startTime} - {shift.endTime}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.statusIndicator}>
                    <View 
                      style={[
                        styles.statusDot, 
                        { backgroundColor: getStatusColor(shift.status) }
                      ]} 
                    />
                    <Text style={styles.statusText}>
                      {getStatusText(shift.status)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noShiftsPlaceholder}>
                <Text style={styles.placeholderText}>No shifts scheduled today</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AIShiftCreation')}
      />

      {/* Broadcast Message Modal */}
      <Portal>
        <Modal
          visible={broadcastModalVisible}
          onDismiss={() => setBroadcastModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Broadcast Message</Text>
          <TextInput
            label="Message"
            value={broadcastText}
            onChangeText={setBroadcastText}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.modalInput}
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setBroadcastModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleBroadcastMessage}
              loading={loading}
              style={styles.modalButton}
            >
              Send
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  card: {
    margin: theme.spacing.md,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  rosterText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  rosterSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  rosterPlaceholder: {
    height: 100,
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
  actionButtons: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  actionButton: {
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  pendingText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  viewRequestsButton: {
    marginTop: theme.spacing.md,
  },
  noPendingPlaceholder: {
    height: 60,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  employeeDetails: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  shiftTime: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  noShiftsPlaceholder: {
    height: 60,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  modalInput: {
    marginBottom: theme.spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  modalButton: {
    minWidth: 80,
  },
});

export default ManagerDashboardScreen; 