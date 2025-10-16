import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import PlusIcon from "../assets/svg/plusIcon";
import NotificationUnFillIcon from "../assets/svg/notificationUnFillIcon";
import styles from "./HeaderStyles";

interface HeaderProps {
  userName: string;
  onAddPress: () => void;
  onNotificationPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onAddPress, onNotificationPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Hello, {userName}! 👋</Text>
        <Text style={styles.subtitleText}>
          Manage your club, events & bookings effortlessly.
        </Text>
      </View>

      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
          <NotificationUnFillIcon width={24} height={24} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <PlusIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
