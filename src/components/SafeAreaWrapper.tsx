import React from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  statusBarBackgroundColor?: string;
  translucent?: boolean;
  style?: any;
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  backgroundColor = 'transparent',
  statusBarStyle = 'light-content',
  statusBarBackgroundColor = 'transparent',
  translucent = true,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[{ flex: 1, backgroundColor }, style]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarBackgroundColor}
        translucent={translucent}
        // Enhanced StatusBar configuration for Android 15
        {...(Platform.OS === 'android' && {
          statusBarTranslucent: true,
          statusBarBackgroundColor: 'transparent',
        })}
      />
      <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        {children}
      </View>
    </View>
  );
};

export default SafeAreaWrapper;
