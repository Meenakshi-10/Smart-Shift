import React, { useState, useEffect } from 'react';
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
  Avatar,
  Chip,
  Divider,
} from 'react-native-paper';
import { useShift } from '../../contexts/ShiftContext';
import { theme } from '../../theme/theme';

const RequestsScreen = ({ navigation }) => {
  const { pendingRequests, approveRequest, denyRequest, loading } = useShift();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleApprove = async (requestId, type) => {
    Alert.alert(
      'Approve Request',
      'Are you sure you want to approve this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            const result = await approveRequest(requestId, type);
            if (result.success) {
              Alert.alert('Success', 'Request approved successfully');
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const handleDeny = async (requestId, type) => {
    Alert.alert(
      'Deny Request',
      'Are you sure you want to deny this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deny',
          style: 'destructive',
          onPress: async () => {
            const result = await denyRequest(requestId, type);
            if (result.success) {
              Alert.alert('Success', 'Request denied successfully');
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const renderRequestItem = (request) => {
    if (request.request_type === 'swap') {
      return (
        <View key={request.id}>
          <View style={styles.requestItem}>
            <View style={styles.requestHeader}>
              <Avatar.Text 
                size={40} 
                label={request.employee?.name?.charAt(0) || 'E'} 
              />
              <View style={styles.requestInfo}>
                <Text style={styles.requestTitle}>
                  Shift Swap Request: {request.employee?.name || 'Unknown'} - Swap with {request.target_employee?.name || 'Unknown'}
                </Text>
                <Text style={styles.requestDetails}>
                  {formatDate(request.my_shift_date)} ↔ {formatDate(request.target_shift_date)}
                </Text>
                {request.reason && (
                  <Text style={styles.requestReason}>Reason: {request.reason}</Text>
                )}
              </View>
            </View>
            <View style={styles.requestActions}>
              <Button
                mode="contained"
                onPress={() => handleApprove(request.id, 'swap')}
                style={styles.approveButton}
                contentStyle={styles.buttonContent}
              >
                Approve
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleDeny(request.id, 'swap')}
                style={styles.denyButton}
                contentStyle={styles.buttonContent}
              >
                Deny
              </Button>
            </View>
          </View>
          <Divider style={styles.divider} />
        </View>
      );
    } else if (request.request_type === 'leave') {
      return (
        <View key={request.id}>
          <View style={styles.requestItem}>
            <View style={styles.requestHeader}>
              <Avatar.Text 
                size={40} 
                label={request.employee?.name?.charAt(0) || 'E'} 
              />
              <View style={styles.requestInfo}>
                <Text style={styles.requestTitle}>
                  Leave Request: {request.employee?.name || 'Unknown'} - {request.leave_type}
                </Text>
                <Text style={styles.requestDetails}>
                  {formatDate(request.start_date)} to {formatDate(request.end_date)}
                </Text>
                {request.reason && (
                  <Text style={styles.requestReason}>Reason: {request.reason}</Text>
                )}
              </View>
            </View>
            <View style={styles.requestActions}>
              <Button
                mode="contained"
                onPress={() => handleApprove(request.id, 'leave')}
                style={styles.approveButton}
                contentStyle={styles.buttonContent}
              >
                Approve
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleDeny(request.id, 'leave')}
                style={styles.denyButton}
                contentStyle={styles.buttonContent}
              >
                Deny
              </Button>
            </View>
          </View>
          <Divider style={styles.divider} />
        </View>
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Shift Swap & Leave Management</Text>

        {pendingRequests.length > 0 ? (
          pendingRequests.map(renderRequestItem)
        ) : (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.noRequestsText}>No pending requests</Text>
            </Card.Content>
          </Card>
        )}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  requestItem: {
    marginBottom: theme.spacing.md,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  requestInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  requestDetails: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  requestReason: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  approveButton: {
    borderRadius: theme.borderRadius.md,
  },
  denyButton: {
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  divider: {
    marginVertical: theme.spacing.md,
  },
  card: {
    marginTop: theme.spacing.lg,
  },
  noRequestsText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default RequestsScreen; 