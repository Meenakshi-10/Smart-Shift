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
  FAB,
} from 'react-native-paper';
import { useShift } from '../../contexts/ShiftContext';
import { theme } from '../../theme/theme';

const RosterManagementScreen = ({ navigation }) => {
  const { shifts, employees, loading } = useShift();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    return time;
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

  const todayShifts = shifts.filter(shift => 
    new Date(shift.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Real-Time Roster Management</Text>
        </View>

        {/* Employee Status List */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Employee Status</Text>
            
            {todayShifts.length > 0 ? (
              todayShifts.map((shift, index) => (
                <View key={index} style={styles.employeeRow}>
                  <View style={styles.employeeInfo}>
                    <Avatar.Text 
                      size={40} 
                      label={shift.employee?.name?.charAt(0) || 'E'} 
                    />
                    <View style={styles.employeeDetails}>
                      <Text style={styles.employeeName}>
                        {shift.employee?.name || 'Unknown Employee'}
                      </Text>
                      <Text style={styles.shiftTime}>
                        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
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
                <Text style={styles.placeholderText}>No shifts scheduled for today</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('AIShiftCreation')}
            style={styles.actionButton}
            contentStyle={styles.buttonContent}
          >
            Edit Shift
          </Button>
          
          <Button
            mode="contained"
            onPress={() => Alert.alert('Assign Employee', 'Feature coming soon')}
            style={styles.actionButton}
            contentStyle={styles.buttonContent}
          >
            Assign Employee
          </Button>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AIShiftCreation')}
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
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
  employeeRow: {
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
    height: 80,
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
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  actionButton: {
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default RosterManagementScreen; 