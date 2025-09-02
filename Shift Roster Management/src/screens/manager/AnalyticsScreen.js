import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
} from 'react-native-paper';
import { theme } from '../../theme/theme';

const AnalyticsScreen = ({ navigation }) => {
  const [analytics, setAnalytics] = useState({
    total_employees: 10,
    total_shifts: 45,
    pending_requests: 3,
    today_shifts: 8,
    today_status: {
      on_duty: 5,
      late: 2,
      absent: 1
    }
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Analytics</Text>

        {/* Overview Cards */}
        <View style={styles.overviewCards}>
          <Card style={styles.overviewCard}>
            <Card.Content>
              <Text style={styles.cardNumber}>{analytics.total_employees}</Text>
              <Text style={styles.cardLabel}>Total Employees</Text>
            </Card.Content>
          </Card>

          <Card style={styles.overviewCard}>
            <Card.Content>
              <Text style={styles.cardNumber}>{analytics.total_shifts}</Text>
              <Text style={styles.cardLabel}>Total Shifts</Text>
            </Card.Content>
          </Card>

          <Card style={styles.overviewCard}>
            <Card.Content>
              <Text style={styles.cardNumber}>{analytics.pending_requests}</Text>
              <Text style={styles.cardLabel}>Pending Requests</Text>
            </Card.Content>
          </Card>

          <Card style={styles.overviewCard}>
            <Card.Content>
              <Text style={styles.cardNumber}>{analytics.today_shifts}</Text>
              <Text style={styles.cardLabel}>Today's Shifts</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Today's Status */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Today's Status</Text>
            
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: theme.colors.success }]} />
                <Text style={styles.statusText}>On Time: {analytics.today_status.on_duty}</Text>
              </View>
              
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: theme.colors.warning }]} />
                <Text style={styles.statusText}>Late: {analytics.today_status.late}</Text>
              </View>
              
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: theme.colors.error }]} />
                <Text style={styles.statusText}>Absent: {analytics.today_status.absent}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Performance Metrics */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Performance Metrics</Text>
            
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Attendance Rate</Text>
              <Text style={styles.metricValue}>87.5%</Text>
            </View>
            
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>On-time Rate</Text>
              <Text style={styles.metricValue}>92.3%</Text>
            </View>
            
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Shift Completion</Text>
              <Text style={styles.metricValue}>98.1%</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>John Doe completed shift</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>Jane Smith requested leave</Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
            
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>Mike Brown swapped shifts</Text>
              <Text style={styles.activityTime}>6 hours ago</Text>
            </View>
          </Card.Content>
        </Card>
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
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  overviewCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  overviewCard: {
    width: '48%',
    marginBottom: theme.spacing.sm,
    elevation: 2,
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  cardLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  metricLabel: {
    fontSize: 16,
    color: theme.colors.text,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  activityTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default AnalyticsScreen; 