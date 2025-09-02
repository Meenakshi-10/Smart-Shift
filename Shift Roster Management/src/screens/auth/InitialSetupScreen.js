import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Chip,
  IconButton,
} from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme/theme';

const InitialSetupScreen = ({ navigation }) => {
  const [companyName, setCompanyName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employees, setEmployees] = useState([]);
  const [shiftTypes, setShiftTypes] = useState([]);
  const [newShiftType, setNewShiftType] = useState('');
  const { signUp } = useAuth();

  const addEmployee = () => {
    if (!employeeEmail || !employeeEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (employees.includes(employeeEmail)) {
      Alert.alert('Error', 'Employee already added');
      return;
    }

    setEmployees([...employees, employeeEmail]);
    setEmployeeEmail('');
  };

  const removeEmployee = (email) => {
    setEmployees(employees.filter(emp => emp !== email));
  };

  const addShiftType = () => {
    if (!newShiftType.trim()) {
      Alert.alert('Error', 'Please enter a shift type name');
      return;
    }

    if (shiftTypes.includes(newShiftType.trim())) {
      Alert.alert('Error', 'Shift type already exists');
      return;
    }

    setShiftTypes([...shiftTypes, newShiftType.trim()]);
    setNewShiftType('');
  };

  const removeShiftType = (type) => {
    setShiftTypes(shiftTypes.filter(st => st !== type));
  };

  const handleFinishSetup = async () => {
    if (!companyName.trim()) {
      Alert.alert('Error', 'Please enter a company name');
      return;
    }

    if (employees.length === 0) {
      Alert.alert('Error', 'Please add at least one employee');
      return;
    }

    if (shiftTypes.length === 0) {
      Alert.alert('Error', 'Please define at least one shift type');
      return;
    }

    // Here you would typically save the setup data
    Alert.alert(
      'Setup Complete',
      'Your company has been configured successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Initial Setup</Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Company Information</Text>
            
            <TextInput
              label="Company Name"
              value={companyName}
              onChangeText={setCompanyName}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Add Employees</Text>
            
            <View style={styles.inputRow}>
              <TextInput
                label="Employee Email"
                value={employeeEmail}
                onChangeText={setEmployeeEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.flexInput}
                theme={{ colors: { primary: theme.colors.primary } }}
              />
              <IconButton
                icon="plus"
                mode="contained"
                onPress={addEmployee}
                style={styles.addButton}
              />
            </View>

            <View style={styles.chipContainer}>
              {employees.map((email, index) => (
                <Chip
                  key={index}
                  onClose={() => removeEmployee(email)}
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {email}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Define Shift Types</Text>
            
            <View style={styles.inputRow}>
              <TextInput
                label="Shift Type Name"
                value={newShiftType}
                onChangeText={setNewShiftType}
                mode="outlined"
                style={styles.flexInput}
                theme={{ colors: { primary: theme.colors.primary } }}
              />
              <IconButton
                icon="plus"
                mode="contained"
                onPress={addShiftType}
                style={styles.addButton}
              />
            </View>

            <View style={styles.chipContainer}>
              {shiftTypes.map((type, index) => (
                <Chip
                  key={index}
                  onClose={() => removeShiftType(type)}
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {type}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleFinishSetup}
          style={styles.finishButton}
          contentStyle={styles.buttonContent}
        >
          Finish Setup
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    color: theme.colors.text,
  },
  card: {
    marginBottom: theme.spacing.md,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  flexInput: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  addButton: {
    margin: 0,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    marginBottom: theme.spacing.sm,
  },
  chipText: {
    fontSize: 12,
  },
  finishButton: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
});

export default InitialSetupScreen; 