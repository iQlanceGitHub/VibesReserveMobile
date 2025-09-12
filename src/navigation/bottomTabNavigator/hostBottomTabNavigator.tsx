import { View } from "react-native";
import React from "react";
import styles from "./styles";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import LikeSelectedIcon from "../../assets/svg/like-selected-icon";
import SearchSelectedIcon from "../../assets/svg/search-selected-icon";
import MatchSelectedIcon from "../../assets/svg/match-selected-icon";
import ChatSelectedIcon from "../../assets/svg/chat-selected-icon";
import ProfileSelectedIcon from "../../assets/svg/propfile-selected-icon";
import LikeUnSelectedIcon from "../../assets/svg/like-unSelected-icon";
import SearchUnSelectedIcon from "../../assets/svg/search-unSelected-icon";
import MatchUnSelectedIcon from "../../assets/svg/match-unSelected-icon";
import ChatUnSelectedIcon from "../../assets/svg/chat-unSelected-icon";
import ProfileUnSelectedIcon from "../../assets/svg/profile-unSelected-icon";
const hostBottomTabNavigator = (props: BottomTabBarProps) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.bottomTabContainer}>
        {props.state.routes.map((route, index) => {
          const isFocused = props.state.index === index;
          const onPress = () => {
            const event = props.navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              props.navigation.navigate(route.name);
            }
          };
          return (
            <View
              key={index}
              style={[styles.tabIconContainer]}
              onTouchEnd={onPress}
            >
              {index == 0 ? (
                isFocused ? (
                  <LikeSelectedIcon />
                ) : (
                  <LikeUnSelectedIcon />
                )
              ) : index == 1 ? (
                isFocused ? (
                  <SearchSelectedIcon />
                ) : (
                  <SearchUnSelectedIcon />
                )
              ) : index == 2 ? (
                isFocused ? (
                  <MatchSelectedIcon />
                ) : (
                  <MatchUnSelectedIcon />
                )
              ) : index == 3 ? (
                isFocused ? (
                  <ChatSelectedIcon />
                ) : (
                  <ChatUnSelectedIcon />
                )
              ) : isFocused ? (
                <ProfileSelectedIcon />
              ) : (
                <ProfileUnSelectedIcon />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};
export default hostBottomTabNavigator;
