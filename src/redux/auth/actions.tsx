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

  onForgotPassword,
  forgotPasswordData,
  forgotPasswordError,

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

  onUpdateLocation,
  updateLocationData,
  updateLocationError,

  onHome,
  homeData,
  homeError,

  onFilter,
  filterData,
  filterError,

  onViewdetails,
  viewdetailsData,
  viewdetailsError,

  onCategory,
  categoryData,
  categoryError,

  onFacility,
  facilityData,
  facilityError,

  onTogglefavorite,
  togglefavoriteData,
  togglefavoriteError,

  onFavoriteslist,
  favoriteslistData,
  favoriteslistError,

  onBookingrequest,
  bookingrequestData,
  bookingrequestError,

  onAcceptreject,
  acceptrejectData,
  acceptrejectError,

  onCreateevent,
  createeventData,
  createeventError,

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

  'ON_FORGOT_PASSWORD',
  'FORGOT_PASSWORD_DATA',
  'FORGOT_PASSWORD_ERROR',

  'ON_SEND_OTP',
  'SEND_OTP_DATA',
  'SEND_OTP_ERROR',

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

  "ON_UPDATE_LOCATION",
  "UPDATE_LOCATION_DATA",
  "UPDATE_LOCATION_ERROR",

  'ON_HOME',
  'HOME_DATA',
  'HOME_ERROR',

  'ON_FILTER',
  'FILTER_DATA',
  'FILTER_ERROR',

  'ON_VIEWDETAILS',
  'VIEWDETAILS_DATA',
  'VIEWDETAILS_ERROR',

  'ON_CATEGORY',
  'CATEGORY_DATA',
  'CATEGORY_ERROR',

  'ON_FACILITY',
  'FACILITY_DATA',
  'FACILITY_ERROR',

  'ON_TOGGLEFAVORITE',
  'TOGGLEFAVORITE_DATA',
  'TOGGLEFAVORITE_ERROR',

  'ON_FAVORITESLIST',
  'FAVORITESLIST_DATA',
  'FAVORITESLIST_ERROR',

  'ON_BOOKINGREQUEST',
  'BOOKINGREQUEST_DATA',
  'BOOKINGREQUEST_ERROR',

  'ON_ACCEPTREJECT',
  'ACCEPTREJECT_DATA',
  'ACCEPTREJECT_ERROR',

  'ON_CREATEEVENT',
  'CREATEEVENT_DATA',
  'CREATEEVENT_ERROR',

  "SET_LOGIN_TOKEN",

  "SET_LOGIN_USER_DETAILS"
);
