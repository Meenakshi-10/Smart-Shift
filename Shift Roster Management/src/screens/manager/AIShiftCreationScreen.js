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
  Switch,
  Divider,
  Chip,
} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { useShift } from '../../contexts/ShiftContext';
import { theme } from '../../theme/theme';

const AIShiftCreationScreen = ({ navigation }) => {
  const { generateAIShift, approveRoster, currentRoster, loading } = useShift();
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [minStaffRequired, setMinStaffRequired] = useState('');
  const [constraints, setConstraints] = useState({
    avoidBackToBack: false,
    respectAvailability: false,
    fairDistribution: false,
  });

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleGenerateRoster = async () => {
    if (!minStaffRequired || parseInt(minStaffRequired) <= 0) {
      Alert.alert('Error', 'Please enter a valid minimum staff requirement');
      return;
    }

    if (startDate > endDate) {
      Alert.alert('Error', 'Start date cannot be after end date');
      return;
    }

    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      minStaffRequired: parseInt(minStaffRequired),
      constraints,
    };

    const result = await generateAIShift(params);
    if (result.success) {
      Alert.alert('Success', 'AI roster generated successfully!');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleApproveRoster = async () => {
    if (!currentRoster) {
      Alert.alert('Error', 'No roster to approve');
      return;
    }

    const result = await approveRoster(currentRoster.id);
    if (result.success) {
      Alert.alert('Success', 'Roster approved and published!');
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const toggleConstraint = (key) => {
    setConstraints(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>AI-Powered Shift Creation</Text>

        {/* Date Range Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Select Date Range</Text>
            
            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <Text style={styles.dateLabel}>Start:</Text>
                <Button
                  mode="outlined"
                  onPress={() => setShowStartPicker(true)}
                  style={styles.dateButton}
                >
                  {formatDate(startDate)}
                </Button>
              </View>
              
              <View style={styles.dateField}>
                <Text style={styles.dateLabel}>End:</Text>
                <Button
                  mode="outlined"
                  onPress={() => setShowEndPicker(true)}
                  style={styles.dateButton}
                >
                  {formatDate(endDate)}
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Staff Requirements */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Staff Requirements</Text>
            
            <TextInput
              label="Minimum Staff Required per Role"
              value={minStaffRequired}
              onChangeText={setMinStaffRequired}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          </Card.Content>
        </Card>

        {/* Rules & Constraints */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Rules & Constraints</Text>
            
            <View style={styles.constraintRow}>
              <Text style={styles.constraintText}>Avoid back-to-back shifts</Text>
              <Switch
                value={constraints.avoidBackToBack}
                onValueChange={() => toggleConstraint('avoidBackToBack')}
                color={theme.colors.primary}
              />
            </View>
            
            <View style={styles.constraintRow}>
              <Text style={styles.constraintText}>Respect employee availability</Text>
              <Switch
                value={constraints.respectAvailability}
                onValueChange={() => toggleConstraint('respectAvailability')}
                color={theme.colors.primary}
              />
            </View>
            
            <View style={styles.constraintRow}>
              <Text style={styles.constraintText}>Fair shift distribution</Text>
              <Switch
                value={constraints.fairDistribution}
                onValueChange={() => toggleConstraint('fairDistribution')}
                color={theme.colors.primary}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Generate Button */}
        <Button
          mode="contained"
          onPress={handleGenerateRoster}
          loading={loading}
          disabled={loading}
          style={styles.generateButton}
          contentStyle={styles.buttonContent}
        >
          Generate Roster with AI
        </Button>

        {/* Roster Preview */}
        {currentRoster && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Roster Preview</Text>
              <Text style={styles.rosterSubtitle}>Optimized for fairness</Text>
              
              <View style={styles.rosterPreview}>
                {currentRoster.shifts?.map((shift, index) => (
                  <View key={index} style={styles.shiftItem}>
                    <Text style={styles.shiftDate}>
                      {formatDate(new Date(shift.date))}
                    </Text>
                    <Text style={styles.shiftDetails}>
                      {shift.employee?.name} - {shift.startTime} to {shift.endTime}
                    </Text>
                    <Chip 
                      mode="outlined" 
                      style={styles.shiftType}
                      textStyle={styles.chipText}
                    >
                      {shift.shiftType}
                    </Chip>
                  </View>
                )) || (
                  <Text style={styles.noShiftsText}>No shifts generated yet</Text>
                )}
              </View>
              
              <Button
                mode="contained"
                onPress={handleApproveRoster}
                style={styles.approveButton}
                contentStyle={styles.buttonContent}
              >
                Approve & Publish
              </Button>
            </Card.Content>
          </Card>
        )}
      </View>

      {/* Date Pickers */}
      <DatePicker
        modal
        open={showStartPicker}
        date={startDate}
        mode="date"
        onConfirm={(date) => {
          setShowStartPicker(false);
          setStartDate(date);
        }}
        onCancel={() => setShowStartPicker(false)}
      />

      <DatePicker
        modal
        open={showEndPicker}
        date={endDate}
        mode="date"
        onConfirm={(date) => {
          setShowEndPicker(false);
          setEndDate(date);
        }}
        onCancel={() => setShowEndPicker(false)}
      />
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
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    color: theme.colors.text,
  },
  card: {
    marginBottom: theme.spacing.md,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateField: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  dateLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  dateButton: {
    borderRadius: theme.borderRadius.md,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  constraintRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  constraintText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  generateButton: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  rosterSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  rosterPreview: {
    marginBottom: theme.spacing.lg,
  },
  shiftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  shiftDate: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    width: 80,
  },
  shiftDetails: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  shiftType: {
    height: 24,
  },
  chipText: {
    fontSize: 12,
  },
  noShiftsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  approveButton: {
    borderRadius: theme.borderRadius.md,
  },
});

export default AIShiftCreationScreen; 