import { View, Text } from "react-native";
import React from "react";
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
import styles from "./styles";

const HomeBottomTabNavigator = (props: BottomTabBarProps) => {
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
                    styles.iconWrapper,
                    isFocused && styles.selectedIconWrapper,
                  ]}
                >
                  {index == 0 ? (
                    isFocused ? (
                      <SelectHome width={24} height={24} />
                    ) : (
                      <HomeIcon color="#CDD0D5" width={24} height={24} />
                    )
                  ) : index == 1 ? (
                    isFocused ? (
                      <SelectFavourite width={24} height={24} />
                    ) : (
                      <FavouriteIcon color="#CDD0D5" width={24} height={24} />
                    )
                  ) : index == 2 ? (
                    isFocused ? (
                      <SelectBookings width={24} height={24} />
                    ) : (
                      <BookingIcon color="#CDD0D5" width={24} height={24} />
                    )
                  ) : index == 3 ? (
                    isFocused ? (
                      <SelectChat width={24} height={24} />
                    ) : (
                      <ChatIcon color="#CDD0D5" width={24} height={24} />
                    )
                  ) : isFocused ? (
                    <SelectProfile width={24} height={24} />
                  ) : (
                    <ProfileIcon color="#CDD0D5" width={24} height={24} />
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
