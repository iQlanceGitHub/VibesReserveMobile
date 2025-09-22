import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Easing,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../../../utilis/colors';
import { fonts } from '../../../../../utilis/fonts';
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from '../../../../../utilis/appConstant';
import { BackButton } from '../../../../../components/BackButton';
import styles from './styles';

const { width, height } = Dimensions.get('window');

const UpcomingScreen: React.FC = () => {
  const navigation = useNavigation();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations when component mounts
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Fade in and scale up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Continuous rotation animation for the icon
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    pulseAnimation.start();
    rotateAnimation.start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton
          navigation={navigation}
          onBackPress={() => navigation?.goBack()}
        />
        <Text style={styles.headerTitle}>Coming Soon</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Animated Icon Container */}
        {/* <Animated.View 
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { scale: pulseAnim },
                { rotate: rotateInterpolate }
              ]
            }
          ]}
        > */}
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🚧</Text>
          </View>
        {/* </Animated.View> */}

        {/* Main Title */}
        <Animated.View 
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0]
              })}]
            }
          ]}
        >
          <Text style={styles.mainTitle}>Feature Coming Soon</Text>
          <Text style={styles.subTitle}>Under Development</Text>
        </Animated.View>

        {/* Description */}
        <Animated.View 
          style={[
            styles.descriptionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })}]
            }
          ]}
        >
          <Text style={styles.description}>
            We're working hard to bring you amazing new features. 
            Stay tuned for updates!
          </Text>
        </Animated.View>


        {/* Back Button */}
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0]
              })}]
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

export default UpcomingScreen;
