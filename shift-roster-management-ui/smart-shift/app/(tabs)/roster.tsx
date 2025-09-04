import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Paragraph, Switch, Text, TextInput, Title } from 'react-native-paper';
import { useAppContext } from '../../contexts/AppContext';

export default function RosterScreen() {
  const { shifts, employees, createShift } = useAppContext();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minStaff, setMinStaff] = useState('');
  const [avoidBackToBack, setAvoidBackToBack] = useState(true);
  const [respectAvailability, setRespectAvailability] = useState(true);
  const [fairDistribution, setFairDistribution] = useState(true);

  const handleGenerateRoster = async () => {
    // Simple roster generation logic
    const newShift = {
      date: startDate,
      start_time: '09:00',
      end_time: '17:00',
      shift_type: 'morning',
      assigned_employee: employees[0]?.employee_id || '',
      status: 'assigned'
    };

    try {
      await createShift(newShift);
    } catch (error) {
      console.error('Error creating shift:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>AI-Powered Shift Creation</Title>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Select Date Range</Title>
          <TextInput
            label="Start Date"
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="End Date"
            value={endDate}
            onChangeText={setEndDate}
            placeholder="YYYY-MM-DD"
            style={styles.input}
            mode="outlined"
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Staff Requirements</Title>
          <TextInput
            label="Minimum Staff Required per Role"
            value={minStaff}
            onChangeText={setMinStaff}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Rules & Constraints</Title>
          <View style={styles.switchRow}>
            <Text>Avoid back-to-back shifts</Text>
            <Switch value={avoidBackToBack} onValueChange={setAvoidBackToBack} />
          </View>
          <View style={styles.switchRow}>
            <Text>Respect employee availability</Text>
            <Switch value={respectAvailability} onValueChange={setRespectAvailability} />
          </View>
          <View style={styles.switchRow}>
            <Text>Fair shift distribution</Text>
            <Switch value={fairDistribution} onValueChange={setFairDistribution} />
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={handleGenerateRoster}
          style={styles.button}
          icon="robot"
        >
          Generate Roster with AI
        </Button>
        <Button
          mode="outlined"
          onPress={() => {}}
          style={styles.button}
          icon="check"
        >
          Approve & Publish
        </Button>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Current Shifts</Title>
          {shifts.length > 0 ? (
            shifts.map((shift) => (
              <View key={shift.shift_id} style={styles.shiftItem}>
                <Text style={styles.shiftDate}>{shift.date}</Text>
                <Text style={styles.shiftTime}>
                  {shift.start_time} - {shift.end_time}
                </Text>
                <Text style={styles.shiftEmployee}>
                  {employees.find(emp => emp.employee_id === shift.assigned_employee)?.name}
                </Text>
                <Text style={styles.shiftStatus}>{shift.status}</Text>
              </View>
            ))
          ) : (
            <Paragraph>No shifts created yet</Paragraph>
          )}
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
  card: {
    margin: 20,
    marginTop: 0,
  },
  input: {
    marginVertical: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    marginVertical: 8,
    paddingVertical: 8,
  },
  shiftItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  shiftDate: {
    flex: 1,
    fontWeight: 'bold',
  },
  shiftTime: {
    flex: 1,
    textAlign: 'center',
  },
  shiftEmployee: {
    flex: 1,
    textAlign: 'center',
  },
  shiftStatus: {
    flex: 1,
    textAlign: 'right',
    color: '#666',
  },
});
