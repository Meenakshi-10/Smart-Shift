import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Chip, Paragraph, Text, Title } from 'react-native-paper';
import { useAppContext } from '../../contexts/AppContext';

export default function ScheduleScreen() {
  const { shifts, currentEmployee } = useAppContext();

  const employeeShifts = shifts.filter(shift => 
    shift.assigned_employee === currentEmployee?.employee_id
  );

  const upcomingShifts = employeeShifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    const today = new Date();
    return shiftDate >= today;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastShifts = employeeShifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    const today = new Date();
    return shiftDate < today;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      case 'assigned': return '#2196F3';
      default: return '#666';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>My Schedule</Title>
        <Paragraph style={styles.subtitle}>
          {currentEmployee?.name} - {currentEmployee?.role}
        </Paragraph>
      </View>

      <Card style={styles.overviewCard}>
        <Card.Content>
          <Title>Schedule Overview</Title>
          <View style={styles.overviewStats}>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewNumber}>{upcomingShifts.length}</Text>
              <Text style={styles.overviewLabel}>Upcoming</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewNumber}>{pastShifts.length}</Text>
              <Text style={styles.overviewLabel}>Completed</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewNumber}>{employeeShifts.length}</Text>
              <Text style={styles.overviewLabel}>Total</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {upcomingShifts.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Upcoming Shifts</Title>
            {upcomingShifts.map((shift) => (
              <View key={shift.shift_id} style={styles.shiftItem}>
                <View style={styles.shiftHeader}>
                  <Text style={styles.shiftDate}>{formatDate(shift.date)}</Text>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getStatusColor(shift.status) }}
                    style={{ borderColor: getStatusColor(shift.status) }}
                  >
                    {shift.status}
                  </Chip>
                </View>
                <View style={styles.shiftDetails}>
                  <Text style={styles.shiftTime}>
                    {shift.start_time} - {shift.end_time}
                  </Text>
                  <Text style={styles.shiftType}>{shift.shift_type}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {pastShifts.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Recent Shifts</Title>
            {pastShifts.slice(0, 5).map((shift) => (
              <View key={shift.shift_id} style={styles.shiftItem}>
                <View style={styles.shiftHeader}>
                  <Text style={styles.shiftDate}>{formatDate(shift.date)}</Text>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getStatusColor(shift.status) }}
                    style={{ borderColor: getStatusColor(shift.status) }}
                  >
                    {shift.status}
                  </Chip>
                </View>
                <View style={styles.shiftDetails}>
                  <Text style={styles.shiftTime}>
                    {shift.start_time} - {shift.end_time}
                  </Text>
                  <Text style={styles.shiftType}>{shift.shift_type}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {employeeShifts.length === 0 && (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Title>No Shifts Assigned</Title>
            <Paragraph>You don't have any shifts assigned yet. Check back later!</Paragraph>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  overviewCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#E3F2FD',
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  card: {
    margin: 20,
    marginTop: 0,
  },
  shiftItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shiftDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  shiftDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shiftTime: {
    fontSize: 14,
    color: '#666',
  },
  shiftType: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  emptyCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#F5F5F5',
  },
});
