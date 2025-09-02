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
  SegmentedButtons,
  Modal,
  Portal,
} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { useShift } from '../../contexts/ShiftContext';
import { theme } from '../../theme/theme';

const RequestScreen = ({ navigation, route }) => {
  const { requestShiftSwap, requestLeave, employees } = useShift();
  const [requestType, setRequestType] = useState('swap');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState('');
  
  // Swap request state
  const [swapRequest, setSwapRequest] = useState({
    targetEmployeeId: '',
    myShiftDate: new Date(),
    targetShiftDate: new Date(),
    reason: '',
  });
  
  // Leave request state
  const [leaveRequest, setLeaveRequest] = useState({
    startDate: new Date(),
    endDate: new Date(),
    leaveType: 'vacation',
    reason: '',
  });

  const handleSubmitRequest = async () => {
    if (requestType === 'swap') {
      if (!swapRequest.targetEmployeeId || !swapRequest.reason) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      
      const result = await requestShiftSwap(swapRequest);
      if (result.success) {
        Alert.alert('Success', 'Swap request submitted successfully');
        setSwapRequest({
          targetEmployeeId: '',
          myShiftDate: new Date(),
          targetShiftDate: new Date(),
          reason: '',
        });
      } else {
        Alert.alert('Error', result.error);
      }
    } else {
      if (!leaveRequest.reason) {
        Alert.alert('Error', 'Please provide a reason for leave');
        return;
      }
      
      const result = await requestLeave(leaveRequest);
      if (result.success) {
        Alert.alert('Success', 'Leave request submitted successfully');
        setLeaveRequest({
          startDate: new Date(),
          endDate: new Date(),
          leaveType: 'vacation',
          reason: '',
        });
      } else {
        Alert.alert('Error', result.error);
      }
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Request Management</Text>

        {/* Request Type Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Request Type</Text>
            <SegmentedButtons
              value={requestType}
              onValueChange={setRequestType}
              buttons={[
                { value: 'swap', label: 'Shift Swap' },
                { value: 'leave', label: 'Leave Request' },
              ]}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {requestType === 'swap' ? (
          /* Shift Swap Request Form */
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Shift Swap Request</Text>
              
              <TextInput
                label="Target Employee"
                value={swapRequest.targetEmployeeId}
                onChangeText={(text) => setSwapRequest({...swapRequest, targetEmployeeId: text})}
                mode="outlined"
                style={styles.input}
                placeholder="Select employee to swap with"
              />
              
              <View style={styles.dateRow}>
                <View style={styles.dateField}>
                  <Text style={styles.dateLabel}>My Shift Date:</Text>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setDatePickerType('myShift');
                      setShowDatePicker(true);
                    }}
                    style={styles.dateButton}
                  >
                    {formatDate(swapRequest.myShiftDate)}
                  </Button>
                </View>
                
                <View style={styles.dateField}>
                  <Text style={styles.dateLabel}>Target Shift Date:</Text>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setDatePickerType('targetShift');
                      setShowDatePicker(true);
                    }}
                    style={styles.dateButton}
                  >
                    {formatDate(swapRequest.targetShiftDate)}
                  </Button>
                </View>
              </View>
              
              <TextInput
                label="Reason for Swap"
                value={swapRequest.reason}
                onChangeText={(text) => setSwapRequest({...swapRequest, reason: text})}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                placeholder="Please provide a reason for the shift swap"
              />
            </Card.Content>
          </Card>
        ) : (
          /* Leave Request Form */
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Leave Request</Text>
              
              <View style={styles.dateRow}>
                <View style={styles.dateField}>
                  <Text style={styles.dateLabel}>Start Date:</Text>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setDatePickerType('startDate');
                      setShowDatePicker(true);
                    }}
                    style={styles.dateButton}
                  >
                    {formatDate(leaveRequest.startDate)}
                  </Button>
                </View>
                
                <View style={styles.dateField}>
                  <Text style={styles.dateLabel}>End Date:</Text>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setDatePickerType('endDate');
                      setShowDatePicker(true);
                    }}
                    style={styles.dateButton}
                  >
                    {formatDate(leaveRequest.endDate)}
                  </Button>
                </View>
              </View>
              
              <TextInput
                label="Leave Type"
                value={leaveRequest.leaveType}
                onChangeText={(text) => setLeaveRequest({...leaveRequest, leaveType: text})}
                mode="outlined"
                style={styles.input}
                placeholder="vacation, sick, personal, etc."
              />
              
              <TextInput
                label="Reason for Leave"
                value={leaveRequest.reason}
                onChangeText={(text) => setLeaveRequest({...leaveRequest, reason: text})}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                placeholder="Please provide a reason for the leave request"
              />
            </Card.Content>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmitRequest}
          style={styles.submitButton}
          contentStyle={styles.buttonContent}
        >
          Submit Request
        </Button>
      </View>

      {/* Date Picker Modal */}
      <Portal>
        <DatePicker
          modal
          open={showDatePicker}
          date={requestType === 'swap' ? 
            (datePickerType === 'myShift' ? swapRequest.myShiftDate : swapRequest.targetShiftDate) :
            (datePickerType === 'startDate' ? leaveRequest.startDate : leaveRequest.endDate)
          }
          mode="date"
          onConfirm={(date) => {
            setShowDatePicker(false);
            if (requestType === 'swap') {
              if (datePickerType === 'myShift') {
                setSwapRequest({...swapRequest, myShiftDate: date});
              } else {
                setSwapRequest({...swapRequest, targetShiftDate: date});
              }
            } else {
              if (datePickerType === 'startDate') {
                setLeaveRequest({...leaveRequest, startDate: date});
              } else {
                setLeaveRequest({...leaveRequest, endDate: date});
              }
            }
          }}
          onCancel={() => setShowDatePicker(false)}
        />
      </Portal>
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
  segmentedButtons: {
    marginBottom: theme.spacing.md,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
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
  submitButton: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
});

export default RequestScreen; 