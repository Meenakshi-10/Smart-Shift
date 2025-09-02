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
  Divider,
} from 'react-native-paper';
import { theme } from '../theme/theme';

const ChatScreen = ({ navigation }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');

  const chats = [
    {
      id: 1,
      name: 'John Doe',
      type: 'direct',
      lastMessage: 'Can we swap shifts tomorrow?',
      timestamp: '2 min ago',
    },
    {
      id: 2,
      name: 'Marketing Team',
      type: 'team',
      lastMessage: 'Meeting at 3 PM today',
      timestamp: '1 hour ago',
    },
    {
      id: 3,
      name: 'Development Team',
      type: 'group',
      lastMessage: 'Code review completed',
      timestamp: '3 hours ago',
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'John Doe',
      message: 'Hi, can we swap shifts tomorrow?',
      timestamp: '10:30 AM',
      isMe: false,
    },
    {
      id: 2,
      sender: 'Me',
      message: 'Sure, that works for me!',
      timestamp: '10:32 AM',
      isMe: true,
    },
    {
      id: 3,
      sender: 'John Doe',
      message: 'Great, thanks!',
      timestamp: '10:33 AM',
      isMe: false,
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) {
      return;
    }
    // Here you would typically send the message to the backend
    setMessage('');
    Alert.alert('Message Sent', 'Your message has been sent successfully');
  };

  if (selectedChat) {
    return (
      <View style={styles.container}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <Button
            icon="arrow-left"
            onPress={() => setSelectedChat(null)}
            mode="text"
          />
          <Text style={styles.chatTitle}>{selectedChat.name}</Text>
        </View>

        {/* Messages */}
        <ScrollView style={styles.messagesContainer}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageContainer,
                msg.isMe ? styles.myMessage : styles.otherMessage,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  msg.isMe ? styles.myBubble : styles.otherBubble,
                ]}
              >
                <Text style={styles.messageText}>{msg.message}</Text>
                <Text style={styles.messageTime}>{msg.timestamp}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            mode="outlined"
            style={styles.messageInput}
            right={
              <TextInput.Icon
                icon="send"
                onPress={handleSendMessage}
                disabled={!message.trim()}
              />
            }
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>In-Application Communication</Text>

        {/* Chat Options */}
        <View style={styles.chatOptions}>
          <Button
            mode="contained"
            onPress={() => setSelectedChat(chats[0])}
            style={styles.chatButton}
            contentStyle={styles.buttonContent}
          >
            Direct Message with John
          </Button>
          
          <Text style={styles.chatLink}>Team Chat: Marketing</Text>
          <Text style={styles.chatLink}>Group Chat: Development Team</Text>
        </View>

        {/* Chat List */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Recent Chats</Text>
            
            {chats.map((chat) => (
              <View key={chat.id}>
                <View
                  style={styles.chatItem}
                  onTouchEnd={() => setSelectedChat(chat)}
                >
                  <Avatar.Text 
                    size={40} 
                    label={chat.name.charAt(0)} 
                  />
                  <View style={styles.chatInfo}>
                    <Text style={styles.chatName}>{chat.name}</Text>
                    <Text style={styles.chatLastMessage}>{chat.lastMessage}</Text>
                  </View>
                  <Text style={styles.chatTime}>{chat.timestamp}</Text>
                </View>
                <Divider style={styles.divider} />
              </View>
            ))}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  chatOptions: {
    marginBottom: theme.spacing.lg,
  },
  chatButton: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  chatLink: {
    fontSize: 16,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
    marginBottom: theme.spacing.sm,
  },
  card: {
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  chatInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  chatLastMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  chatTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  divider: {
    marginVertical: theme.spacing.sm,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  messagesContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  messageContainer: {
    marginBottom: theme.spacing.sm,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  myBubble: {
    backgroundColor: theme.colors.primary,
  },
  otherBubble: {
    backgroundColor: theme.colors.surface,
  },
  messageText: {
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  messageTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'right',
  },
  inputContainer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  messageInput: {
    backgroundColor: theme.colors.background,
  },
});

export default ChatScreen; 