import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notificationService from '../services/notificationService';

const NotificationDebug = () => {
  const [token, setToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>('Unknown');

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    try {
      // Get current permission status
      const authStatus = await messaging().hasPermission();
      setPermissionStatus(authStatus.toString());

      // Get FCM token
      const fcmToken = await notificationService.getToken();
      setToken(fcmToken);
    } catch (error) {
      console.error('Error checking notification status:', error);
    }
  };

  const requestPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission({
        alert: true,
        badge: true,
        sound: true,
        announcement: false,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
      });
      
      setPermissionStatus(authStatus.toString());
      Alert.alert('Permission Status', `Permission status: ${authStatus}`);
    } catch (error) {
      Alert.alert('Error', `Failed to request permission: ${error}`);
    }
  };

  const testLocalNotification = async () => {
    try {
      // Test local notification using Notifee
      const notifee = require('@notifee/react-native');
      
      if (Platform.OS === 'android') {
        const channelId = await notifee.createChannel({
          id: 'test',
          name: 'Test Channel',
          importance: 4, // HIGH
        });

        await notifee.displayNotification({
          title: 'Test Notification',
          body: 'This is a test notification for foreground',
          data: { test: true },
          android: {
            channelId,
            importance: 4,
            pressAction: {
              id: 'default',
            },
          },
        });
      } else {
        // iOS
        await notifee.displayNotification({
          title: 'Test Notification',
          body: 'This is a test notification for foreground',
          data: { test: true },
          ios: {
            sound: 'default',
            badge: 1,
          },
        });
      }
      
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      Alert.alert('Error', `Failed to show notification: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Debug</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Permission Status:</Text>
        <Text style={styles.value}>{permissionStatus}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>FCM Token:</Text>
        <Text style={styles.tokenValue} numberOfLines={3}>
          {token || 'No token available'}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={requestPermission}>
        <Text style={styles.buttonText}>Request Permission</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={checkNotificationStatus}>
        <Text style={styles.buttonText}>Refresh Status</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testLocalNotification}>
        <Text style={styles.buttonText}>Test Local Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  tokenValue: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default NotificationDebug;
