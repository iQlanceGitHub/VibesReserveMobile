import {
    Modal,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Animated,
  } from 'react-native';
  import { getHeight, getWidth, useTheme } from '../utilis/appConstant';
  import { colors } from '../utilis/colors';
  import { fonts } from '../utilis/fonts';
  import { Buttons } from './buttons';
  import React, { useState, useRef } from 'react';
  import Icon from 'react-native-vector-icons/MaterialIcons';

  interface CustomAlertDualBtnProps {
    isVisible: boolean;
    name: string;
    title?: string;
    subtitle?: string;
    description?: string;
    button1Text: string;
    button2Text?: string;
    onButton1Press: () => void;
    onButton2Press?: () => void;
    onEditPress?: () => void;
    message: string;

  }
  
  export const CustomAlertDualBtn: React.FC<CustomAlertDualBtnProps> = ({
    isVisible,
    title = "What's your first name?",
    subtitle = "Full Name",
    description = "This is how it'll appear on your profile.",
    name = "Mike",
    button1Text = "Let's Go",
    button2Text = "Edit Name",
    onButton1Press,
    onButton2Press,
    onEditPress,
    message,
  }) => {
    const theme = useTheme();
  
    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
      >
        <View style={[styles.modalContainer, { backgroundColor: theme === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(66, 65, 72, 0.9)', }]}>
          <View style={[styles.alertContainer, { backgroundColor: theme === 'light' ? colors.gradiantMixture : colors.primary_blue }]}>
           
           
            
            <View style={styles.welcomeContainer}>
            {title != '' ? 
              <Text style={[styles.welcomeText, { color: theme === 'light' ? colors.black : colors.white }]}>
                {title}
              </Text> : null}
             {message != '' ? 
             <Text style={[styles.infoText, { color: theme === 'light' ? colors.black : colors.lightGray }]}>
             {message}
            </Text> : null} 
            </View>
            
            <View style={styles.buttonsContainer}>
               <Buttons
                title={button1Text}
                onPress={onButton1Press}
                style={styles.btn}
                txtStyle={styles.btnText}
                isCap={false}
              />
              <View style={{width: getWidth(2)}}></View>
              <Buttons
                title={button2Text}
                onPress={onButton2Press}
                style={styles.btn2}
                txtStyle={styles.btnText2}
                isCap={false}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };


  interface CustomAlertDualBtnWithTooltipProps {
    isVisible: boolean;
    name: string;
    title?: string;
    subtitle?: string;
    description?: string;
    button1Text: string;
    button2Text?: string;
    onButton1Press: () => void;
    onButton2Press?: () => void;
    onEditPress?: () => void;
    message: string;
    tooltipText?: string; // Add tooltip text prop
  }
  
  export const CustomAlertDualBtnWithTooltip: React.FC<CustomAlertDualBtnWithTooltipProps> = ({
    isVisible,
    title = "What's your first name?",
    subtitle = "Full Name",
    description = "This is how it'll appear on your profile.",
    name = "Mike",
    button1Text = "Let's Go",
    button2Text = "Edit Name",
    onButton1Press,
    onButton2Press,
    onEditPress,
    message,
    tooltipText = "We use location to help you find people near you.", // Default tooltip text
  }) => {
    const theme = useTheme();
    const [showTooltip, setShowTooltip] = useState(true); // Default visible
    const fadeAnim = useRef(new Animated.Value(1)).current; // Start fully visible
    
  
    const showTooltipWithDelay = () => {
      setShowTooltip(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };
    
    const hideTooltip = () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShowTooltip(false);
      });
    };

    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
      >
        <View style={[styles.modalContainer, { backgroundColor: theme === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(66, 65, 72, 0.9)' }]}>
          <View style={[styles.alertContainer, { backgroundColor: theme === 'light' ? colors.gradiantMixture : colors.primary_blue }]}>
            
            <View style={styles.welcomeContainer}>
              {title != '' && 
                <Text style={[styles.welcomeText, { color: theme === 'light' ? colors.black : colors.white }]}>
                  {title}
                </Text>
              }
              {message != '' && 
                <Text style={[styles.infoText, { color: theme === 'light' ? colors.black : colors.lightGray }]}>
                  {message}
                </Text>
              } 
            </View>
              
              <View style={{width: getWidth(2), alignItems: 'center'}}></View>
               <Buttons
                  title={button2Text}
                  onPress={onButton2Press}
                  onLongPress={showTooltipWithDelay}
                  onPressIn={showTooltipWithDelay}
                  style={styles.btn2}
                  txtStyle={styles.btnText2}
                  isCap={false}
                />
                
                {showTooltip && (
                  <Animated.View style={[styles.tooltip, { opacity: fadeAnim }]}>
                    <Text style={styles.tooltipText}>{tooltipText}</Text>
                    <View style={styles.tooltipArrow} />
                  </Animated.View>
                )}
            </View>
          </View>
        {/* </View> */}
      </Modal>
    );
  };

  interface CustomAlertSingleBtnProps {
    isVisible: boolean;
    name: string;
    title?: string;
    subtitle?: string;
    description?: string;
    button1Text: string;
    button2Text?: string;
    onButton1Press: () => void;
    onButton2Press?: () => void;
    onEditPress?: () => void;
    message: string;

  }
  
  export const CustomAlertSingleBtn: React.FC<CustomAlertSingleBtnProps> = ({
    isVisible,
    title = "What's your first name?",
    subtitle = "Full Name",
    description = "This is how it'll appear on your profile.",
    name = "Mike",
    button1Text = "Let's Go",
    button2Text = "Edit Name",
    onButton1Press,
    onButton2Press,
    onEditPress,
    message,
  }) => {
    const theme = useTheme();
  
    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
      >
        <View style={[styles.modalContainer, { backgroundColor: theme === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(66, 65, 72, 0.9)', }]}>
          <View style={[styles.alertContainer, { backgroundColor: theme === 'light' ? colors.white : colors.primary_blue }]}>
           
           
            
            <View style={styles.welcomeContainer}>
            {title != '' ? 
              <Text style={[styles.welcomeText, { color: theme === 'light' ? colors.black : colors.white }]}>
                {title}
              </Text> : null}
             {message != '' ? 
             <Text style={[styles.infoText, { color: theme === 'light' ? colors.black : colors.lightGray }]}>
             {message}
            </Text> : null} 
              {/* <Text style={[styles.infoText, { color: theme === 'light' ? colors.black : colors.lightGray }]}>
                But let's get your profile set up first.
              </Text> */}
            </View>
            
            <View style={styles.buttonsContainer}>
              {/* <TouchableOpacity 
                style={styles.editButton} 
                onPress={onEditPress || onButton2Press}
              >
                <Text style={[styles.editButtonText, { color: colors.black }]}>
                  {button2Text}
                </Text>
              </TouchableOpacity> */}
               {/* <Buttons
                title={button1Text}
                onPress={onButton1Press}
                style={styles.btn}
                txtStyle={styles.btnText}
              />
              <View style={{width: getWidth(2)}}></View> */}
              <Buttons
                title={button2Text}
                onPress={onButton2Press}
                style={styles.btn3}
                isCap={false}
                txtStyle={styles.btnText2}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: getWidth(5),
    },
    alertContainer: {
      width: '100%',
      maxWidth: 400,
      borderRadius: 16,
      paddingHorizontal: getWidth(6),
      paddingVertical: getHeight(4),
      alignItems: 'center',
    },
    title: {
      fontSize: getWidth(5),
      fontFamily: fonts.semiBold,
      textAlign: 'center',
      marginBottom: getHeight(2),
    },
    nameInputContainer: {
      width: '100%',
      marginBottom: getHeight(3),
    },
    subtitle: {
      fontSize: getWidth(3.5),
      fontFamily: fonts.reguler,
      marginBottom: getHeight(1),
    },
    nameDisplay: {
      borderBottomWidth: 1,
      borderBottomColor: colors.lightGray,
      paddingVertical: getHeight(1),
    },

    welcomeContainer: {
      width: '100%',
      marginBottom: getHeight(2),
      alignItems :'center'
    },
    welcomeText: {
      fontSize: getWidth(5),
      fontFamily: fonts.semiBold,
      marginBottom: getHeight(1),
textAlign: 'center'
    },
    infoText: {
      fontSize: getWidth(3.8),
      fontFamily: fonts.reguler,
      marginBottom: getHeight(0.5),
      textAlign: 'center'
    },
    buttonsContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    editButton: {
      padding: getHeight(2),
    },
    editButtonText: {
      fontSize: getWidth(4),
      fontFamily: fonts.semiBold,
      borderColor: colors.black,
      borderWidth: 1,
      padding: getHeight(2)
    },
    primaryButton: {
      flex: 1,
      marginLeft: getWidth(4),
      backgroundColor: colors.violate,
      borderRadius: 8,
      paddingVertical: getHeight(2),
    },
    primaryButtonText: {
      color: colors.white,
      fontSize: getWidth(4),
      fontFamily: fonts.semiBold,
    },

    btn: {
        width: getWidth(38),
        height: 50,
        backgroundColor: colors.white,
        borderColor: colors.black,
        borderWidth: 1,
      },
      btnText: {
        color: colors.black,
        fontSize: 16,
        fontFamily: fonts.semiBold,
        marginTop: getHeight(0.2)
      },
      
      btn3: {
        width: getWidth(76),
        height: 50,
        backgroundColor: colors.violate,
      },
      btn2: {
        width: getWidth(38),
        height: 50,
        backgroundColor: colors.violate,
      },
      btnText2: {
        color: colors.white,
        fontSize: 16,
        fontFamily: fonts.semiBold,
        marginTop: getHeight(0.2)
      },
      buttonWrapper: {
        flex: 1,
        position: 'relative',
      },
      infoIcon: {
        position: 'absolute',
        right: 10,
        top: '50%',
        marginTop: -10, // Half of icon size to center vertically
      },
      tooltip: {
        position: 'absolute',
        bottom: getHeight(-12), // Position below button
        left: getWidth(30),
        backgroundColor: '#333',
        borderRadius: 8,
        padding: 12,
        zIndex: 100,
      },
      tooltipText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        width: 90
      },
      tooltipArrow: {
        position: 'absolute',
        top: -10,
        alignSelf: 'center',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#333',
      },
  });