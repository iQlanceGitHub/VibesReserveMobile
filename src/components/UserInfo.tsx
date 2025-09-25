import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { colors } from "../utilis/colors";
import ChatIcon from "../assets/svg/chatIcon";
import PhoneIconNew from "../assets/svg/phoneIconNew";
import { userInfoStyles } from "./userInfoStyles";

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
    <View style={userInfoStyles.container}>
      <Text style={userInfoStyles.sectionTitle}>User</Text>
      <View style={userInfoStyles.userContainer}>
        <Image source={userImage} style={userInfoStyles.profileImage} />
        <Text style={userInfoStyles.userName}>{userName}</Text>
        <View style={userInfoStyles.actionButtons}>
          <TouchableOpacity
            style={userInfoStyles.actionButton}
            onPress={onChatPress}
          >
            <ChatIcon size={20} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={userInfoStyles.actionButton}
            onPress={onCallPress}
          >
            <PhoneIconNew size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserInfo;
