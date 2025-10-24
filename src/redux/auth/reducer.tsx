import produce from "immer";

import { handleActions } from "redux-actions";

import {
  displayLoading,
  onStatus,
  setUser,
  internetConnectivity,
  signupData,
  signupError,
  signinData,
  signinError,
  resendVerifyOtpData,
  resendVerifyOtpError,
  verifyEmailData,
  verifyEmailError,
  sendOtpData,
  sendOtpError,
  verifyOtpData,
  verifyOtpError,
  forgotPasswordData,
  forgotPasswordError,
  resetPasswordData,
  resetPasswordError,
  socialLoginData,
  socialLoginError,
  updateProfileFieldsData,
  updateProfileFieldsError,
  profileData,
  profileError,
  logoutData,
  logoutError,
  deleteAccountData,
  deleteAccountError,
  getCmsContentData,
  getCmsContentError,
  resendEmailData,
  resendEmailError,

  getDynamicContentData,
  getDynamicContentError,
  updateLocationData,
  updateLocationError,
  homeData,
  homeError,
  homenewData,
  homenewError,
  filterData,
  filterError,
  viewdetailsData,
  viewdetailsError,
  getDetailEventData,
  getDetailEventError,
  updateEventData,
  updateEventError,
  deleteEventPartData,
  deleteEventPartError,
  deleteEventData,
  deleteEventError,
  switchRoleData,
  switchRoleError,
  categoryData,
  categoryError,
  facilityData,
  facilityError,
  togglefavoriteData,
  togglefavoriteError,
  favoriteslistData,
  favoriteslistError,
  bookingrequestData,
  bookingrequestError,
  acceptrejectData,
  acceptrejectError,
  createeventData,
  createeventError,
  bookingDetailData,
  bookingDetailError,
  reviewSummaryData,
  reviewSummaryError,
  hostProfileData,
  hostProfileError,
  createBookingData,
  createBookingError,
  fetchPromoCodesData,
  fetchPromoCodesError,
  applyPromoCodeData,
  applyPromoCodeError,
  getProfileDetailData,
  getProfileDetailError,
  updateProfileData,
  updateProfileError,
  checkBookedDateBoothData,
  checkBookedDateBoothError,
  checkBookedDateData,
  checkBookedDateError,
  ratingReviewData,
  ratingReviewError,
  cancelBookingData,
  cancelBookingError,
  bookingListData,
  bookingListError,
  // Chat imports
  sendMessageData,
  sendMessageError,
  getConversationData,
  getConversationError,
  getChatListData,
  getChatListError,
  onUpdateMessages,
  setDeviceToken,
  // Notification imports
  getNotificationListData,
  getNotificationListError,
  markNotificationAsReadData,
  markNotificationAsReadError,
  // Chat Click imports
  chatClickData,
  chatClickError,
  // List Event imports
  listEventData,
  listEventError,
  // Get Promo Codes imports
  getPromoCodesData,
  getPromoCodesError,
  // Create Help Support imports
  createHelpSupportData,
  createHelpSupportError,
  // Edit Promo Code imports
  editPromoCodeData,
  editPromoCodeError,
  // Create Promo Code imports
  createPromoCodeData,
  createPromoCodeError,
  // Delete Promo Code imports
  deletePromoCodeData,
  deletePromoCodeError,
  // Nearby Host View All imports
  nearbyHostViewAllData,
  nearbyHostViewAllError,
} from "./actions";

