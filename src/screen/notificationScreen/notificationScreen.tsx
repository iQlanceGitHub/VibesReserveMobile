import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import styles from "./styles";
import { BackButton } from "../../components/BackButton";
import { NotificationItem } from "./notificationItem";
import {
  onGetNotificationList,
  onMarkNotificationAsRead,
} from "../../redux/auth/actions";

interface NotificationScreenProps {
  navigation?: any;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isUnread: boolean;
  type: string;
  createdAt?: string;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.auth);
  const { notificationList, notificationListErr, loader } = authState;
  
  // Debug Redux state
  console.log("🔔 Full auth state:", authState);
  console.log("🔔 notificationList from Redux:", notificationList);
  console.log("🔔 notificationListErr:", notificationListErr);
  console.log("🔔 loader:", loader);

  const [notifications, setNotifications] = useState<{
    today: Notification[];
    yesterday: Notification[];
  }>({
    today: [],
    yesterday: [],
  });
  const [refreshing, setRefreshing] = useState(false);

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications();
  }, []);

  // Update notifications when Redux state changes
  useEffect(() => {
    console.log("🔔 NotificationScreen: notificationList changed:", notificationList);
    console.log("🔔 NotificationScreen: isArray?", Array.isArray(notificationList));
    console.log("🔔 NotificationScreen: length?", notificationList?.length);
    
    if (notificationList && Array.isArray(notificationList)) {
      console.log("🔔 NotificationScreen: Organizing notifications...");
      organizeNotifications(notificationList);
    } else {
      console.log("🔔 NotificationScreen: No valid notification data");
    }
  }, [notificationList]);

  const loadNotifications = () => {
    dispatch(onGetNotificationList({ page: 1, limit: 50 }));
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const organizeNotifications = (notificationData: any[]) => {
    console.log("🔔 organizeNotifications: Received data:", notificationData);
    console.log("🔔 organizeNotifications: Data length:", notificationData?.length);
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayNotifications: Notification[] = [];
    const yesterdayNotifications: Notification[] = [];

    notificationData.forEach((notification, index) => {
      console.log(`🔔 Processing notification ${index}:`, notification);
      
      // Map API response fields to expected interface
      const mappedNotification: Notification = {
        id: notification._id || notification.id,
        title: notification.title,
        message: notification.message,
        time: notification.createdAt || notification.time || new Date().toISOString(),
        isUnread: notification.isRead === "0" || notification.isRead === 0,
        type: notification.notificationType || notification.type,
        createdAt: notification.createdAt || new Date().toISOString(),
      };

      console.log(`🔔 Mapped notification ${index}:`, mappedNotification);

      const notificationDate = new Date(mappedNotification.createdAt || mappedNotification.time);
      console.log(`🔔 Notification date:`, notificationDate);
      console.log(`🔔 Today:`, today.toDateString());
      console.log(`🔔 Yesterday:`, yesterday.toDateString());
      console.log(`🔔 Notification date string:`, notificationDate.toDateString());
      
      // For now, add all notifications to today to test if data is being processed
      console.log(`🔔 Adding to today (test):`, mappedNotification.title);
      todayNotifications.push({
        ...mappedNotification,
        time: formatTimeAgo(notificationDate),
      });
      
      // Original date-based logic (commented out for testing)
      // if (notificationDate.toDateString() === today.toDateString()) {
      //   console.log(`🔔 Adding to today:`, mappedNotification.title);
      //   todayNotifications.push({
      //     ...mappedNotification,
      //     time: formatTimeAgo(notificationDate),
      //   });
      // } else if (notificationDate.toDateString() === yesterday.toDateString()) {
      //   console.log(`🔔 Adding to yesterday:`, mappedNotification.title);
      //   yesterdayNotifications.push({
      //     ...mappedNotification,
      //     time: formatTimeAgo(notificationDate),
      //   });
      // } else {
      //   console.log(`🔔 Notification not in today/yesterday:`, mappedNotification.title);
      // }
    });

    console.log("🔔 Final today notifications:", todayNotifications);
    console.log("🔔 Final yesterday notifications:", yesterdayNotifications);

    setNotifications({
      today: todayNotifications,
      yesterday: yesterdayNotifications,
    });
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  const handleNotificationPress = (notificationId: string) => {
    // Mark notification as read via API
    dispatch(onMarkNotificationAsRead({ notificationId }));

    // Update local state immediately for better UX
    setNotifications((prev) => {
      const updated = { ...prev };
      (Object.keys(updated) as Array<keyof typeof updated>).forEach(
        (section) => {
          updated[section] = updated[section].map((notification: Notification) =>
            notification.id === notificationId
              ? { ...notification, isUnread: false }
              : notification
          );
        }
      );
      return updated;
    });
  };

  const renderNotificationSection = (
    title: string,
    notificationList: Notification[]
  ) => {
    if (notificationList.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {notificationList.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onPress={() => handleNotificationPress(notification.id)}
          />
        ))}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyMessage}>
        You don't have any notifications yet. We'll notify you when something important happens!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "ios" ? "transparent" : "transparent"}
        translucent={true}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.statusBar}></View>
            <BackButton navigation={navigation} />
            <Text style={styles.title}>Notification</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.white}
                colors={[colors.white]}
              />
            }
          >
            {notifications.today.length === 0 && notifications.yesterday.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                {renderNotificationSection("Today", notifications.today)}
                {renderNotificationSection("Yesterday", notifications.yesterday)}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default NotificationScreen;
