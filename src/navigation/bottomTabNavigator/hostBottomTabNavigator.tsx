import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import HomeFillIcon from "../../assets/svg/homeFillIcon";
import HomeUnFillIcon from "../../assets/svg/homeUnFillIcon";
import TaskFillIcon from "../../assets/svg/taskFillIcon";
import TaskUnFillIcon from "../../assets/svg/taskUnFillIcon";
import NotificationFillIcon from "../../assets/svg/notificationFillIcon";
import NotificationUnFillIcon from "../../assets/svg/notificationUnFillIcon";
import ProfileFillIcon from "../../assets/svg/profileFillIcon";
import ProfileUnFillIcon from "../../assets/svg/profileUnFillIcon";
import SelectChat from "../../assets/svg/selectChat";
import ChatIcon from "../../assets/svg/chatIcon";
import UnreadBadge from "../../components/UnreadBadge";
import { store } from "../../reduxSaga/StoreProvider";
import { onChatClick, chatClickData } from "../../redux/auth/actions";
import globalUnreadCountService from "../../services/globalUnreadCountService";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import styles from "./styles";
import * as appConstant from "../../utilis/appConstant";
import { colors } from "../../utilis/colors";

const HostBottomTabNavigator = (props: BottomTabBarProps) => {
  // Get safe area insets for Android 15 compatibility
  const insets = useSafeAreaInsets();
  
  // Use global unread count service
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Subscribe to global unread count updates
  useEffect(() => {
    console.log('Host bottom tab: Subscribing to global unread count service...');
    
    // Get initial count
    setUnreadCount(globalUnreadCountService.getUnreadCount());
    
    // Subscribe to updates
    const unsubscribe = globalUnreadCountService.subscribe((count: number) => {
      console.log('Host bottom tab: Received unread count update:', count);
      setUnreadCount(count);
    });
    
    return () => {
      console.log('Host bottom tab: Unsubscribing from global service...');
      unsubscribe();
    };
  }, []);

  // Listen for chat click actions and trigger force update
  useEffect(() => {
    const unsubscribe = (store as any).subscribe(() => {
      const currentState = (store as any).getState();
      const chatClick = currentState.auth?.chatClick;
      
      if (chatClick && chatClick !== "") {
        console.log('Host: Chat click detected, forcing global update...');
        globalUnreadCountService.forceUpdate();
        
        // Clear the chat click state to prevent repeated triggers
        (store as any).dispatch(chatClickData(""));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  // Debug: Log current unread count
  console.log('Host bottom tab: Current unread count:', unreadCount);

  return (
    <View style={[
      styles.mainContainerTab,
      { 
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }
    ]}>
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
                    <View style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
                      {isFocused ? (
                        <SelectChat width={appConstant.verticalScale(24)} height={appConstant.horizontalScale(24)} />
                      ) : (
                        <ChatIcon color={colors.gray100} width={appConstant.verticalScale(24)} height={appConstant.horizontalScale(24)} />
                      )}
                      <UnreadBadge count={unreadCount} size="small" />
                    </View>
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
