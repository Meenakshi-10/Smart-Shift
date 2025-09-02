import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
} from 'react-native-paper';
import { useShift } from '../../contexts/ShiftContext';
import { theme } from '../../theme/theme';

const ScheduleScreen = ({ navigation }) => {
  const { shifts } = useShift();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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

  // Filter shifts for the current user
  const userShifts = shifts.filter(shift => 
    shift.employeeId === 'current-user-id' // This would be the actual user ID
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Schedule</Text>

        {userShifts.length > 0 ? (
          userShifts.map((shift, index) => (
            <Card key={index} style={styles.shiftCard}>
              <Card.Content>
                <View style={styles.shiftHeader}>
                  <Text style={styles.shiftDate}>{formatDate(shift.date)}</Text>
                  <Chip 
                    mode="outlined" 
                    style={styles.shiftType}
                    textStyle={styles.chipText}
                  >
                    {shift.shiftType || 'Regular'}
                  </Chip>
                </View>
                
                <Text style={styles.shiftTime}>
                  {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                </Text>
                
                {shift.location && (
                  <Text style={styles.shiftLocation}>Location: {shift.location}</Text>
                )}
                
                <View style={styles.statusContainer}>
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
                
                {shift.notes && (
                  <Text style={styles.shiftNotes}>Notes: {shift.notes}</Text>
                )}
              </Card.Content>
            </Card>
          ))
        ) : (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.noShiftsText}>No shifts scheduled</Text>
            </Card.Content>
          </Card>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  shiftCard: {
    marginBottom: theme.spacing.md,
    elevation: 2,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  shiftDate: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  shiftType: {
    height: 24,
  },
  chipText: {
    fontSize: 12,
  },
  shiftTime: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  shiftLocation: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
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
  shiftNotes: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  card: {
    marginTop: theme.spacing.lg,
  },
  noShiftsText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ScheduleScreen; 