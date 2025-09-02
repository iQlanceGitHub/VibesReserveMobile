import {
  Modal,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { getHeight, getWidth, colors, fonts, useTheme } from '../utils/appConstant';
import { Buttons } from './buttons';
import React, { useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as appConstant from "../utils/appConstant";


interface CustomAlertIcebreakerProps {
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

export const CustomAlertIcebreaker: React.FC<CustomAlertIcebreakerProps> = ({
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

          <Image
            resizeMode='contain'
            style={styles.lockImg}
            source={theme === 'light' ? require('../assets/images/Home/ic_heart_unlock_dark.png') : require('../assets/images/Home/ic_heart_unlock_dark.png')}
          //ic_lock_dark.png
          />

          <View style={styles.welcomeContainer}>
            {title != '' ?
              <Text style={[styles.welcomeText, { color: theme === 'light' ? colors.black : colors.white }]}>
                {title}
              </Text> : null}
            {message != '' ?
              <Text style={[styles.infoText, { color: theme === 'light' ? colors.black : colors.lightGray }]}>
                {message}
              </Text> : null}
            <Text style={[styles.infoText, { color: theme === 'light' ? colors.black : colors.lightGray, fontWeight: 800, fontSize: appConstant.verticalScale(18)}]}>
            Next up: Deeper Dive questions!
              </Text>
          </View>

          <View style={styles.buttonsContainer}>

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




interface CustomAlertDeeperProps {
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

export const CustomAlertDeeper: React.FC<CustomAlertDeeperProps> = ({
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

          <Image
            resizeMode='contain'
            style={styles.lockImg}
            source={theme === 'light' ? require('../assets/images/Home/ic_heart_unlock_dark.png') : require('../assets/images/Home/ic_heart_unlock_dark.png')}
          //ic_lock_dark.png
          />

          <View style={styles.welcomeContainer}>
            {title != '' ?
              <Text style={[styles.welcomeText, { color: theme === 'light' ? colors.black : colors.white }]}>
                {title}
              </Text> : null}
              
            {message != '' ?
              // <Text style={[styles.infoText, { color: theme === 'light' ? colors.black : colors.violate }]}>
              //   {message}
              // </Text>
              <Text style={[styles.infoText, { color: theme === 'light' ? colors.black : colors.white }]}>
                Curiosity Score:  
                <Text style={[styles.infoText, { color: theme === 'light' ? colors.black : colors.violate }]}>
                    {' ' + message}%
                </Text>
            </Text>
               : null}
            <Text style={[styles.infoText, { color: theme === 'light' ? colors.black : colors.lightGray, fontWeight: 400, fontSize: appConstant.verticalScale(16)}]}>
            You both enjoy board games and rainy days.
              </Text>

              <Text style={[styles.infoTextSubDiscription, { color: theme === 'light' ? colors.black : colors.lightGray, fontWeight: 600, fontSize: appConstant.verticalScale(18)}]}>
              Wildcard questions await…
              </Text>
          </View>

          <View style={styles.buttonsContainer}>

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





interface CustomAlertVaultUnlockedProps {
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

export const CustomAlertVaultUnlocked: React.FC<CustomAlertVaultUnlockedProps> = ({
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

          <Image
            resizeMode='contain'
            style={styles.lockImg}
            source={theme === 'light' ? require('../assets/images/Home/ic_heart_unlock_dark.png') : require('../assets/images/Home/ic_heart_unlock_dark.png')}
          //ic_lock_dark.png
          />

          <View style={styles.welcomeContainer}>
            {title != '' ?
              <Text style={[styles.welcomeText, { color: theme === 'light' ? colors.black : colors.white }]}>
                {title}
              </Text> : null}
              
            {message != '' ?
              // <Text style={[styles.infoText, { color: theme === 'light' ? colors.black : colors.violate }]}>
              //   {message}
              // </Text>
              <Text style={[styles.infoText, { color: theme === 'light' ? colors.black : colors.white }]}>
                 
                <Text style={[styles.infoText, { color: theme === 'light' ? colors.black : colors.violate }]}>
                    {' ' + message}
                </Text>
            </Text>
               : null}
            <Text style={[styles.infoText, { color: theme === 'light' ? colors.black : colors.lightGray, fontWeight: 400, fontSize: appConstant.verticalScale(16)}]}>
            {`You can send something playful to your match during your conversation.

You’ve completed all rounds of curiozzity.

Full profiles and photos are now revealed. Let the real conversation begin!`}
              </Text>
          </View>

          <View style={styles.buttonsContainer}>

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
 
  lockImg: {
    width: appConstant.verticalScale(112),
    height: appConstant.horizontalScale(112),
    marginBottom: appConstant.horizontalScale(10),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: appConstant.verticalScale(24),
    alignSelf: 'center',
  },
  alertContainer: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    paddingHorizontal: appConstant.verticalScale(35),
    paddingVertical: appConstant.horizontalScale(24),
    alignItems: 'center',
  },

  welcomeContainer: {
    width: '100%',
    marginBottom: appConstant.horizontalScale(12),
    alignItems: 'center',
    marginTop: appConstant.horizontalScale(12),
  },
  welcomeText: {
    fontSize: appConstant.verticalScale(24),
    fontFamily: fonts.semiBold,
    marginBottom: appConstant.horizontalScale(12),
    textAlign: 'center',
    fontWeight: 700,
  },
  infoText: {
    fontSize: appConstant.verticalScale(16),
    fontFamily: fonts.reguler,
    marginBottom: appConstant.horizontalScale(12),
    textAlign: 'center',
    fontWeight: 400,
    lineHeight: appConstant.horizontalScale(16),
  },
  infoTextSubDiscription: {
    fontSize: appConstant.verticalScale(18),
    fontFamily: fonts.reguler,
    marginBottom: appConstant.horizontalScale(12),
    textAlign: 'center',
    fontWeight: 600,
    
  },

  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn3: {
    width: appConstant.verticalScale(234),
    height: appConstant.horizontalScale(45),
    backgroundColor: colors.violate,
  },
  btnText2: {
    color: colors.white,
    fontSize: appConstant.verticalScale(16),
    fontFamily: fonts.semiBold,
    //marginTop: appConstant.horizontalScale(2)
  },
});