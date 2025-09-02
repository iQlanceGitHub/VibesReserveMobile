import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  KeyboardTypeOptions,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  PixelRatio,
} from 'react-native';
import {HelperText, TextInput} from 'react-native-paper';
import {parentStyles, textstyles} from '../../../utils/schema/commonStyles';
import {
  colors,
  fonts,
  getWidth,
  images,
  keyboardType,
} from '../../../utils/constants/appConstants';
import {shallowEqual} from 'react-redux';
import i18n from '../../../translations/i18n';

interface CustomTextInputProps {
  editable?: boolean;
  value: string;
  kType?: KeyboardTypeOptions;
  maxLength?: number;
  multiline?: boolean;
  error: boolean;
  label: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  style?: object;
  message: string;
  leftImage: string;
  rightImageShow?: boolean;
}

export const CustomeTextInput: React.FC<CustomTextInputProps> = ({
  editable,
  error,
  label,
  message,
  onChangeText,
  placeholder,
  style,
  value,
  kType,
  maxLength,
  multiline,
  leftImage,
  rightImageShow = false,
}) => {
  return (
    <View style={{flex: 1}}>
      <TextInput
        editable={editable}
        theme={{colors: {text: colors.grey_text}}}
        autoCorrect={false}
        value={value}
        mode="outlined"
        maxLength={kType == keyboardType.email_address ? 80 : maxLength}
        multiline={multiline}
        keyboardType={kType}
        label={' ' + label}
        placeholder={
          kType == keyboardType.email_address
            ? i18n.t('email_address')
            : placeholder
        }
        keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
        onChangeText={onChangeText}
        outlineColor={error == true ? colors.red : colors.light_primary}
        activeOutlineColor={error == true ? colors.red : colors.dark_primary}
        cursorColor={colors.grey_text}
        style={[
          {
            backgroundColor: colors.white,
            fontFamily: fonts.reguler,
            color: colors.grey_text,
            fontSize: 15,
          },
          style,
        ]}
        placeholderTextColor={colors.grey}
        outlineStyle={{
          borderRadius: 32,
          borderWidth: error == true ? 1 : 1,
        }}
        contentStyle={{
          color: colors.dark_primary,
          fontFamily: fonts.reguler,
          fontSize: 15,
        }}
        left={
          <TextInput.Icon
            icon={leftImage}
            color={colors.purple_primary} // Add this line to set the color
          />
        }
        right={
          rightImageShow == true && (
            <TextInput.Icon
              icon={images.ic_arrow_down}
              size={15}
              color={colors.dark_primary} // Add this line to set the color
            />
          )
        }
      />
      {error ? (
        <HelperText
          style={{
            color: colors.red,
            flex: 1,
          }}
          type="error"
          visible={error}>
          {message !== '' ? `${message}` : `${label} field is required`}
        </HelperText>
      ) : null}
    </View>
  );
};
interface CustomPhoneNumberInputProps {
  editable?: boolean;
  value: string;
  kType?: KeyboardTypeOptions;
  maxLength?: number;
  multiline?: boolean;
  error: boolean;
  label: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onPressPhoneCode: () => void;
  phoneCode?: string;
  style?: object;
  message: string;
}

export const CustomPhoneNumberInput: React.FC<CustomPhoneNumberInputProps> = ({
  editable,
  error,
  label,
  message,
  onChangeText,
  placeholder,
  style,
  value,
  kType,
  maxLength,
  multiline,
  onPressPhoneCode,
  phoneCode = '00',
}) => {
  const internalInputRef = useRef();
  return (
    <View style={[style]}>
      <View
        style={{
          zIndex: 1,
          position: 'absolute',
          height: '100%',
          width: '20%',

          justifyContent: 'space-evenly',
        }}>
        <Pressable
          style={{
            alignItems: 'center',
            height: '100%',
          }}
          onPress={onPressPhoneCode}>
          <View
            style={{
              flexDirection: 'row',

              marginTop: 20,
            }}>
            <Text
              style={[textstyles.medium, {fontSize: 15}]}
              children={phoneCode}
            />
            <Image
              style={{
                width: 12,
                marginLeft: phoneCode.length > 4 ? 2 : 5,
                resizeMode: 'contain',
                alignSelf: 'center',
                tintColor: colors.grey_text,
              }}
              source={images.ic_arrow_down}
            />
          </View>
        </Pressable>
      </View>

      <TextInput
        ref={internalInputRef}
        mode="outlined"
        maxLength={12}
        // error={props.error}
        value={value}
        keyboardType={keyboardType.phone_pad}
        label={label}
        placeholder={label}
        onChangeText={data => {
          onChangeText(data.replace(/[^0-9]/g, ''));
        }}
        outlineColor={error == true ? colors.red : colors.light_primary}
        activeOutlineColor={error == true ? colors.red : colors.dark_primary}
        cursorColor={colors.grey}
        style={{
          paddingLeft: '15%',
          backgroundColor: 'white',
          fontFamily: fonts.medium,
          fontSize: 15,
        }}
        placeholderTextColor={colors.grey}
        outlineStyle={{
          borderRadius: 32,
          borderWidth: error == true ? 1 : 1,
        }}
        contentStyle={{
          fontFamily: fonts.reguler,
          fontSize: 15,
        }}
      />
      {error ? (
        <HelperText
          style={{
            color: colors.red,
            flex: 1,
          }}
          type="error"
          visible={error}>
          {message !== '' ? `${message}` : `${label} field is required`}
        </HelperText>
      ) : null}
    </View>
  );
};

