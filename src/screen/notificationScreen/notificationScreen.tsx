import React, { useState, useEffect, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
  const authState = useSelector((state: any) => state.auth);
  const { notificationList, notificationListErr, loader } = authState;
  
  // Debug Redux state

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

  // Focus effect to refresh notifications when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  // Update notifications when Redux state changes
  useEffect(() => {
    if (notificationList && Array.isArray(notificationList)) {
      organizeNotifications(notificationList);
    } else if (notificationListErr) {
      console.log('Notification list error:', notificationListErr);
      // Handle error state if needed
    }
  }, [notificationList, notificationListErr]);

  const loadNotifications = () => {
    dispatch(onGetNotificationList({ page: 1, limit: 50 }));
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const organizeNotifications = (notificationData: any[]) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayNotifications: Notification[] = [];
    const yesterdayNotifications: Notification[] = [];

    notificationData.forEach((notification) => {
      // Map API response fields to expected interface
      const mappedNotification: Notification = {
        id: notification._id || notification.id || `notification_${Date.now()}`,
        title: notification.title || "Notification",
        message: notification.message || notification.description || "You have a new notification",
        time: notification.createdAt || notification.time || new Date().toISOString(),
        isUnread: notification.isRead === "0" || notification.isRead === 0 || notification.isRead === false,
        type: notification.notificationType || notification.type || "general",
        createdAt: notification.createdAt || new Date().toISOString(),
      };

      const notificationDate = new Date(mappedNotification.createdAt || mappedNotification.time);
      
      // Organize by date
      if (notificationDate.toDateString() === today.toDateString()) {
        todayNotifications.push({
          ...mappedNotification,
          time: formatTimeAgo(notificationDate),
        });
      } else if (notificationDate.toDateString() === yesterday.toDateString()) {
        yesterdayNotifications.push({
          ...mappedNotification,
          time: formatTimeAgo(notificationDate),
        });
      } else {
        // For older notifications, add to yesterday section
        yesterdayNotifications.push({
          ...mappedNotification,
          time: formatTimeAgo(notificationDate),
        });
      }
    });

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
        backgroundColor="transparent"
        translucent={true}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top,  }]}>
          <View style={styles.header}>
            <BackButton navigation={navigation} />
            <Text style={styles.title}>Notification</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
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
