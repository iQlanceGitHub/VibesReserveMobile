import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import styles from "./styles";
import { BackButton } from "../../components/BackButton";
import { NotificationItem } from "./notificationItem";

interface NotificationScreenProps {
  navigation?: any;
}

// Sample notification data
const notificationsData = {
  today: [
    {
      id: "1",
      title: "Club Booked Successfully",
      message:
        'You\'ve successfully booked a ticket for "DJ Night Fever" at Velvet Club.',
      time: "1h ago",
      isUnread: true,
      type: "booking",
    },
    {
      id: "2",
      title: "Dancing Event Nearby You",
      message:
        '"Salsa Night" is happening near you at Groove Lounge. Book now to reserve your spot',
      time: "1h ago",
      isUnread: true,
      type: "event",
    },
    {
      id: "3",
      title: "Event Review Request",
      message:
        'How was your experience at "Rock Beats Night"? Share your feedback with us!',
      time: "1h ago",
      isUnread: true,
      type: "review",
    },
  ],
  yesterday: [
    {
      id: "4",
      title: "Club Booked Successfully",
      message:
        'Your booking for "Bollywood Bash" at Club Mirage is confirmed. Get ready to party!',
      time: "1d ago",
      isUnread: true,
      type: "booking",
    },
  ],
};

const NotificationScreen: React.FC<NotificationScreenProps> = ({
  navigation,
}) => {
  const [notifications, setNotifications] = useState(notificationsData);

  const handleNotificationPress = (notificationId: string) => {
    // Mark notification as read
    setNotifications((prev) => {
      const updated = { ...prev };
      (Object.keys(updated) as Array<keyof typeof updated>).forEach(
        (section) => {
          updated[section] = updated[section].map((notification: any) =>
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
    notifications: typeof notificationsData.today
  ) => {
    if (notifications.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onPress={() => handleNotificationPress(notification.id)}
          />
        ))}
      </View>
    );
  };

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
          >
            {renderNotificationSection("Today", notifications.today)}
            {renderNotificationSection("Yesterday", notifications.yesterday)}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default NotificationScreen;
