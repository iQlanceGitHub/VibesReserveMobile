import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import HomeIcon from "../../assets/svg/homeIcon";
import FavouriteIcon from "../../assets/svg/favouriteIcon";
import BookingIcon from "../../assets/svg/bookingIcon";
import ChatIcon from "../../assets/svg/chatIcon";
import ProfileIcon from "../../assets/svg/profileIcon";
import SelectHome from "../../assets/svg/selectHome";
import SelectFavourite from "../../assets/svg/selectFavourite";
import SelectBookings from "../../assets/svg/selectBookings";
import SelectChat from "../../assets/svg/selectChat";
import SelectProfile from "../../assets/svg/selectProfile";
import UnreadBadge from "../../components/UnreadBadge";
import { calculateTotalUnreadCount } from "../../utilis/chatUtils";
import { store } from "../../reduxSaga/StoreProvider";
import styles from "./styles";
import * as appConstant from "../../utilis/appConstant";
import { colors } from "../../utilis/colors";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeBottomTabNavigator = (props: BottomTabBarProps) => {
  console.log('🔄 HomeBottomTabNavigator re-rendered at:', new Date().toISOString());
  
  // Force re-render every 5 seconds to test
  const [forceRender, setForceRender] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setForceRender(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Get safe area insets for Android 15 compatibility
  const insets = useSafeAreaInsets();
  
  // Get chat list from Redux state - use direct store access with state tracking
  const [chatList, setChatList] = useState<any[]>([]);
  
  // Update chat list from store
  useEffect(() => {
    
    const updateChatList = () => {
      const currentState = (store as any).getState();
      const newChatList = currentState.auth?.chatList || [];
      
      setChatList(newChatList);
    };
    
    // Initial update
   
    updateChatList();
    
    // Subscribe to store changes
    const unsubscribe = (store as any).subscribe(updateChatList);
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Debug: Log current chat list state
  
  // Calculate total unread count
  const totalUnreadCount = calculateTotalUnreadCount(chatList);
  
  // Debug: Log unread count calculation
  

  // Track chat list changes


  
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
                    styles.iconWrapper,
                    isFocused && styles.selectedIconWrapper,
                  ]}
                >
                  {index == 0 ? (
                    isFocused ? (
                      <SelectHome width={appConstant.verticalScale(24)} height={appConstant.horizontalScale(24)} />
                    ) : (
                      <HomeIcon color={colors.gray100} width={appConstant.verticalScale(24)} height={appConstant.horizontalScale(24)} />
                    )
                  ) : index == 1 ? (
                    isFocused ? (
                      <SelectFavourite width={appConstant.verticalScale(24)} height={appConstant.horizontalScale(24)} />
                    ) : (
                      <FavouriteIcon color={colors.gray100} width={appConstant.verticalScale(24)} height={appConstant.horizontalScale(24)} />
                    )
                  ) : index == 2 ? (
                    isFocused ? (
                      <SelectBookings width={appConstant.verticalScale(24)} height={appConstant.horizontalScale(24)} />
                    ) : (
                      <BookingIcon color={colors.gray100} width={appConstant.verticalScale(24)} height={appConstant.horizontalScale(24)} />
                    )
                  ) : index == 3 ? (
                    <View style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
                      {isFocused ? (
                        <SelectChat width={appConstant.verticalScale(24)} height={appConstant.horizontalScale(24)} />
                      ) : (
                        <ChatIcon color={colors.gray100} width={appConstant.verticalScale(24)} height={appConstant.horizontalScale(24)} />
                      )}
                      <UnreadBadge count={totalUnreadCount} size="small" />
                    </View>
                  ) : isFocused ? (
                    <SelectProfile width={appConstant.verticalScale(24)} height={appConstant.horizontalScale(24)} />
                  ) : (
                    <ProfileIcon color={colors.gray100} width={appConstant.verticalScale(24)} height={appConstant.horizontalScale(24)} />
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
export default HomeBottomTabNavigator;
