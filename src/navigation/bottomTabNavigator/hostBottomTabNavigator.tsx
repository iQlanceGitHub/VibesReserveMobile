import { View, Text } from "react-native";
import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import HomeFillIcon from "../../assets/svg/homeFillIcon";
import HomeUnFillIcon from "../../assets/svg/homeUnFillIcon";
import TaskFillIcon from "../../assets/svg/taskFillIcon";
import TaskUnFillIcon from "../../assets/svg/taskUnFillIcon";
import NotificationFillIcon from "../../assets/svg/notificationFillIcon";
import NotificationUnFillIcon from "../../assets/svg/notificationUnFillIcon";
import ProfileFillIcon from "../../assets/svg/profileFillIcon";
import ProfileUnFillIcon from "../../assets/svg/profileUnFillIcon";

import styles from "./styles";
import * as appConstant from "../../utilis/appConstant";
import { colors } from "../../utilis/colors";

const HostBottomTabNavigator = (props: BottomTabBarProps) => {
  return (
    <View style={styles.mainContainerTab}>
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
                style={styles.tabIconContainer}
                onTouchEnd={onPress}
              >
                <View
                  style={[
                    { padding: 5 },
                    isFocused && styles.selectedIconWrapper,
                  ]}
                >
                  {index == 0 ? (
                    isFocused ? (
                      <HomeFillIcon
                        width={appConstant.verticalScale(24)}
                        height={appConstant.horizontalScale(24)}
                      />
                    ) : (
                      <HomeUnFillIcon />
                    )
                  ) : index == 1 ? (
                    isFocused ? (
                      <TaskFillIcon
                        width={appConstant.verticalScale(24)}
                        height={appConstant.horizontalScale(24)}
                      />
                    ) : (
                      <TaskUnFillIcon />
                    )
                  ) : index == 2 ? (
                    isFocused ? (
                      <NotificationFillIcon
                        width={appConstant.verticalScale(24)}
                        height={appConstant.horizontalScale(24)}
                      />
                    ) : (
                      <NotificationUnFillIcon
                        color={colors.gray100}
                        width={appConstant.verticalScale(24)}
                        height={appConstant.horizontalScale(24)}
                      />
                    )
                  ) : isFocused ? (
                    <ProfileFillIcon
                      width={appConstant.verticalScale(24)}
                      height={appConstant.horizontalScale(24)}
                    />
                  ) : (
                    <ProfileUnFillIcon
                      color={colors.gray100}
                      width={appConstant.verticalScale(24)}
                      height={appConstant.horizontalScale(24)}
                    />
                  )}
                </View>
                {isFocused && <View style={styles.selectedIndicator} />}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
export default HostBottomTabNavigator;