export const initialState = {
  loader: false,
  status: false,
  internetConnection: false,
  signup: "",
  signupErr: "",
  signin: "",
  signinErr: "",
  resendVerifyOtp: "",
  resendVerifyOtpErr: "",
  verifyEmail: "",
  verifyEmailErr: "",
  sendOtp: "",
  sendOtpErr: "",
  verifyOtp: "",
  verifyOtpErr: "",

  forgotPassword: "",
  forgotPasswordErr: "",

  resetPassword: "",
  resetPasswordErr: "",
  socialLogin: "",
  socialLoginErr: "",
  updateProfileFields: "",
  updateProfileFieldsErr: "",
  profile: "",
  profileErr: "",
  logout: "",
  logoutErr: "",

  deleteAccount: "",
  deleteAccountErr: "",

  cmsContent: "",
  cmsContentErr: "",

  resendEmail: "",
  resendEmailErr: "",
  getDynamicContent: "",
  getDynamicContentErr: "",
  updateLocation: "",
  updateLocationErr: "",

  home: "",
  homeErr: "",

  homenew: "",
  homenewErr: "",

  filter: "",
  filterErr: "",

  viewdetails: "",
  viewdetailsErr: "",

  getDetailEvent: "",
  getDetailEventErr: "",

  updateEvent: "",
  updateEventErr: "",
  deleteEventPart: "",
  deleteEventPartErr: "",
  deleteEvent: "",
  deleteEventErr: "",
  switchRole: "",
  switchRoleErr: "",

  category: "",
  categoryErr: "",

  facility: "",
  facilityErr: "",

  togglefavorite: "",
  togglefavoriteErr: "",

  favoriteslist: "",
  favoriteslistErr: "",

  bookingrequest: "",
  bookingrequestErr: "",

  acceptreject: "",
  acceptrejectErr: "",

  createevent: "",
  createeventErr: "",

  bookingDetail: "",
  bookingDetailErr: "",

  reviewSummary: "",
  reviewSummaryErr: "",

  hostProfile: "",
  hostProfileErr: "",
  createBooking: "",
  createBookingErr: "",

  fetchPromoCodes: "",
  fetchPromoCodesErr: "",

  applyPromoCode: "",
  applyPromoCodeErr: "",

  getProfileDetail: "",
  getProfileDetailErr: "",

  updateProfile: "",
  updateProfileErr: "",

  checkBookedDateBooth: "",
  checkBookedDateBoothErr: "",

  checkBookedDate: "",
  checkBookedDateErr: "",

  ratingReview: "",
  ratingReviewErr: "",

  cancelBooking: "",
  cancelBookingErr: "",

  bookingList: null,
  bookingListErr: null,

  // Chat state
  sendMessage: "",
  sendMessageErr: "",
  conversation: [],
  conversationErr: "",
  chatList: [],
  chatListErr: "",
  isLongPollingActive: false,
  lastMessageTimestamp: null,

  user: "",
  deviceToken: "",

  // Notification state
  notificationList: [],
  notificationListErr: "",
  markNotificationAsRead: "",
  markNotificationAsReadErr: "",

  // Chat Click state
  chatClick: "",
  chatClickErr: "",
  // List Event state
  listEvent: null,
  listEventErr: "",

  // Get Promo Codes state
  getPromoCodes: null,
  getPromoCodesErr: "",

  // Create Help Support state
  createHelpSupport: "",
  createHelpSupportErr: "",

  // Edit Promo Code state
  editPromoCode: "",
  editPromoCodeErr: "",

  // Create Promo Code state
  createPromoCode: "",
  createPromoCodeErr: "",

  // Delete Promo Code state
  deletePromoCode: "",
  deletePromoCodeErr: "",

  // Nearby Host View All state
  nearbyHostViewAll: null,
  nearbyHostViewAllErr: "",
};