interface CustomPasswordTextInputProps {
  value: string;
  kType?: KeyboardTypeOptions;
  maxLength?: number;
  multiline?: boolean;
  error: boolean;
  label: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  style: object;
  message: string;
  leftImage: string;
}

export const CustomePasswordTextInput: React.FC<
  CustomPasswordTextInputProps
> = ({
  error,
  label,
  maxLength,
  message,
  multiline,
  onChangeText,
  placeholder,
  style,
  value,
  kType = 'default',
  leftImage,
}) => {
  const [secure, setSecure] = useState(true);
  const onEyePress = () => {
    setSecure(!secure);
  };
  return (
    <View>
      <TextInput
        secureTextEntry={secure}
        theme={{colors: {text: colors.grey_text}}}
        autoCorrect={false}
        value={value}
        mode="outlined"
        maxLength={kType == keyboardType.email_address ? 80 : maxLength}
        multiline={multiline}
        keyboardType={kType}
        label={' ' + label}
        placeholder={
          kType == keyboardType.email_address
            ? i18n.t('email_address')
            : placeholder
        }
        onChangeText={onChangeText}
        outlineColor={error == true ? colors.red : colors.light_primary}
        activeOutlineColor={error == true ? colors.red : colors.dark_primary}
        cursorColor={colors.grey_text}
        style={[
          {
            backgroundColor: colors.white,
            fontFamily: fonts.reguler,
            color: colors.grey_text,
            fontSize: 15,
          },
          style,
        ]}
        placeholderTextColor={colors.grey}
        outlineStyle={{
          borderRadius: 32,
          borderWidth: error == true ? 1 : 1,
        }}
        contentStyle={{
          color: colors.dark_primary,
          fontFamily: fonts.reguler,
          fontSize: 15,
        }}
        right={
          <TextInput.Icon
            icon={secure ? images.ic_close_eye : images.ic_open_eye}
            onPress={onEyePress}
          />
        }
        left={
          <TextInput.Icon
            icon={leftImage}
            onPress={() => console.log('')}
            color={colors.purple_primary} // Add this line to set the color
          />
        }
      />
      {error ? (
        <HelperText style={{color: colors.red}} type="error" visible={error}>
          {message != '' ? `${message}` : `${label} field is required`}
        </HelperText>
      ) : null}
    </View>
  );
};

interface SearchBarTextInputProps {
  editable?: boolean;
  value: string;
  kType?: KeyboardTypeOptions;
  maxLength?: number;
  multiline?: boolean;

  placeholder?: string;
  onChangeText: (text: string) => void;
  style?: object;
}

export const SearchBarTextInput: React.FC<SearchBarTextInputProps> = ({
  value,

  onChangeText,
  kType,
  maxLength,
  multiline,
  placeholder,
  style,
}) => {
  return (
    <View>
      <TextInput
        autoCorrect={false}
        value={value}
        maxLength={maxLength}
        multiline={multiline}
        keyboardType={kType}
        placeholder={placeholder}
        onChangeText={onChangeText}
        cursorColor={colors.dark_primary}
        style={[
          {
            backgroundColor: '#F2F2F2',
            fontFamily: fonts.reguler,
            color: colors.dark_primary,
            fontSize: 14,
          },
          style,
        ]}
        placeholderTextColor={colors.grey_text}
        contentStyle={{
          color: colors.dark_primary,
          fontFamily: fonts.reguler,
          fontSize: 14,
        }}
      />
    </View>
  );
};
