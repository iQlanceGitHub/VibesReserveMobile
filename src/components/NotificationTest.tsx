import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const NotificationTest: React.FC = () => {
  const testForegroundNotification = async () => {
    try {
      // This is just for testing - in real app, notifications come from server
      const testMessage = {
        notification: {
          title: 'Test Notification',
          body: 'This is a test notification for foreground testing',
        },
        data: {
          test: 'true',
        },
      };

      // Simulate receiving a message in foreground
      Alert.alert(
        'Test Notification',
        'This simulates a foreground notification. In real app, this would come from Firebase.',
        [
          {
            text: 'OK',
            onPress: () => console.log('Test notification acknowledged'),
          },
        ]
      );
    } catch (error) {
      console.error('Error testing notification:', error);
    }
  };

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      Alert.alert('FCM Token', token);
    } catch (error) {
      Alert.alert('Error', 'Failed to get FCM token');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Test</Text>
      
      <TouchableOpacity style={styles.button} onPress={testForegroundNotification}>
        <Text style={styles.buttonText}>Test Foreground Notification</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={getToken}>
        <Text style={styles.buttonText}>Get FCM Token</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default NotificationTest;
