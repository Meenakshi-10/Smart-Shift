import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Paragraph, Text, TextInput, Title } from 'react-native-paper';
import { useAppContext } from '../../contexts/AppContext';

export default function ChatScreen() {
  const { employees, currentEmployee } = useAppContext();
  const [message, setMessage] = useState('');
  const [activeChat, setActiveChat] = useState<'direct' | 'team' | 'group'>('direct');

  // Mock chat data
  const mockMessages = [
    { id: 1, sender: 'John Doe', message: 'Hey team, hows the shift going?', time: '10:30 AM' },
    { id: 2, sender: 'Jane Smith', message: 'All good here! Quiet morning so far.', time: '10:32 AM' },
    { id: 3, sender: 'Mike Chen', message: 'Anyone available for a shift swap tomorrow?', time: '10:35 AM' },
    { id: 4, sender: currentEmployee?.name || 'You', message: 'I might be available, let me check my schedule.', time: '10:37 AM' },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Chat</Title>
        <Paragraph style={styles.subtitle}>Team Communication</Paragraph>
      </View>

      <View style={styles.chatButtons}>
        <Button
          mode={activeChat === 'direct' ? 'contained' : 'outlined'}
          onPress={() => setActiveChat('direct')}
          style={styles.chatButton}
          icon="account"
        >
          Direct Message
        </Button>
        <Button
          mode={activeChat === 'team' ? 'contained' : 'outlined'}
          onPress={() => setActiveChat('team')}
          style={styles.chatButton}
          icon="account-group"
        >
          Team Chat
        </Button>
        <Button
          mode={activeChat === 'group' ? 'contained' : 'outlined'}
          onPress={() => setActiveChat('group')}
          style={styles.chatButton}
          icon="forum"
        >
          Group Chat
        </Button>
      </View>

      <Card style={styles.chatCard}>
        <Card.Content>
          <Title>Engineering Team Chat</Title>
          
          <ScrollView style={styles.messagesContainer}>
            {mockMessages.map((msg) => (
              <View key={msg.id} style={styles.messageItem}>
                <View style={styles.messageHeader}>
                  <Avatar.Text size={32} label={msg.sender.charAt(0)} />
                  <View style={styles.messageInfo}>
                    <Text style={styles.senderName}>{msg.sender}</Text>
                    <Text style={styles.messageTime}>{msg.time}</Text>
                  </View>
                </View>
                <Text style={styles.messageText}>{msg.message}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              label="Type a message..."
              value={message}
              onChangeText={setMessage}
              style={styles.messageInput}
              mode="outlined"
              multiline
            />
            <Button
              mode="contained"
              onPress={handleSendMessage}
              style={styles.sendButton}
              icon="send"
              disabled={!message.trim()}
            >
              Send
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Quick Actions</Title>
          <View style={styles.quickActions}>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.actionButton}
              icon="calendar"
            >
              Request Shift Swap
            </Button>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.actionButton}
              icon="account-clock"
            >
              Request Leave
            </Button>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.actionButton}
              icon="bell"
            >
              Notifications
            </Button>
          </View>
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
  chatButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chatButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  chatCard: {
    margin: 20,
    marginTop: 0,
  },
  messagesContainer: {
    maxHeight: 300,
    marginVertical: 16,
  },
  messageItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageInfo: {
    marginLeft: 12,
    flex: 1,
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 16,
  },
  messageInput: {
    flex: 1,
    marginRight: 8,
  },
  sendButton: {
    paddingHorizontal: 16,
  },
  card: {
    margin: 20,
    marginTop: 0,
  },
  quickActions: {
    marginTop: 16,
  },
  actionButton: {
    marginVertical: 4,
  },
});
