import React, { useState } from 'react';
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
  TextInput,
  Avatar,
  IconButton,
  Modal,
  Portal,
} from 'react-native-paper';
import { useShift } from '../../contexts/ShiftContext';
import { theme } from '../../theme/theme';

const EmployeeManagementScreen = ({ navigation }) => {
  const { employees, loading } = useShift();
  const [addEmployeeModalVisible, setAddEmployeeModalVisible] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: 'employee',
  });

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Here you would typically call the API to add the employee
    Alert.alert('Success', 'Employee added successfully');
    setAddEmployeeModalVisible(false);
    setNewEmployee({ name: '', email: '', role: 'employee' });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Employee Management</Text>
        </View>

        {/* Employee List */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Current Employees</Text>
            
            {employees.length > 0 ? (
              employees.map((employee, index) => (
                <View key={index} style={styles.employeeRow}>
                  <View style={styles.employeeInfo}>
                    <Avatar.Text 
                      size={40} 
                      label={employee.name?.charAt(0) || 'E'} 
                    />
                    <View style={styles.employeeDetails}>
                      <Text style={styles.employeeName}>{employee.name}</Text>
                      <Text style={styles.employeeEmail}>{employee.email}</Text>
                      <Text style={styles.employeeRole}>{employee.role}</Text>
                    </View>
                  </View>
                  <IconButton
                    icon="dots-vertical"
                    onPress={() => Alert.alert('Options', 'Employee options coming soon')}
                  />
                </View>
              ))
            ) : (
              <View style={styles.noEmployeesPlaceholder}>
                <Text style={styles.placeholderText}>No employees found</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Add Employee Button */}
        <Button
          mode="contained"
          onPress={() => setAddEmployeeModalVisible(true)}
          style={styles.addButton}
          contentStyle={styles.buttonContent}
        >
          Add New Employee
        </Button>
      </ScrollView>

      {/* Add Employee Modal */}
      <Portal>
        <Modal
          visible={addEmployeeModalVisible}
          onDismiss={() => setAddEmployeeModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Add New Employee</Text>
          
          <TextInput
            label="Full Name"
            value={newEmployee.name}
            onChangeText={(text) => setNewEmployee({...newEmployee, name: text})}
            mode="outlined"
            style={styles.modalInput}
          />
          
          <TextInput
            label="Email Address"
            value={newEmployee.email}
            onChangeText={(text) => setNewEmployee({...newEmployee, email: text})}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.modalInput}
          />
          
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setAddEmployeeModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAddEmployee}
              style={styles.modalButton}
            >
              Add Employee
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
  employeeEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  employeeRole: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  noEmployeesPlaceholder: {
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
  addButton: {
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
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
    marginBottom: theme.spacing.md,
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

export default EmployeeManagementScreen; 