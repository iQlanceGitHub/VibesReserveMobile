import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../utilis/colors";
import { fonts } from "../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../utilis/appConstant";
import ChatIcon from "../assets/svg/chatIcon";
import PhoneIconNew from "../assets/svg/phoneIconNew";

interface UserInfoProps {
  userName: string;
  userImage: any;
  onChatPress: () => void;
  onCallPress: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({
  userName,
  userImage,
  onChatPress,
  onCallPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>User</Text>
      <View style={styles.userContainer}>
        <Image source={userImage} style={styles.profileImage} />
        <Text style={styles.userName}>{userName}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={onChatPress}>
            <ChatIcon size={20} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onCallPress}>
            <PhoneIconNew size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: fontScale(16),
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: verticalScale(12),
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: horizontalScale(45.46),
    height: verticalScale(45.46),
    borderRadius: verticalScale(25),
    marginRight: horizontalScale(12),
    borderWidth: 2,
    borderColor: colors.violate,
  },
  userName: {
    fontSize: fontScale(16),
    fontFamily: fonts.Bold,
    color: colors.white,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: horizontalScale(12),
  },
  actionButton: {
    width: horizontalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(20),
    backgroundColor: colors.addButtonBackground,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default UserInfo;
