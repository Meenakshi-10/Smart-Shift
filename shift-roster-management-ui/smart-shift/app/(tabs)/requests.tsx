import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Paragraph, SegmentedButtons, Text, TextInput, Title } from 'react-native-paper';
import { useAppContext } from '../../contexts/AppContext';

export default function EmployeeRequestsScreen() {
  const { requests, employees, currentEmployee, createRequest } = useAppContext();
  const [requestType, setRequestType] = useState<'leave' | 'swap'>('leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [swapPartner, setSwapPartner] = useState('');

  const employeeRequests = requests.filter(req => 
    req.employee_id === currentEmployee?.employee_id
  );

  const handleSubmitRequest = async () => {
    if (!startDate || !endDate || !reason) return;

    const newRequest = {
      employee_id: currentEmployee?.employee_id || '',
      request_type: requestType,
      start_date: startDate,
      end_date: endDate,
      reason,
      status: 'pending' as const,
      swap_partner: requestType === 'swap' ? swapPartner : undefined,
    };

    try {
      await createRequest(newRequest);
      // Reset form
      setStartDate('');
      setEndDate('');
      setReason('');
      setSwapPartner('');
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'denied': return '#F44336';
      default: return '#FF9800';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Request Management</Title>
        <Paragraph style={styles.subtitle}>
          Create new requests or view existing ones
        </Paragraph>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>New Request</Title>
          
          <SegmentedButtons
            value={requestType}
            onValueChange={setRequestType}
            buttons={[
              { value: 'leave', label: 'Leave Request' },
              { value: 'swap', label: 'Shift Swap' },
            ]}
            style={styles.segmentedButtons}
          />

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

          {requestType === 'swap' && (
            <TextInput
              label="Swap Partner"
              value={swapPartner}
              onChangeText={setSwapPartner}
              placeholder="Select employee to swap with"
              style={styles.input}
              mode="outlined"
            />
          )}

          <TextInput
            label="Reason"
            value={reason}
            onChangeText={setReason}
            placeholder="Please provide a reason for your request"
            multiline
            numberOfLines={3}
            style={styles.input}
            mode="outlined"
          />

          <Button
            mode="contained"
            onPress={handleSubmitRequest}
            style={styles.submitButton}
            disabled={!startDate || !endDate || !reason}
          >
            Submit Request
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>My Requests</Title>
          {employeeRequests.length > 0 ? (
            employeeRequests.map((request) => (
              <View key={request.request_id} style={styles.requestItem}>
                <View style={styles.requestHeader}>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getStatusColor(request.status) }}
                    style={{ borderColor: getStatusColor(request.status) }}
                  >
                    {request.request_type.toUpperCase()}
                  </Chip>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getStatusColor(request.status) }}
                    style={{ borderColor: getStatusColor(request.status) }}
                  >
                    {request.status}
                  </Chip>
                </View>
                
                <View style={styles.requestDetails}>
                  <Text style={styles.detailText}>
                    <Text style={styles.label}>From:</Text> {request.start_date}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.label}>To:</Text> {request.end_date}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.label}>Reason:</Text> {request.reason}
                  </Text>
                  {request.swap_partner && (
                    <Text style={styles.detailText}>
                      <Text style={styles.label}>Swap Partner:</Text> {request.swap_partner}
                    </Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Paragraph>No requests submitted yet</Paragraph>
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
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  card: {
    margin: 20,
    marginTop: 0,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    marginVertical: 8,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  requestItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestDetails: {
    marginTop: 8,
  },
  detailText: {
    marginVertical: 2,
    fontSize: 14,
  },
  label: {
    fontWeight: 'bold',
    color: '#666',
  },
});
