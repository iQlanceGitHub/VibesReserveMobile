import React, { FC } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';
import { getHeight, getWidth, colors, useTheme } from '../utils/appConstant';
import LinearGradient from 'react-native-linear-gradient';
import { fonts } from "../utils/font";
import * as appConstant from "../utils/appConstant";


interface BackButtonProps {
  navigation: any;
  title?: string;
  onBackPress?: () => void;
}

export const BackButton: FC<BackButtonProps> = ({
  navigation,
  title = 'Hello',
  onBackPress,
}) => {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={
        theme === 'light'
          ? ['rgba(10, 7, 53, 0.07)', 'rgba(4, 2, 28, 0.03)']
          : ['rgba(10, 7, 53, 0.07)', 'rgba(4, 2, 28, 0.03)']
      }
      style={{ backgroundColor: theme === 'light' ?  colors.gradiantMixture : colors.primary_blue}}
    >
  <View style={[styles.parent, {
    backgroundColor: theme === 'light' ?  colors.gradiantMixture : colors.primary_blue
  }]}>
    <TouchableOpacity
      style={styles.viewContainer}
      onPress={onBackPress || (() => navigation.goBack())}
      hitSlop={{ top: 40, bottom: 10, left: 10, right: 10 }}
    >
      <Image
        source={theme === 'light'
          ? require('../assets/images/ic_back_dark.png')
          : require('../assets/images/ic_back.png')}
        style={styles.img}
        resizeMode="contain"
      />
    </TouchableOpacity>
    <Text
      style={[
        styles.txt,
        {
          color: theme === 'light' ? colors.fontgary : colors.white,
          fontFamily: fonts.reguler,
          fontSize: appConstant.horizontalScale(20),
          fontWeight: 900
        }
      ]}
      numberOfLines={1}
    >
      {title}
    </Text>
  </View ></LinearGradient >
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
  },
  parent: {
    width: '100%',
    paddingHorizontal: getWidth(6),
    paddingVertical: getHeight(4.5),
    flexDirection: 'row',
    alignItems: 'center',
    //borderBottomWidth: 1,
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    height: getHeight(6),
    width: getWidth(8),
    resizeMode: 'contain',
  },
  txt: {
    flex: 1,
    textAlign: 'center',
    marginRight: getWidth(8), // This balances the left icon space
    includeFontPadding: false, // Removes extra padding around text
    textAlignVertical: 'center',
  },
});