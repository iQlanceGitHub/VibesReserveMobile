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

  onHomenew,
  homenewData,
  homenewError,

  onFilter,
  filterData,
  filterError,

  onViewdetails,
  viewdetailsData,
  viewdetailsError,

  onGetDetailEvent,
  getDetailEventData,
  getDetailEventError,

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

  onBookingDetail,
  bookingDetailData,
  bookingDetailError,

  onReviewSummary,
  reviewSummaryData,
  reviewSummaryError,

  getBookingList,
  bookingListData,
  bookingListError,

  onHostProfile,
  hostProfileData,
  hostProfileError,

  onCreateBooking,
  createBookingData,
  createBookingError,

  onFetchPromoCodes,
  fetchPromoCodesData,
  fetchPromoCodesError,

  onApplyPromoCode,
  applyPromoCodeData,
  applyPromoCodeError,

  onGetProfileDetail,
  getProfileDetailData,
  getProfileDetailError,

  onUpdateProfile,
  updateProfileData,
  updateProfileError,

  onCheckBookedDateBooth,
  checkBookedDateBoothData,
  checkBookedDateBoothError,

  onRatingReview,
  ratingReviewData,
  ratingReviewError,

  onCancelBooking,
  cancelBookingData,
  cancelBookingError,

  // Chat Actions
  onSendMessage,
  sendMessageData,
  sendMessageError,

  onGetConversation,
  getConversationData,
  getConversationError,

  onGetChatList,
  getChatListData,
  getChatListError,

  onStartLongPolling,
  onStopLongPolling,
  onUpdateMessages,

  onCheckBookedDate,
  checkBookedDateData,
  checkBookedDateError,

  setLoginToken,

  setLoginUserDetails,

  setDeviceToken,

  // Notification Actions
  onGetNotificationList,
  getNotificationListData,
  getNotificationListError,

  onMarkNotificationAsRead,
  markNotificationAsReadData,
  markNotificationAsReadError,

  // Chat Click Trigger Actions
  onChatClick,
  chatClickData,
  chatClickError,

  onListEvent,
  listEventData,
  listEventError,

  onGetPromoCodes,
  getPromoCodesData,
  getPromoCodesError,

  onCreateHelpSupport,
  createHelpSupportData,
  createHelpSupportError,

  onEditPromoCode,
  editPromoCodeData,
  editPromoCodeError,

  onCreatePromoCode,
  createPromoCodeData,
  createPromoCodeError,

  onDeletePromoCode,
  deletePromoCodeData,
  deletePromoCodeError,
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

  "ON_FORGOT_PASSWORD",
  "FORGOT_PASSWORD_DATA",
  "FORGOT_PASSWORD_ERROR",

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

  "ON_UPDATE_LOCATION",
  "UPDATE_LOCATION_DATA",
  "UPDATE_LOCATION_ERROR",

  "ON_HOME",
  "HOME_DATA",
  "HOME_ERROR",

  "ON_HOMENEW",
  "HOMENEW_DATA",
  "HOMENEW_ERROR",

  "ON_FILTER",
  "FILTER_DATA",
  "FILTER_ERROR",

  "ON_VIEWDETAILS",
  "VIEWDETAILS_DATA",
  "VIEWDETAILS_ERROR",

  "ON_GET_DETAIL_EVENT",
  "GET_DETAIL_EVENT_DATA",
  "GET_DETAIL_EVENT_ERROR",

  "ON_CATEGORY",
  "CATEGORY_DATA",
  "CATEGORY_ERROR",

  "ON_FACILITY",
  "FACILITY_DATA",
  "FACILITY_ERROR",

  "ON_TOGGLEFAVORITE",
  "TOGGLEFAVORITE_DATA",
  "TOGGLEFAVORITE_ERROR",

  "ON_FAVORITESLIST",
  "FAVORITESLIST_DATA",
  "FAVORITESLIST_ERROR",

  "ON_BOOKINGREQUEST",
  "BOOKINGREQUEST_DATA",
  "BOOKINGREQUEST_ERROR",

  "ON_CREATE_BOOKING",
  "CREATE_BOOKING_DATA",
  "CREATE_BOOKING_ERROR",

  "ON_FETCH_PROMO_CODES",
  "FETCH_PROMO_CODES_DATA",
  "FETCH_PROMO_CODES_ERROR",

  "ON_APPLY_PROMO_CODE",
  "APPLY_PROMO_CODE_DATA",
  "APPLY_PROMO_CODE_ERROR",

  "ON_GET_PROFILE_DETAIL",
  "GET_PROFILE_DETAIL_DATA",
  "GET_PROFILE_DETAIL_ERROR",

  "ON_UPDATE_PROFILE",
  "UPDATE_PROFILE_DATA",
  "UPDATE_PROFILE_ERROR",

  "ON_CHECK_BOOKED_DATE_BOOTH",
  "CHECK_BOOKED_DATE_BOOTH_DATA",
  "CHECK_BOOKED_DATE_BOOTH_ERROR",

  "ON_CHECK_BOOKED_DATE",
  "CHECK_BOOKED_DATE_DATA",
  "CHECK_BOOKED_DATE_ERROR",

  "ON_RATING_REVIEW",
  "RATING_REVIEW_DATA",
  "RATING_REVIEW_ERROR",

  "ON_CANCEL_BOOKING",
  "CANCEL_BOOKING_DATA",
  "CANCEL_BOOKING_ERROR",

  "ON_ACCEPTREJECT",
  "ACCEPTREJECT_DATA",
  "ACCEPTREJECT_ERROR",

  "ON_CREATEEVENT",
  "CREATEEVENT_DATA",
  "CREATEEVENT_ERROR",

  "ON_BOOKING_DETAIL",
  "BOOKING_DETAIL_DATA",
  "BOOKING_DETAIL_ERROR",

  "ON_REVIEW_SUMMARY",
  "REVIEW_SUMMARY_DATA",
  "REVIEW_SUMMARY_ERROR",

  "GET_BOOKING_LIST",
  "BOOKING_LIST_DATA",
  "BOOKING_LIST_ERROR",

  "ON_HOST_PROFILE",
  "HOST_PROFILE_DATA",
  "HOST_PROFILE_ERROR",

  // Chat Action Types
  "ON_SEND_MESSAGE",
  "SEND_MESSAGE_DATA",
  "SEND_MESSAGE_ERROR",

  "ON_GET_CONVERSATION",
  "GET_CONVERSATION_DATA",
  "GET_CONVERSATION_ERROR",

  "ON_GET_CHAT_LIST",
  "GET_CHAT_LIST_DATA",
  "GET_CHAT_LIST_ERROR",

  "ON_START_LONG_POLLING",
  "ON_STOP_LONG_POLLING",
  "ON_UPDATE_MESSAGES",

  "ON_CHECK_BOOKED_DATE",
  "CHECK_BOOKED_DATE_DATA",
  "CHECK_BOOKED_DATE_ERROR",

  "SET_LOGIN_TOKEN",

  "SET_LOGIN_USER_DETAILS",

  "SET_DEVICE_TOKEN",

  // Notification Action Types
  "ON_GET_NOTIFICATION_LIST",
  "GET_NOTIFICATION_LIST_DATA",
  "GET_NOTIFICATION_LIST_ERROR",

  "ON_MARK_NOTIFICATION_AS_READ",
  "MARK_NOTIFICATION_AS_READ_DATA",
  "MARK_NOTIFICATION_AS_READ_ERROR",

  // Chat Click Trigger Action Types
  "ON_CHAT_CLICK",
  "CHAT_CLICK_DATA",
  "CHAT_CLICK_ERROR",
  // List Event Action Types
  "ON_LIST_EVENT",
  "LIST_EVENT_DATA",
  "LIST_EVENT_ERROR",

  // Get Promo Codes Action Types,
  "ON_GET_PROMO_CODES",
  "GET_PROMO_CODES_DATA",
  "GET_PROMO_CODES_ERROR",

  // Create Help Support Action Types
  "ON_CREATE_HELP_SUPPORT",
  "CREATE_HELP_SUPPORT_DATA",
  "CREATE_HELP_SUPPORT_ERROR",

  // Edit Promo Code Action Types
  "ON_EDIT_PROMO_CODE",
  "EDIT_PROMO_CODE_DATA",
  "EDIT_PROMO_CODE_ERROR",

  // Create Promo Code Action Types
  "ON_CREATE_PROMO_CODE",
  "CREATE_PROMO_CODE_DATA",
  "CREATE_PROMO_CODE_ERROR",

  // Delete Promo Code Action Types
  "ON_DELETE_PROMO_CODE",
  "DELETE_PROMO_CODE_DATA",
  "DELETE_PROMO_CODE_ERROR"
);
