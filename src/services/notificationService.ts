import messaging from '@react-native-firebase/messaging';
import { Platform, Alert } from 'react-native';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';

class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      // Request permission for notifications
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('📱 Notification permission granted');
        this.setupForegroundListener();
        this.setupBackgroundListener();
        this.setupNotificationOpenedListener();
      } else {
        console.log('📱 Notification permission denied');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Error initializing notifications:', error);
    }
  }

  private setupForegroundListener() {
    // Handle notifications when app is in foreground
    messaging().onMessage(async remoteMessage => {
      console.log('📱 Foreground notification received:', remoteMessage);
      
      if (Platform.OS === 'android') {
        // For Android, show a local notification using Notifee
        await this.displayLocalNotification(remoteMessage);
      } else {
        // For iOS, the notification will be shown by the system
        // due to the willPresent implementation in AppDelegate
        console.log('iOS foreground notification handled by system');
      }
    });
  }

  private async displayLocalNotification(remoteMessage: any) {
    try {
      // Create a channel for Android notifications
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
      });

      // Display the notification
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'New Notification',
        body: remoteMessage.notification?.body || 'You have a new message',
        data: remoteMessage.data || {},
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
          pressAction: {
            id: 'default',
          },
        },
      });

      console.log('📱 Local notification displayed');
    } catch (error) {
      console.error('❌ Error displaying local notification:', error);
      
      // Fallback to alert if notification fails
      Alert.alert(
        remoteMessage.notification?.title || 'New Notification',
        remoteMessage.notification?.body || 'You have a new message',
        [
          {
            text: 'View',
            onPress: () => {
              this.handleNotificationTap(remoteMessage);
            },
          },
          {
            text: 'Dismiss',
            style: 'cancel',
          },
        ]
      );
    }
  }

  private setupBackgroundListener() {
    // Handle notifications when app is in background
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('📱 Background notification received:', remoteMessage);
      // Handle background notification processing here
    });
  }

  private setupNotificationOpenedListener() {
    // Handle notification tap when app is in background/terminated
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('📱 Notification opened app:', remoteMessage);
      this.handleNotificationTap(remoteMessage);
    });

    // Handle notification tap when app is completely closed
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('📱 Notification caused app to open from quit state:', remoteMessage);
          this.handleNotificationTap(remoteMessage);
        }
      });

    // Handle local notification taps (for Android)
    if (Platform.OS === 'android') {
      notifee.onForegroundEvent(({ type, detail }) => {
        if (type === 1) { // PRESS event
          console.log('📱 Local notification tapped:', detail);
          this.handleNotificationTap(detail.notification?.data);
        }
      });
    }
  }

  private handleNotificationTap(remoteMessage: any) {
    // Handle navigation based on notification data
    console.log('📱 Handling notification tap:', remoteMessage);
    
    // You can add navigation logic here based on the notification data
    // For example:
    // if (remoteMessage.data?.screen) {
    //   // Navigate to specific screen
    // }
  }

  async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      console.log('📱 FCM Token:', token);
      return token;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  }

  async deleteToken(): Promise<void> {
    try {
      await messaging().deleteToken();
      console.log('📱 FCM Token deleted');
    } catch (error) {
      console.error('❌ Error deleting FCM token:', error);
    }
  }
}

export default NotificationService.getInstance();
