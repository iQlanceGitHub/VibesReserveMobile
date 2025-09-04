import { createActions } from "redux-actions";

export const {
  clearAuthStore,

  onStatus,

  setUser,

  displayLoading,
  internetConnectivity,

  onSignup,
  signupData,
  signupError,

  onSignin,
  signinData,
  signinError,

  onResendVerifyOtp,
  resendVerifyOtpData,
  resendVerifyOtpError,

  onVerifyEmail,
  verifyEmailData,
  verifyEmailError,

  onSendOtp,
  sendOtpData,
  sendOtpError,

  onVerifyOtp,
  verifyOtpData,
  verifyOtpError,

  onResetPassword,
  resetPasswordData,
  resetPasswordError,

  onSocialLogin,
  socialLoginData,
  socialLoginError,

  onUpdateProfileFields,
  updateProfileFieldsData,
  updateProfileFieldsError,

  onProfile,
  profileData,
  profileError,

  onLogout,
  logoutData,
  logoutError,

  onGetDynamicContent,
  getDynamicContentData,
  getDynamicContentError,

  setLoginToken,

  setLoginUserDetails,
} = createActions(
  "CLEAR_AUTH_STORE",

  "ON_STATUS",

  "SET_USER",

  "DISPLAY_LOADING",
  "INTERNET_CONNECTIVITY",

  "ON_SIGNUP",
  "SIGNUP_DATA",
  "SIGNUP_ERROR",

  "ON_SIGNIN",
  "SIGNIN_DATA",
  "SIGNIN_ERROR",

  "ON_RESEND_VERIFY_OTP",
  "RESEND_VERIFY_OTP_DATA",
  "RESEND_VERIFY_OTP_ERROR",

  "ON_VERIFY_EMAIL",
  "VERIFY_EMAIL_DATA",
  "VERIFY_EMAIL_ERROR",

  "ON_SEND_OTP",
  "SEND_OTP_DATA",
  "SEND_OTP_ERROR",

  "ON_VERIFY_OTP",
  "VERIFY_OTP_DATA",
  "VERIFY_OTP_ERROR",

  "ON_RESET_PASSWORD",
  "RESET_PASSWORD_DATA",
  "RESET_PASSWORD_ERROR",

  "ON_SOCIAL_LOGIN",
  "SOCIAL_LOGIN_DATA",
  "SOCIAL_LOGIN_ERROR",

  "ON_UPDATE_PROFILE_FIELDS",
  "UPDATE_PROFILE_FIELDS_DATA",
  "UPDATE_PROFILE_FIELDS_ERROR",

  "ON_PROFILE",
  "PROFILE_DATA",
  "PROFILE_ERROR",

  "ON_LOGOUT",
  "LOGOUT_DATA",
  "LOGOUT_ERROR",

  "ON_GET_DYNAMIC_CONTENT",
  "GET_DYNAMIC_CONTENT_DATA",
  "GET_DYNAMIC_CONTENT_ERROR",

  "SET_LOGIN_TOKEN",

  "SET_LOGIN_USER_DETAILS"
);
