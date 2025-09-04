import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, FAB, Paragraph, Text, Title } from 'react-native-paper';
import { useAppContext } from '../../contexts/AppContext';

export default function ManagerDashboard() {
  const { shifts, employees, currentEmployee } = useAppContext();
  const router = useRouter();

  const currentWeekShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
    return shiftDate >= weekStart && shiftDate <= weekEnd;
  });

  const staffOnShift = currentWeekShifts.length;
  const totalStaff = employees.length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Dashboard</Title>
        <Paragraph style={styles.subtitle}>
          Welcome back, {currentEmployee?.name || 'Manager'}
        </Paragraph>
      </View>

      <Card style={styles.overviewCard}>
        <Card.Content>
          <Title>Current Week</Title>
          <Paragraph style={styles.staffCount}>
            {staffOnShift} out of {totalStaff} staff on shift
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={() => router.push('/roster')}
          style={styles.actionButton}
          icon="calendar-plus"
        >
          Create Roster
        </Button>
        <Button
          mode="contained"
          onPress={() => {}}
          style={styles.actionButton}
          icon="account-plus"
        >
          Add New Employee
        </Button>
        <Button
          mode="contained"
          onPress={() => {}}
          style={styles.actionButton}
          icon="broadcast"
        >
          Broadcast Message
        </Button>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Today's Schedule</Title>
          {currentWeekShifts.length > 0 ? (
            currentWeekShifts.map((shift) => (
              <View key={shift.shift_id} style={styles.shiftItem}>
                <Text style={styles.shiftTime}>
                  {shift.start_time} - {shift.end_time}
                </Text>
                <Text style={styles.shiftEmployee}>
                  {employees.find(emp => emp.employee_id === shift.assigned_employee)?.name}
                </Text>
                <Text style={styles.shiftType}>{shift.shift_type}</Text>
              </View>
            ))
          ) : (
            <Paragraph>No shifts scheduled for today</Paragraph>
          )}
        </Card.Content>
      </Card>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/roster')}
      />
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
  staffCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    marginVertical: 8,
    paddingVertical: 8,
  },
  card: {
    margin: 20,
    marginTop: 0,
  },
  shiftItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  shiftTime: {
    flex: 1,
    fontWeight: 'bold',
  },
  shiftEmployee: {
    flex: 1,
    textAlign: 'center',
  },
  shiftType: {
    flex: 1,
    textAlign: 'right',
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});
