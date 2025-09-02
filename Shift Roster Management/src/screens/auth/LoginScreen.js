import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  IconButton,
  Divider,
} from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme/theme';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  const handleInitialSetup = () => {
    navigation.navigate('InitialSetup');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Login Section */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Welcome Back!</Text>
              
              <TextInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                theme={{ colors: { primary: theme.colors.primary } }}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
                theme={{ colors: { primary: theme.colors.primary } }}
              />

              <Button
                mode="text"
                onPress={() => Alert.alert('Forgot Password', 'Feature coming soon')}
                style={styles.forgotPassword}
              >
                Forgot Password?
              </Button>

              <Button
                mode="contained"
                onPress={handleSignIn}
                loading={loading}
                disabled={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Sign In
              </Button>
            </Card.Content>
          </Card>

          <Divider style={styles.divider} />

          {/* Initial Setup Section */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Initial Setup</Text>
              
              <TextInput
                label="Company Name"
                mode="outlined"
                style={styles.input}
                theme={{ colors: { primary: theme.colors.primary } }}
              />

              <TextInput
                label="Add Employee (Email)"
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                theme={{ colors: { primary: theme.colors.primary } }}
              />

              <Button
                mode="contained"
                onPress={() => Alert.alert('Add Employee', 'Feature coming soon')}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Add Employee
              </Button>

              <Button
                mode="contained"
                onPress={() => Alert.alert('Define Shift Types', 'Feature coming soon')}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Define Shift Types
              </Button>

              <Button
                mode="contained"
                onPress={handleInitialSetup}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Finish Setup
              </Button>
            </Card.Content>
          </Card>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <View style={styles.navItem}>
            <IconButton icon="login" size={24} color={theme.colors.primary} />
            <Text style={[styles.navText, { color: theme.colors.primary }]}>Login</Text>
          </View>
          <View style={styles.navItem}>
            <IconButton icon="person" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.navText}>Setup</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  card: {
    marginBottom: theme.spacing.md,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    color: theme.colors.text,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  button: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  divider: {
    marginVertical: theme.spacing.lg,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});

export default LoginScreen; 