const authReducer = handleActions(
  {
    [displayLoading().type]: produce((draft: any, action: any) => {
      draft.loader = action.payload;
    }),

    [onStatus().type]: produce((draft: any, action: any) => {
      draft.status = action.payload;
    }),

    //Set USer
    [setUser().type]: produce((draft: any, action: any) => {
      draft.user = action.payload;
    }),

    // INTERNET CONNECTIVITY
    [internetConnectivity().type]: produce((draft: any, action: any) => {
      draft.internetConnection = action.payload;
    }),

    // payload signin
    [signinData().type]: produce((draft: any, action: any) => {
      draft.signin = action.payload;
    }),
    [signinError().type]: produce((draft: any, action: any) => {
      draft.signinErr = action.payload;
    }),

    // payload signup
    [signupData().type]: produce((draft: any, action: any) => {
      draft.signup = action.payload;
    }),
    [signupError().type]: produce((draft: any, action: any) => {
      draft.signupErr = action.payload;
    }),

    // payload resendVerifyOtp
    [resendVerifyOtpData().type]: produce((draft, action) => {
      draft.resendVerifyOtp = action.payload;
    }),
    [resendVerifyOtpError().type]: produce((draft, action) => {
      draft.resendVerifyOtpErr = action.payload;
    }),

    // payload verifyEmailData
    [verifyEmailData().type]: produce((draft, action) => {
      draft.verifyEmail = action.payload;
    }),
    [verifyEmailError().type]: produce((draft, action) => {
      draft.verifyEmailErr = action.payload;
    }),

    // payload verifyEmailData
    [sendOtpData().type]: produce((draft, action) => {
      draft.sendOtp = action.payload;
    }),
    [sendOtpError().type]: produce((draft, action) => {
      draft.sendOtpErr = action.payload;
    }),

    // payload verifyOtpData
    [verifyOtpData().type]: produce((draft, action) => {
      draft.verifyOtp = action.payload;
    }),
    [verifyOtpError().type]: produce((draft, action) => {
      draft.verifyOtpErr = action.payload;
    }),

    // payload ForgotPasswordData
    [forgotPasswordData().type]: produce((draft, action) => {
      draft.forgotPassword = action.payload;
    }),
    [forgotPasswordError().type]: produce((draft, action) => {
      draft.forgotPasswordErr = action.payload;
    }),

    // payload resetPasswordData
    [resetPasswordData().type]: produce((draft, action) => {
      draft.resetPassword = action.payload;
    }),
    [resetPasswordError().type]: produce((draft, action) => {
      draft.resetPasswordErr = action.payload;
    }),

    [socialLoginData().type]: produce((draft, action) => {
      draft.socialLogin = action.payload;
    }),
    [socialLoginError().type]: produce((draft, action) => {
      draft.socialLoginErr = action.payload;
    }),

    [updateProfileFieldsData().type]: produce((draft, action) => {
      draft.updateProfileFields = action.payload;
    }),
    [updateProfileFieldsError().type]: produce((draft, action) => {
      draft.updateProfileFieldsErr = action.payload;
    }),
    [profileData().type]: produce((draft, action) => {
      draft.profile = action.payload;
    }),
    [profileError().type]: produce((draft, action) => {
      draft.profileErr = action.payload;
    }),

    [logoutData().type]: produce((draft, action) => {
      draft.logout = action.payload;
    }),
    [logoutError().type]: produce((draft, action) => {
      draft.logoutErr = action.payload;
    }),

    [deleteAccountData().type]: produce((draft, action) => {
      draft.deleteAccount = action.payload;
    }),
    [deleteAccountError().type]: produce((draft, action) => {
      draft.deleteAccountErr = action.payload;
    }),

    [getCmsContentData().type]: produce((draft, action) => {
      draft.cmsContent = action.payload;
    }),
    [getCmsContentError().type]: produce((draft, action) => {
      draft.cmsContentErr = action.payload;
    }),

    [resendEmailData().type]: produce((draft, action) => {
      draft.resendEmail = action.payload;
    }),
    [resendEmailError().type]: produce((draft, action) => {
      draft.resendEmailErr = action.payload;
    }),

    [getDynamicContentData().type]: produce((draft, action) => {
      draft.getDynamicContent = action.payload;
    }),
    [getDynamicContentError().type]: produce((draft, action) => {
      draft.getDynamicContentErr = action.payload;
    }),

    [updateLocationData().type]: produce((draft, action) => {
      draft.updateLocation = action.payload;
    }),
    [updateLocationError().type]: produce((draft, action) => {
      draft.updateLocationErr = action.payload;
    }),

    // payload home
    [homeData().type]: produce((draft, action) => {
      draft.home = action.payload;
    }),
    [homeError().type]: produce((draft, action) => {
      draft.homeErr = action.payload;
    }),

    // payload homenew
    [homenewData().type]: produce((draft, action) => {
      draft.homenew = action.payload;
    }),
    [homenewError().type]: produce((draft, action) => {
      draft.homenewErr = action.payload;
    }),

    // payload filter
    [filterData().type]: produce((draft, action) => {
      draft.filter = action.payload;
    }),
    [filterError().type]: produce((draft, action) => {
      draft.filterErr = action.payload;
    }),

    // payload viewdetails
    [viewdetailsData().type]: produce((draft, action) => {
      draft.viewdetails = action.payload;
    }),
    [viewdetailsError().type]: produce((draft, action) => {
      draft.viewdetailsErr = action.payload;
    }),

    // payload getDetailEvent
    [getDetailEventData().type]: produce((draft, action) => {
      draft.getDetailEvent = action.payload;
    }),
    [getDetailEventError().type]: produce((draft, action) => {
      draft.getDetailEventErr = action.payload;
    }),

    // payload updateEvent
    [updateEventData().type]: produce((draft, action) => {
      draft.updateEvent = action.payload;
    }),
    [updateEventError().type]: produce((draft, action) => {
      draft.updateEventErr = action.payload;
    }),
    [deleteEventPartData().type]: produce((draft, action) => {
      draft.deleteEventPart = action.payload;
    }),
    [deleteEventPartError().type]: produce((draft, action) => {
      draft.deleteEventPartErr = action.payload;
    }),
    [deleteEventData().type]: produce((draft, action) => {
      draft.deleteEvent = action.payload;
    }),
    [deleteEventError().type]: produce((draft, action) => {
      draft.deleteEventErr = action.payload;
    }),
    [switchRoleData().type]: produce((draft, action) => {
      draft.switchRole = action.payload;
    }),
    [switchRoleError().type]: produce((draft, action) => {
      draft.switchRoleErr = action.payload;
    }),

    // payload category
    [categoryData().type]: produce((draft, action) => {
      draft.category = action.payload;
    }),
    [categoryError().type]: produce((draft, action) => {
      draft.categoryErr = action.payload;
    }),

    // payload facility
    [facilityData().type]: produce((draft, action) => {
      draft.facility = action.payload;
    }),
    [facilityError().type]: produce((draft, action) => {
      draft.facilityErr = action.payload;
    }),

    // payload togglefavorite
    [togglefavoriteData().type]: produce((draft, action) => {
      draft.togglefavorite = action.payload;
    }),
    [togglefavoriteError().type]: produce((draft, action) => {
      draft.togglefavoriteErr = action.payload;
    }),

    // payload favoriteslist
    [favoriteslistData().type]: produce((draft, action) => {
      draft.favoriteslist = action.payload;
    }),
    [favoriteslistError().type]: produce((draft, action) => {
      draft.favoriteslistErr = action.payload;
    }),

    // payload bookingrequest
    [bookingrequestData().type]: produce((draft, action) => {
      draft.bookingrequest = action.payload;
    }),
    [bookingrequestError().type]: produce((draft, action) => {
      draft.bookingrequestErr = action.payload;
    }),

    // payload acceptreject
    [acceptrejectData().type]: produce((draft, action) => {
      draft.acceptreject = action.payload;
    }),
    [acceptrejectError().type]: produce((draft, action) => {
      draft.acceptrejectErr = action.payload;
    }),

    // payload createevent
    [createeventData().type]: produce((draft, action) => {
      draft.createevent = action.payload;
    }),
    [createeventError().type]: produce((draft, action) => {
      draft.createeventErr = action.payload;
    }),

    // payload bookingDetail
    [bookingDetailData().type]: produce((draft, action) => {
      draft.bookingDetail = action.payload;
    }),
    [bookingDetailError().type]: produce((draft, action) => {
      draft.bookingDetailErr = action.payload;
    }),

    // payload reviewSummary
    [reviewSummaryData().type]: produce((draft, action) => {
      draft.reviewSummary = action.payload;
    }),
    [reviewSummaryError().type]: produce((draft, action) => {
      draft.reviewSummaryErr = action.payload;
    }),

    // payload hostProfile
    [hostProfileData().type]: produce((draft, action) => {
      draft.hostProfile = action.payload;
    }),
    [hostProfileError().type]: produce((draft, action) => {
      draft.hostProfileErr = action.payload;
    }),
    // payload createBooking
    [createBookingData().type]: produce((draft, action) => {
      draft.createBooking = action.payload;
    }),
    [createBookingError().type]: produce((draft, action) => {
      draft.createBookingErr = action.payload;
    }),

    // payload fetchPromoCodes
    [fetchPromoCodesData().type]: produce((draft, action) => {
      draft.fetchPromoCodes = action.payload;
    }),
    [fetchPromoCodesError().type]: produce((draft, action) => {
      draft.fetchPromoCodesErr = action.payload;
    }),

    // payload applyPromoCode
    [applyPromoCodeData().type]: produce((draft, action) => {
      draft.applyPromoCode = action.payload;
    }),
    [applyPromoCodeError().type]: produce((draft, action) => {
      draft.applyPromoCodeErr = action.payload;
    }),

    // payload getProfileDetail
    [getProfileDetailData().type]: produce((draft, action) => {
      draft.getProfileDetail = action.payload;
    }),
    [getProfileDetailError().type]: produce((draft, action) => {
      draft.getProfileDetailErr = action.payload;
    }),

    // payload updateProfile
    [updateProfileData().type]: produce((draft, action) => {
      draft.updateProfile = action.payload;
    }),
    [updateProfileError().type]: produce((draft, action) => {
      draft.updateProfileErr = action.payload;
    }),

    // payload checkBookedDateBooth
    [checkBookedDateBoothData().type]: produce((draft, action) => {
      draft.checkBookedDateBooth = action.payload;
    }),
    [checkBookedDateBoothError().type]: produce((draft, action) => {
      draft.checkBookedDateBoothErr = action.payload;
    }),

    // payload checkBookedDate
    [checkBookedDateData().type]: produce((draft, action) => {
      draft.checkBookedDate = action.payload;
    }),
    [checkBookedDateError().type]: produce((draft, action) => {
      draft.checkBookedDateErr = action.payload;
    }),
    // payload ratingReview
    [ratingReviewData().type]: produce((draft, action) => {
      draft.ratingReview = action.payload;
    }),
    [ratingReviewError().type]: produce((draft, action) => {
      draft.ratingReviewErr = action.payload;
    }),

    // payload cancelBooking
    [cancelBookingData().type]: produce((draft, action) => {
      draft.cancelBooking = action.payload;
    }),
    [cancelBookingError().type]: produce((draft, action) => {
      draft.cancelBookingErr = action.payload;
    }),

    // payload bookingList
    [bookingListData().type]: produce((draft, action) => {
      draft.bookingList = action.payload;
    }),
    [bookingListError().type]: produce((draft, action) => {
      draft.bookingListErr = action.payload;
    }),

    // Chat reducers
    [sendMessageData().type]: produce((draft, action) => {
      draft.sendMessage = action.payload;
    }),
    [sendMessageError().type]: produce((draft, action) => {
      draft.sendMessageErr = action.payload;
    }),

    [getConversationData().type]: produce((draft, action) => {
      draft.conversation = action.payload;
    }),
    [getConversationError().type]: produce((draft, action) => {
      draft.conversationErr = action.payload;
    }),

    [getChatListData().type]: produce((draft, action) => {
      draft.chatList = action.payload;
    }),
    [getChatListError().type]: produce((draft, action) => {
      draft.chatListErr = action.payload;
    }),

    [onUpdateMessages().type]: produce((draft, action) => {
      const { conversationId, newMessages } = action.payload;

      // Find the conversation and append new messages
      const conversationIndex = draft.chatList.findIndex(
        (chat) => chat.conversationId === conversationId
      );
      if (conversationIndex !== -1) {
        draft.chatList[conversationIndex].messages = [
          ...(draft.chatList[conversationIndex].messages || []),
          ...newMessages,
        ];
        draft.chatList[conversationIndex].lastMessage =
          newMessages[newMessages.length - 1];
        draft.chatList[conversationIndex].lastMessageTime =
          newMessages[newMessages.length - 1].timestamp;
      }
    }),

    // Set Device Token
    [setDeviceToken().type]: produce((draft, action) => {
      draft.deviceToken = action.payload;
    }),

    // Notification reducers
    [getNotificationListData().type]: produce((draft: any, action: any) => {
      // Handle the API response structure: { status: 1, message: "...", notifications: [...] }
      const notifications =
        action.payload?.notifications ||
        action.payload?.data ||
        action.payload ||
        [];

      draft.notificationList = notifications;
    }),
    [getNotificationListError().type]: produce((draft: any, action: any) => {
      draft.notificationListErr = action.payload;
    }),

    [markNotificationAsReadData().type]: produce((draft: any, action: any) => {
      draft.markNotificationAsRead = action.payload;
    }),
    [markNotificationAsReadError().type]: produce((draft: any, action: any) => {
      draft.markNotificationAsReadErr = action.payload;
    }),

    // Chat Click reducers
    [chatClickData().type]: produce((draft: any, action: any) => {
      draft.chatClick = action.payload;
      // Trigger chat list refresh when chat is clicked
      // This will cause the bottom tab to re-render and update the indicator
    }),
    [chatClickError().type]: produce((draft: any, action: any) => {
      draft.chatClickErr = action.payload;
    }),
    // List Event reducers
    [listEventData().type]: produce((draft: any, action: any) => {
      draft.listEvent = action.payload;
    }),
    [listEventError().type]: produce((draft: any, action: any) => {
      draft.listEventErr = action.payload;
    }),

    // Get Promo Codes reducers
    [getPromoCodesData().type]: produce((draft: any, action: any) => {
      console.log(
        "🔄 REDUCER: getPromoCodesData action received with payload:",
        action.payload
      );
      draft.getPromoCodes = action.payload;
    }),
    [getPromoCodesError().type]: produce((draft: any, action: any) => {
      console.log(
        "🔄 REDUCER: getPromoCodesError action received with payload:",
        action.payload
      );
      draft.getPromoCodesErr = action.payload;
    }),

    // Create Help Support reducers
    [createHelpSupportData().type]: produce((draft: any, action: any) => {
      draft.createHelpSupport = action.payload;
    }),
    [createHelpSupportError().type]: produce((draft: any, action: any) => {
      draft.createHelpSupportErr = action.payload;
    }),

    // Edit Promo Code reducers
    [editPromoCodeData().type]: produce((draft: any, action: any) => {
      draft.editPromoCode = action.payload;
    }),
    [editPromoCodeError().type]: produce((draft: any, action: any) => {
      draft.editPromoCodeErr = action.payload;
    }),

    // Create Promo Code reducers
    [createPromoCodeData().type]: produce((draft: any, action: any) => {
      draft.createPromoCode = action.payload;
    }),
    [createPromoCodeError().type]: produce((draft: any, action: any) => {
      draft.createPromoCodeErr = action.payload;
    }),

    // Delete Promo Code reducers
    [deletePromoCodeData().type]: produce((draft: any, action: any) => {
      draft.deletePromoCode = action.payload;
    }),
    [deletePromoCodeError().type]: produce((draft: any, action: any) => {
      draft.deletePromoCodeErr = action.payload;
    }),

    // Nearby Host View All reducers
    [nearbyHostViewAllData().type]: produce((draft: any, action: any) => {
      draft.nearbyHostViewAll = action.payload;
    }),
    [nearbyHostViewAllError().type]: produce((draft: any, action: any) => {
      draft.nearbyHostViewAllErr = action.payload;
    }),
  },
  initialState
);

export default authReducer;
