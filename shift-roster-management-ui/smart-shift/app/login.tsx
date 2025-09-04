import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Paragraph, TextInput, Title } from 'react-native-paper';
import { useAppContext } from '../contexts/AppContext';

export default function LoginScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'setup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  
  const { userRole, setUserRole, employees, setCurrentEmployee } = useAppContext();
  const router = useRouter();

  const handleLogin = () => {
    // Simple login logic - in real app, this would validate credentials
    if (email && password) {
      router.replace('/(tabs)');
    }
  };

  const handleSetup = () => {
    if (companyName && selectedEmployee) {
      const employee = employees.find(emp => emp.employee_id === selectedEmployee);
      if (employee) {
        setCurrentEmployee(employee);
        setUserRole('manager');
        router.replace('/(tabs)');
      }
    }
  };

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    const employee = employees.find(emp => emp.employee_id === employeeId);
    if (employee) {
      setCurrentEmployee(employee);
      setUserRole('employee');
      router.replace('/(tabs)');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>SmartShift</Title>
        <Paragraph style={styles.subtitle}>Intelligent Shift Management</Paragraph>
      </View>

      <View style={styles.tabContainer}>
        <Button
          mode={activeTab === 'login' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('login')}
          style={styles.tabButton}
        >
          Login
        </Button>
        <Button
          mode={activeTab === 'setup' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('setup')}
          style={styles.tabButton}
        >
          Setup
        </Button>
      </View>

      {activeTab === 'login' ? (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Welcome Back!</Title>
            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
            />
            <Button mode="contained" onPress={handleLogin} style={styles.button}>
              Sign In
            </Button>
            <Button mode="text" onPress={() => {}}>
              Forgot Password?
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Initial Setup</Title>
            <TextInput
              label="Company Name"
              value={companyName}
              onChangeText={setCompanyName}
              style={styles.input}
              mode="outlined"
            />
            <Title style={styles.sectionTitle}>Select Employee</Title>
            {employees.map((employee) => (
              <Button
                key={employee.employee_id}
                mode={selectedEmployee === employee.employee_id ? 'contained' : 'outlined'}
                onPress={() => handleEmployeeSelect(employee.employee_id)}
                style={styles.employeeButton}
              >
                {employee.name} - {employee.role}
              </Button>
            ))}
            <Button mode="contained" onPress={handleSetup} style={styles.button}>
              Finish Setup
            </Button>
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
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  card: {
    margin: 20,
    elevation: 4,
  },
  input: {
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  employeeButton: {
    marginVertical: 4,
  },
});
