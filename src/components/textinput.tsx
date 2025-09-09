import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardTypeOptions,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  PixelRatio,
  Platform,
} from "react-native";
import { HelperText, TextInput } from "react-native-paper";
// import { parentStyles, textstyles } from "../../../utils/schema/commonStyles";

import { shallowEqual } from "react-redux";
import { colors } from "../utilis/colors";
import { keyboardType } from "../utilis/appConstant";
import { fonts } from "../utilis/fonts";
import EyeIcon from "../assets/svg/eyeIcon";
import EyeClosedIcon from "../assets/svg/eyeClosedIcon";
import CloseIcon from "../assets/svg/closeIcon";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

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
  leftImage: string | React.ReactNode;
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
    <View style={{ flex: 1 }}>
      <Text
        style={{
          color: colors.white,
          fontSize: 14,
          fontFamily: fonts.medium,
          marginBottom: 8,
        }}
      >
        {label.includes("(Optional)") ? (
          <>
            {label.replace(" (Optional)", "")}
            <Text style={{ color: "#868C98" }}> (Optional)</Text>
          </>
        ) : label.includes("*") ? (
          <>
            {label.replace(" *", "")}
            <Text style={{ color: "#868C98" }}> *</Text>
          </>
        ) : (
          label
        )}
      </Text>
      <View style={{ position: "relative" }}>
        {leftImage && typeof leftImage !== "string" && (
          <View
            style={{
              position: "absolute",
              left: 15,
              top: 18,
              zIndex: 1,
              width: 20,
              height: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {leftImage}
          </View>
        )}
        <TextInput
          editable={editable}
          theme={{ colors: { text: colors.darkGray } }}
          autoCorrect={false}
          value={value}
          mode="outlined"
          maxLength={kType == keyboardType.email_address ? 80 : maxLength}
          multiline={multiline}
          keyboardType={kType}
          placeholder={
            kType == keyboardType.email_address
              ? "Enter your email"
              : placeholder
          }
          keyboardType={
            Platform.OS === "ios" ? "ascii-capable" : "visible-password"
          }
          onChangeText={onChangeText}
          outlineColor={error == true ? colors.red : "#FFFFFF33"}
          activeOutlineColor={error == true ? colors.red : "#E2E4E9"}
          cursorColor={colors.white}
          style={[
            {
              backgroundColor: "transparent",
              fontFamily: fonts.reguler,
              color: colors.white,
              fontSize: 15,
              paddingLeft: leftImage && typeof leftImage !== "string" ? 30 : 15,
            },
            style,
          ]}
          placeholderTextColor={colors.textColor}
          outlineStyle={{
            borderRadius: 90,
            borderWidth: error == true ? 1 : 1,
          }}
          contentStyle={{
            color: colors.white,
            fontFamily: fonts.reguler,
            fontSize: 15,
          }}
          left={
            leftImage && typeof leftImage === "string" ? (
              <TextInput.Icon icon={leftImage} color={colors.white} />
            ) : undefined
          }
        // right={
        //   rightImageShow == true && (
        //     <TextInput.Icon
        //       icon={images.ic_arrow_down}
        //       size={15}
        //       color={colors.darkGray} // Add this line to set the color
        //     />
        //   )
        // }
        />
      </View>
      {error ? (
        <HelperText
          style={{
            color: colors.red,
            flex: 1,
          }}
          type="error"
          visible={error}
        >
          {message !== "" ? `${message}` : `${label.replace(/\* ?/g, "")} field is required`}
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
  phoneCode = "00",
}) => {
  const internalInputRef = useRef();
  return (
    <View style={[style]}>
      <Text
        style={{
          color: colors.white,
          fontSize: 14,
          fontFamily: fonts.medium,
          marginBottom: 8,
        }}
      >
        {label.includes("(Optional)") ? (
          <>
            {label.replace(" (Optional)", "")}
            <Text style={{ color: "#868C98" }}> (Optional)</Text>
          </>
        ) : label.includes("*") ? (
          <>
            {label.replace(" *", "")}
            <Text style={{ color: "#868C98" }}> *</Text>
          </>
        ) : (
          label
        )}
      </Text>
      <View
        style={{
          zIndex: 1,
          position: "absolute",
          height: "100%",
          width: "20%",
          top: 30,
          justifyContent: "space-evenly",
        }}
      >
        <Pressable
          style={{
            alignItems: "center",
            height: "100%",
          }}
          onPress={onPressPhoneCode}
        >
          <View
            style={{
              flexDirection: "row",

              marginTop: 20,
            }}
          >
            <Text
              // style={[textstyles.medium, { fontSize: 15 }]}
              children={phoneCode}
            />
            {/* <Image
              style={{
                width: 12,
                marginLeft: phoneCode.length > 4 ? 2 : 5,
                resizeMode: "contain",
                alignSelf: "center",
                tintColor: colors.darkGray,
              }}
              source={images.ic_arrow_down}
            /> */}
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
        placeholder={placeholder}
        onChangeText={(data) => {
          onChangeText(data.replace(/[^0-9]/g, ""));
        }}
        outlineColor={error == true ? colors.red : "#FFFFFF33"}
        activeOutlineColor={error == true ? colors.red : "#E2E4E9"}
        cursorColor={colors.white}
        style={{
          paddingLeft: "15%",
          backgroundColor: "transparent",
          fontFamily: fonts.medium,
          fontSize: 15,
        }}
        placeholderTextColor={colors.textColor}
        outlineStyle={{
          borderRadius: 90,
          borderWidth: error == true ? 1 : 1,
        }}
        contentStyle={{
          color: colors.white,
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
          visible={error}
        >
          {message !== "" ? `${message}` : `${label} field is required`}
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
  leftImage: string | React.ReactNode;
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
  kType = "default",
  leftImage,
}) => {
    const [secure, setSecure] = useState(true);
    const onEyePress = () => {
      setSecure(!secure);
    };
    return (
      <View>
        <Text
          style={{
            color: colors.white,
            fontSize: 14,
            fontFamily: fonts.medium,
            marginBottom: 8,
          }}
        >
          {label.includes("(Optional)") ? (
            <>
              {label.replace(" (Optional)", "")}
              <Text style={{ color: "#868C98" }}> (Optional)</Text>
            </>
          ) : label.includes("*") ? (
            <>
              {label.replace(" *", "")}
              <Text style={{ color: "#868C98" }}> *</Text>
            </>
          ) : (
            label
          )}
        </Text>
        <View style={{ position: "relative" }}>
          {leftImage && typeof leftImage !== "string" && (
            <View
              style={{
                position: "absolute",
                left: 15,
                top: 18,
                zIndex: 1,
                width: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {leftImage}
            </View>
          )}
          {value && value.length > 0 && (
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 15,
                top: 18,
                zIndex: 1,
                width: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={onEyePress}
            >
              {secure ? <EyeClosedIcon /> : <EyeIcon />}
            </TouchableOpacity>
          )}
          <TextInput
            secureTextEntry={secure}
            theme={{ colors: { text: colors.darkGray } }}
            autoCorrect={false}
            value={value}
            mode="outlined"
            maxLength={kType == keyboardType.email_address ? 80 : maxLength}
            multiline={multiline}
            keyboardType={kType}
            placeholder={
              kType == keyboardType.email_address
                ? "Enter your email"
                : placeholder
            }
            onChangeText={onChangeText}
            outlineColor={error == true ? colors.red : "#FFFFFF33"}
            activeOutlineColor={error == true ? colors.red : "#E2E4E9"}
            cursorColor={colors.white}
            style={[
              {
                backgroundColor: "transparent",
                fontFamily: fonts.reguler,
                color: colors.white,
                fontSize: 15,
                paddingLeft: leftImage && typeof leftImage !== "string" ? 30 : 15,
              },
              style,
            ]}
            placeholderTextColor={colors.textColor}
            outlineStyle={{
              borderRadius: 90,
              borderWidth: error == true ? 1 : 1,
            }}
            contentStyle={{
              color: colors.white,
              fontFamily: fonts.reguler,
              fontSize: 15,
            }}
            left={
              leftImage && typeof leftImage === "string" ? (
                <TextInput.Icon
                  icon={leftImage}
                  onPress={() => console.log("")}
                  color={colors.white}
                />
              ) : undefined
            }
          />
        </View>
        {error ? (
          <HelperText style={{ color: colors.red }} type="error" visible={error}>
            {message != "" ? `${message}` : `${label} field is required`}
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
        cursorColor={colors.primary_blue}
        style={[
          {
            backgroundColor: "#F2F2F2",
            fontFamily: fonts.reguler,
            color: colors.darkGray,
            fontSize: 14,
          },
          style,
        ]}
        placeholderTextColor={colors.darkGray}
        contentStyle={{
          color: colors.darkGray,
          fontFamily: fonts.reguler,
          fontSize: 14,
        }}
      />
    </View>
  );
};


interface CustomeSearchTextInputProps {
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
  leftImage: string | React.ReactNode;
}

export const CustomeSearchTextInput: React.FC<
  CustomeSearchTextInputProps
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
  kType = "default",
  leftImage,
}) => {
    const [secure, setSecure] = useState(true);
    const onEyePress = () => {
      setSecure(!secure);
    };
    return (
      <View>
        <Text
          style={{
            color: colors.white,
            fontSize: 14,
            fontFamily: fonts.medium,
            marginBottom: 8,
          }}
        >
          {label.includes("(Optional)") ? (
            <>
              {label.replace(" (Optional)", "")}
              <Text style={{ color: "#868C98" }}> (Optional)</Text>
            </>
          ) : label.includes("*") ? (
            <>
              {label.replace(" *", "")}
              <Text style={{ color: "#868C98" }}> *</Text>
            </>
          ) : (
            label
          )}
        </Text>
        <View style={{ position: "relative" }}>
          {leftImage && typeof leftImage !== "string" && (
            <View
              style={{
                position: "absolute",
                left: 15,
                top: 18,
                zIndex: 1,
                width: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {leftImage}
            </View>
          )}
          {value && value.length > 0 && (
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 15,
                top: 18,
                zIndex: 1,
                width: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={onEyePress}
            >
              {secure ? <CloseIcon /> : <CloseIcon />}
            </TouchableOpacity>
          )}
          <TextInput
            secureTextEntry={secure}
            theme={{ colors: { text: colors.darkGray } }}
            autoCorrect={false}
            value={value}
            mode="outlined"
            maxLength={kType == keyboardType.email_address ? 80 : maxLength}
            multiline={multiline}
            keyboardType={kType}
            placeholder={
              kType == keyboardType.email_address
                ? "Enter your email"
                : placeholder
            }
            onChangeText={onChangeText}
            outlineColor={error == true ? colors.red : "#FFFFFF33"}
            activeOutlineColor={error == true ? colors.red : "#E2E4E9"}
            cursorColor={colors.white}
            style={[
              {
                backgroundColor: "transparent",
                fontFamily: fonts.reguler,
                color: colors.white,
                fontSize: 15,
                paddingLeft: leftImage && typeof leftImage !== "string" ? 30 : 15,
              },
              style,
            ]}
            placeholderTextColor={colors.textColor}
            outlineStyle={{
              borderRadius: 90,
              borderWidth: error == true ? 1 : 1,
            }}
            contentStyle={{
              color: colors.white,
              fontFamily: fonts.reguler,
              fontSize: 15,
            }}
            left={
              leftImage && typeof leftImage === "string" ? (
                <TextInput.Icon
                  icon={leftImage}
                  onPress={() => console.log("")}
                  color={colors.white}
                />
              ) : undefined
            }
          />
        </View>
        {error ? (
          <HelperText style={{ color: colors.red }} type="error" visible={error}>
            {message != "" ? `${message}` : `${label} field is required`}
          </HelperText>
        ) : null}
      </View>
    );
  };