import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import PlusIcon from "../assets/svg/plusIcon";
import styles from "./HeaderStyles";

interface HeaderProps {
  userName: string;
  onAddPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onAddPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Hello, {userName}! 👋</Text>
        <Text style={styles.subtitleText}>
          Manage your club, events & bookings effortlessly.
        </Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <PlusIcon />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
