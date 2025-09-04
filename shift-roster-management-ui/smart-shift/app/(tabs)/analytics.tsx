import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Paragraph, Text, Title } from 'react-native-paper';
import { useAppContext } from '../../contexts/AppContext';

export default function AnalyticsScreen() {
  const { shifts, employees, requests } = useAppContext();

  const totalShifts = shifts.length;
  const totalEmployees = employees.length;
  const pendingRequests = requests.filter(req => req.status === 'pending').length;
  const approvedRequests = requests.filter(req => req.status === 'approved').length;

  const shiftTypes = shifts.reduce((acc, shift) => {
    acc[shift.shift_type] = (acc[shift.shift_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Analytics</Title>
        <Paragraph style={styles.subtitle}>Performance Overview</Paragraph>
      </View>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{totalShifts}</Title>
            <Paragraph>Total Shifts</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{totalEmployees}</Title>
            <Paragraph>Total Employees</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{pendingRequests}</Title>
            <Paragraph>Pending Requests</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{approvedRequests}</Title>
            <Paragraph>Approved Requests</Paragraph>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Shift Distribution</Title>
          {Object.entries(shiftTypes).map(([type, count]) => (
            <View key={type} style={styles.shiftTypeRow}>
              <Text style={styles.shiftType}>{type}</Text>
              <Text style={styles.shiftCount}>{count}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Employee Overview</Title>
          {employees.map((employee) => {
            const employeeShifts = shifts.filter(shift => 
              shift.assigned_employee === employee.employee_id
            ).length;
            
            return (
              <View key={employee.employee_id} style={styles.employeeRow}>
                <View style={styles.employeeInfo}>
                  <Text style={styles.employeeName}>{employee.name}</Text>
                  <Text style={styles.employeeRole}>{employee.role}</Text>
                </View>
                <Text style={styles.employeeShifts}>{employeeShifts} shifts</Text>
              </View>
            );
          })}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Request Status</Title>
          <View style={styles.requestStats}>
            <View style={styles.requestStat}>
              <Text style={styles.requestLabel}>Pending</Text>
              <Text style={styles.requestCount}>{pendingRequests}</Text>
            </View>
            <View style={styles.requestStat}>
              <Text style={styles.requestLabel}>Approved</Text>
              <Text style={styles.requestCount}>{approvedRequests}</Text>
            </View>
            <View style={styles.requestStat}>
              <Text style={styles.requestLabel}>Denied</Text>
              <Text style={styles.requestCount}>
                {requests.filter(req => req.status === 'denied').length}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    width: '45%',
    margin: '2.5%',
    backgroundColor: '#E3F2FD',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
  },
  card: {
    margin: 20,
    marginTop: 0,
  },
  shiftTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  shiftType: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  shiftCount: {
    fontSize: 16,
    color: '#666',
  },
  employeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontWeight: 'bold',
  },
  employeeRole: {
    color: '#666',
    fontSize: 12,
  },
  employeeShifts: {
    fontSize: 16,
    color: '#666',
  },
  requestStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  requestStat: {
    alignItems: 'center',
  },
  requestLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  requestCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});
