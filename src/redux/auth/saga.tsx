import { call, put, takeLatest, select } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { Platform } from "react-native";

import {
  clearAuthStore,
  onStatus,
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
  onUpdateEvent,
  updateEventData,
  updateEventError,
  onDeleteEventPart,
  deleteEventPartData,
  deleteEventPartError,
  onDeleteEvent,
  deleteEventData,
  deleteEventError,
  onSwitchRole,
  switchRoleData,
  switchRoleError,
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
  onCheckBookedDate,
  checkBookedDateData,
  checkBookedDateError,
  onRatingReview,
  ratingReviewData,
  ratingReviewError,
  onCancelBooking,
  cancelBookingData,
  cancelBookingError,
  // Chat imports
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
  setLoginToken,
  setLoginUserDetails,
  // Notification imports
  onGetNotificationList,
  getNotificationListData,
  getNotificationListError,
  onMarkNotificationAsRead,
  markNotificationAsReadData,
  markNotificationAsReadError,
  onChatClick,
  chatClickData,
  chatClickError,
  onListEvent,
  listEventData,
  listEventError,
  // Get Promo Codes imports
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
} from "./actions";

import { base_url_client, base_url_qa, api_endpoint } from "../apiConstant";
import { fetchPost, fetchGet, fetchPut, fetchDelete } from "../services";
import { longPollingService } from "../../services/longPollingService";

const baseurl = base_url_client;

interface SigninPayload {
  email?: string;
  password?: string;
  deviceToken?: string;
  deviceType?: string;
  timeZone?: string;
}

function* onSigninSaga({ payload }: { payload: SigninPayload }): SagaIterator {
  try {
    yield put(displayLoading(true));

    // Get device token from Redux state
    const state = yield select();
    const deviceToken = state.auth.deviceToken || "abcd"; // fallback to "abcd" if no token

    const params = {
      //"currentRole": "user",
      email: payload?.email?.toLowerCase(),
      password: payload?.password,
      deviceToken: deviceToken,
      deviceType: Platform.OS === "android" ? "android" : "ios",
      timeZone: payload?.timeZone,
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/signIn"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(signinData(response));
    } else {
      yield put(signinError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(signinError(error));
    yield put(displayLoading(false));
  }
}

interface SignupPayload {
  currentRole?: string;
  fullName?: string;
  email?: string;
  countrycode?: string;
  phone?: string;
  dateOfBirth?: string;
  password?: string;
  confirmPassword?: string;
  userDocument?: string;
  timeZone?: string;
  loginType?: string;
}

function* onSignupSaga({ payload }: { payload: SignupPayload }): SagaIterator {
  try {
    yield put(displayLoading(true));

    // Get device token from Redux state
    const state = yield select();
    const deviceToken = state.auth.deviceToken || "abcd"; // fallback to "abcd" if no token

    const params = {
      currentRole: payload?.currentRole, //user,host <- U need small
      fullName: payload?.fullName,
      email: payload?.email?.toLowerCase(),
      countrycode: payload?.countrycode,
      phone: payload?.phone,
      dateOfBirth: payload?.dateOfBirth,
      password: payload?.password,
      confirmPassword: payload?.confirmPassword,
      userDocument: payload?.userDocument,
      timeZone: payload?.timeZone,
      loginType: payload?.loginType,
      deviceToken: deviceToken,
      deviceType: Platform.OS === "android" ? "android" : "ios",
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/signUp"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(signupData(response));
    } else {
      yield put(signupError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(signupError(error));
    yield put(displayLoading(false));
  }
}

interface ForgotPasswordPayload {
  email?: string;
}

function* ForgotPasswordSaga({
  payload,
}: {
  payload: ForgotPasswordPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    // Get device token from Redux state
    const state = yield select();
    const deviceToken = state.auth.deviceToken || "abcd"; // fallback to "abcd" if no token

    const params = {
      //"currentRole": "user",
      type: "email",
      typevalue: payload?.email?.toLowerCase(),
      deviceToken: deviceToken,
      deviceType: Platform.OS === "android" ? "android" : "ios",
      usingtype: "forgot_password", //forgot_password,signup
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/forgotPassword"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(forgotPasswordData(response));
    } else {
      yield put(forgotPasswordError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(forgotPasswordError(error));
    yield put(displayLoading(false));
  }
}

interface ResendVerifyOtpSagaPayload {
  email?: string;
}

function* onResendVerifyOtpSaga({
  payload,
}: {
  payload: ResendVerifyOtpSagaPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/resendOtp"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(resendVerifyOtpData(response));
    } else {
      yield put(resendVerifyOtpError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(resendVerifyOtpError(error));
    yield put(displayLoading(false));
  }
}

interface UpdateProfileFieldsPayload {
  email?: string;
}

function* UpdateProfileFieldsSaga({
  payload,
}: {
  payload: UpdateProfileFieldsPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${"update-profile-fields"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(updateProfileFieldsData(response));
    } else {
      yield put(updateProfileFieldsError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(updateProfileFieldsError(error));
    yield put(displayLoading(false));
  }
}

interface DynamicContentPayload {
  type?: string;
}

function* getDynamicContentSaga({
  payload,
}: {
  payload: DynamicContentPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const response = yield call(fetchGet, {
      url: `${baseurl}${`get-dynamic-content?type=${payload?.type}`}`,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(getDynamicContentData(response));
    } else {
      yield put(getDynamicContentError(response));
    }
    yield put(displayLoading(false));
  } catch (error) {
    yield put(getDynamicContentError(error));
    yield put(displayLoading(false));
  }
}

interface VerifyEmailPayload {
  email?: string;
}

function* VerifyEmailSaga({
  payload,
}: {
  payload: VerifyEmailPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${"verify-email"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(verifyEmailData(response));
    } else {
      yield put(verifyEmailError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(verifyEmailError(error));
    yield put(displayLoading(false));
  }
}

interface SendOtpPayload {
  email?: string;
}

function* SendOtpSaga({ payload }: { payload: SendOtpPayload }): SagaIterator {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${"send-otp"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(sendOtpData(response));
    } else {
      yield put(sendOtpError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(sendOtpError(error));
    yield put(displayLoading(false));
  }
}

interface VerifyOtpPayload {
  email?: string;
}

function* VerifyOtpSaga({
  payload,
}: {
  payload: VerifyOtpPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/otpVerify"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(verifyOtpData(response));
    } else {
      yield put(verifyOtpError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(verifyOtpError(error));
    yield put(displayLoading(false));
  }
}

interface ResetPasswordPayload {}

function* ResetPasswordSaga({
  payload,
}: {
  payload: ResetPasswordPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/ResetPassword"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(resetPasswordData(response));
    } else {
      yield put(resetPasswordError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(resetPasswordError(error));
    yield put(displayLoading(false));
  }
}

interface SocialLoginPayload {}

function* SocialLoginSaga({
  payload,
}: {
  payload: SocialLoginPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    // Get device token from Redux state
    const state = yield select();
    const deviceToken = state.auth.deviceToken || "abcd"; // fallback to "abcd" if no token

    const params = {
      ...payload,
      deviceToken: deviceToken,
      deviceType: Platform.OS === "android" ? "android" : "ios",
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/checkSocialid"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(socialLoginData(response));
    } else {
      yield put(socialLoginError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(socialLoginError(error));
    yield put(displayLoading(false));
  }
}

interface UpdateLocationPayload {
  userId?: string;
  longitude?: string;
  latitude?: string;
  address?: string;
}

function* onUpdateLocationSaga({
  payload,
}: {
  payload: UpdateLocationPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));
    const params = {
      userId: payload?.userId,
      longitude: payload?.longitude,
      latitude: payload?.latitude,
      address: payload?.address,
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/updateLocation"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(updateLocationData(response));
    } else {
      yield put(updateLocationError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(updateLocationError(error));
    yield put(displayLoading(false));
  }
}

interface HomePayload {
  lat?: string;
  long?: string;
  categoryid?: string;
  userId?: string;
  search_keyword: string;
}

function* HomeSaga({ payload }: { payload: HomePayload }): SagaIterator {
  try {
    yield put(displayLoading(true));
    const params = {
      lat: payload?.lat,
      long: payload?.long,
      categoryid: payload?.categoryid,
      userId: payload?.userId,
      search_keyword: payload?.search_keyword,
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/home"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(homeData(response));
    } else {
      yield put(homeError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(homeError(error));
    yield put(displayLoading(false));
  }
}

interface HomenewPayload {
  lat?: string;
  long?: string;
  categoryid?: string;
  userId?: string;
  search_keyword: string;
}

function* HomenewSaga({ payload }: { payload: HomenewPayload }): SagaIterator {
  try {
    yield put(displayLoading(true));
    const params = {
      lat: payload?.lat,
      long: payload?.long,
      categoryid: payload?.categoryid,
      userId: payload?.userId,
      search_keyword: payload?.search_keyword,
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/homenew"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(homenewData(response));
    } else {
      yield put(homenewError(response));
    }
    //yield put(homenewData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(homenewError(error));
    yield put(displayLoading(false));
  }
}

interface FilterPayload {
  lat?: string;
  long?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  date?: string;
  minDistance?: number;
  maxDistance?: number;
  userId?: string;
}

function* FilterSaga({ payload }: { payload: FilterPayload }): SagaIterator {
  try {
    yield put(displayLoading(true));
    const params = {
      lat: payload?.lat,
      long: payload?.long,
      categoryId: payload?.categoryId,
      minPrice: payload?.minPrice,
      maxPrice: payload?.maxPrice,
      date: payload?.date,
      minDistance: payload?.minDistance,
      maxDistance: payload?.maxDistance,
      userId: payload?.userId,
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/filter"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(filterData(response));
    } else {
      yield put(filterError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(filterError(error));
    yield put(displayLoading(false));
  }
}

interface ProfilePayload {}

function* getProfileSaga({
  payload,
}: {
  payload: ProfilePayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const response = yield call(fetchGet, {
      url: `${baseurl}${`user-profile`}`,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(profileData(response));
    } else {
      yield put(profileError(response));
    }
    yield put(displayLoading(false));
  } catch (error) {
    yield put(profileError(error));
    yield put(displayLoading(false));
  }
}

interface LogoutPayload {}

function* LogoutSaga({ payload }: { payload: LogoutPayload }): SagaIterator {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${"logout"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(logoutData(response));
    } else {
      yield put(logoutError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(logoutError(error));
    yield put(displayLoading(false));
  }
}

interface ViewdetailsPayload {
  id?: string;
  userId?: string;
}

function* ViewdetailsSaga({
  payload,
}: {
  payload: ViewdetailsPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      userId: payload?.userId,
    };

    const response = yield call(fetchPost, {
      url: `${baseurl}${`user/viewdetails/${payload?.id}`}`,
      params,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(viewdetailsData(response));
    } else {
      yield put(viewdetailsError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(viewdetailsError(error));
    yield put(displayLoading(false));
  }
}

interface GetDetailEventPayload {
  id?: string;
  userId?: string;
}

function* GetDetailEventSaga({
  payload,
}: {
  payload: GetDetailEventPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const response = yield call(fetchGet, {
      url: `${baseurl}${`user/getdetailevent/${payload?.id}`}`,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(getDetailEventData(response));
    } else {
      yield put(getDetailEventError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(getDetailEventError(error));
    yield put(displayLoading(false));
  }
}

interface UpdateEventPayload {
  id?: string;
  name?: string;
  description?: string;
  address?: string;
  openingTime?: string;
  closingTime?: string;
  startDate?: string;
  endDate?: string;
  price?: string;
  capacity?: string;
  type?: string;
  facilities?: any[];
  images?: any[];
}

interface DeleteEventPartPayload {
  id: string;
  partType: string;
  partId: string;
}

function* UpdateEventSaga({
  payload,
}: {
  payload: UpdateEventPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      ...payload,
    };

    console.log("🔑 UPDATE EVENT - params:", params);

    const response = yield call(fetchPut, {
      url: `${baseurl}${`user/updateeventclubpub`}`,
      params,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(updateEventData(response));
    } else {
      yield put(updateEventError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(updateEventError(error));
    yield put(displayLoading(false));
  }
}

function* DeleteEventPartSaga({
  payload,
}: {
  payload: DeleteEventPartPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      ...payload,
    };

    console.log("🗑️ DELETE EVENT PART - params:", params);

    const response = yield call(fetchDelete, {
      url: `${baseurl}${`user/deleteeventpart`}`,
      params,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(deleteEventPartData(response));
    } else {
      yield put(deleteEventPartError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(deleteEventPartError(error));
    yield put(displayLoading(false));
  }
}

interface DeleteEventPayload {
  id: string;
}

function* DeleteEventSaga({
  payload,
}: {
  payload: DeleteEventPayload;
}): SagaIterator {
  try {
    console.log("🗑️ DELETE EVENT SAGA STARTED - payload:", payload);
    yield put(displayLoading(true));

    const params = {
      ...payload,
    };

    console.log("🗑️ DELETE EVENT - params:", params);

    const response = yield call(fetchDelete, {
      url: `${baseurl}${`user/deleteevent`}`,
      params,
    });

    console.log("🗑️ DELETE EVENT - response:", response);

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      console.log("🗑️ DELETE EVENT - SUCCESS, dispatching deleteEventData");
      yield put(deleteEventData(response));
    } else {
      console.log("🗑️ DELETE EVENT - ERROR, dispatching deleteEventError");
      yield put(deleteEventError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    console.log("🗑️ DELETE EVENT - CATCH ERROR:", error);
    yield put(deleteEventError(error));
    yield put(displayLoading(false));
  }
}

interface SwitchRolePayload {
  role: string;
}

function* SwitchRoleSaga({
  payload,
}: {
  payload: SwitchRolePayload;
}): SagaIterator {
  try {
    console.log("🔄 SWITCH ROLE SAGA STARTED - payload:", payload);
    yield put(displayLoading(true));

    const params = {
      ...payload,
    };

    console.log("🔄 SWITCH ROLE - params:", params);

    const response = yield call(fetchPost, {
      url: `${baseurl}${`user/switchrole`}`,
      //params,
    });

    console.log("🔄 SWITCH ROLE - response:", response);

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      console.log("🔄 SWITCH ROLE - SUCCESS, dispatching switchRoleData");
      yield put(switchRoleData(response));
    } else {
      console.log("🔄 SWITCH ROLE - ERROR, dispatching switchRoleError");
      yield put(switchRoleError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    console.log("🔄 SWITCH ROLE - CATCH ERROR:", error);
    yield put(switchRoleError(error));
    yield put(displayLoading(false));
  }
}

interface CategoryPayload {
  page?: number;
  limit?: number;
}

function* CategorySaga({
  payload,
}: {
  payload: CategoryPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const response = yield call(fetchGet, {
      url: `${baseurl}${`user/category?page=${payload?.page}&limit=${payload?.limit}`}`,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(categoryData(response));
    } else {
      yield put(categoryError(response));
    }
    yield put(displayLoading(false));
  } catch (error) {
    yield put(categoryError(error));
    yield put(displayLoading(false));
  }
}

interface FacilityPayload {
  page?: number;
  limit?: number;
}

function* FacilitySaga({
  payload,
}: {
  payload: FacilityPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const response = yield call(fetchGet, {
      url: `${baseurl}${`user/facility?page=${payload?.page}&limit=${payload?.limit}`}`,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(facilityData(response));
    } else {
      yield put(facilityError(response));
    }
    yield put(displayLoading(false));
  } catch (error) {
    yield put(facilityError(error));
    yield put(displayLoading(false));
  }
}

interface TogglefavoritePayload {
  eventId?: string;
}

function* TogglefavoriteSaga({
  payload,
}: {
  payload: TogglefavoritePayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));
    const params = {
      eventId: payload?.eventId,
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/togglefavorite"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(togglefavoriteData(response));
    } else {
      yield put(togglefavoriteError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(togglefavoriteError(error));
    yield put(displayLoading(false));
  }
}

interface FavoriteslistPayload {
  eventId?: string;
}

interface BookingRequestPayload {
  page: number;
  limit: number;
}

interface AcceptRejectPayload {
  bookingId: string;
  action: "accept" | "reject";
  reason: string;
}

interface CreateeventPayload {
  type: string;
  name: string;
  details: string;
  entryFee: number;
  eventCapacity: number;
  openingTime: string;
  closeTime: string;
  startDate: string;
  endDate: string;
  address: string;
  coordinates: {
    type: string;
    coordinates: number[];
  };
  photos: string[];
  facilities: string[];
  tickets: Array<{
    ticketType: string;
    ticketPrice: number;
    capacity: number;
  }>;
}

function* FavoriteslistSaga({
  payload,
}: {
  payload: FavoriteslistPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));
    const params = {
      eventId: payload?.eventId,
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/favoriteslist"}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(favoriteslistData(response));
    } else {
      yield put(favoriteslistError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    yield put(favoriteslistError(error));
    yield put(displayLoading(false));
  }
}

// function* BookingrequestSaga({ payload }: { payload: BookingrequestPayload }) {
//   try {
//     yield put(displayLoading(true));

//     const response = yield call(fetchGet, {
interface BookingrequestPayload {
  eventId?: string;
  page?: number;
  limit?: number;
  status?: string;
}

function* BookingrequestSaga({
  payload,
}: {
  payload: BookingrequestPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));
    const params = {
      status: payload?.status || "pending",
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${`user/bookingrequest?page=${payload?.page || 1}&limit=${
        payload?.limit || 10
      }`}`,
      params,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(bookingrequestData(response));
    } else {
      yield put(bookingrequestError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(bookingrequestError(error));
    yield put(displayLoading(false));
  }
}

function* AcceptrejectSaga({
  payload,
}: {
  payload: AcceptRejectPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      bookingId: payload?.bookingId,
      action: payload?.action,
      reason: payload?.reason,
    };

    const response = yield call(fetchPut, {
      url: `${baseurl}${`user/acceptreject`}`,
      params,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(acceptrejectData(response));
    } else {
      yield put(acceptrejectError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(acceptrejectError(error));
    yield put(displayLoading(false));
  }
}

function* CreateeventSaga({
  payload,
}: {
  payload: CreateeventPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const response = yield call(fetchPost, {
      url: `${baseurl}${`user/createevent`}`,
      params: payload,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(createeventData(response));
    } else {
      yield put(createeventError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(createeventError(error));
    yield put(displayLoading(false));
  }
}

interface BookingDetailPayload {
  bookingId: string;
}

function* BookingDetailSaga({
  payload,
}: {
  payload: BookingDetailPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const response = yield call(fetchGet, {
      url: `${baseurl}${`user/booking/${payload?.bookingId}`}`,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(bookingDetailData(response));
    } else {
      yield put(bookingDetailError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(bookingDetailError(error));
    yield put(displayLoading(false));
  }
}

interface ReviewSummaryPayload {
  eventid: string;
  members: number;
  days: number;
}

function* ReviewSummarySaga({
  payload,
}: {
  payload: ReviewSummaryPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      eventid: payload?.eventid,
      members: payload?.members,
      days: payload?.days,
    };

    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/reviewsummary"}`,
      params,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(reviewSummaryData(response));
    } else {
      yield put(reviewSummaryError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(reviewSummaryError(error));
    yield put(displayLoading(false));
  }
}

interface BookingListPayload {
  status?: string;
  page?: number;
  limit?: number;
}

function* BookingListSaga({
  payload,
}: {
  payload: BookingListPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));
    const params = {
      status: payload?.status,
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${`user/bookinglist?page=${payload?.page}&limit=${payload?.limit}`}`,
      params,
    });

    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(bookingListData(response));
    } else {
      yield put(bookingListError(response));
    }
    yield put(displayLoading(false));
  } catch (error) {
    yield put(bookingListError(error));
  }
}

// Host Profile Saga
interface HostProfilePayload {
  hostId?: string;
}

function* HostProfileSaga({
  payload,
}: {
  payload: HostProfilePayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      hostId: payload?.hostId,
    };

    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/hostprofile"}`,
      params,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(hostProfileData(response));
    } else {
      yield put(hostProfileError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(hostProfileError(error));
    yield put(displayLoading(false));
  }
}

// Create Booking Saga
function* CreateBookingSaga({ payload }: { payload: any }): SagaIterator {
  try {
    yield put(displayLoading(true));

    // Build params dynamically based on whether it's a booth or ticket
    const params: any = {
      eventId: payload.eventId,
      hostId: payload.hostId,
      members: payload.members,
      discount: payload.discount,
      fees: payload.fees,
      totalAmount: payload.totalAmount,
      transactionInfo: payload.transactionInfo,
      bookingStartDate: payload.bookingStartDate,
      bookingEndDate: payload.bookingEndDate,
    };

    // Add booth-specific or ticket-specific fields
    if (payload.boothCost !== undefined) {
      // This is a booth booking
      params.boothCost = payload.boothCost;
      params.boothType = payload.boothType;
      params.boothId = payload.boothId; // Add boothId
    } else {
      // This is a ticket booking
      params.ticketCost = payload.ticketCost;
      params.ticketType = payload.ticketType;
      params.ticketId = payload.ticketId; // Add ticketId
    }

    // const response = yield call(fetchPost, "/user/booking", params);
    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/booking"}`,
      params,
    });

    if (response && response.status === 1) {
      yield put(createBookingData(response));
    } else {
      yield put(createBookingError(response?.message || "Booking failed"));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(createBookingError(error));
    yield put(displayLoading(false));
  }
}

// Fetch Promo Codes Saga
function* FetchPromoCodesSaga({ payload }: { payload: any }): SagaIterator {
  try {
    yield put(displayLoading(true));

    const response = yield call(fetchPost, {
      // url: 'user/promocodelist',
      url: `${baseurl}${"user/promocodelist"}`,
      params: {
        hostId: payload.hostId,
      },
    });

    if (response && response.status === 1) {
      yield put(fetchPromoCodesData(response));
    } else {
      yield put(
        fetchPromoCodesError(response?.message || "Failed to fetch promo codes")
      );
    }
  } catch (error) {
    yield put(fetchPromoCodesError("Failed to fetch promo codes"));
  } finally {
    yield put(displayLoading(false));
  }
}

// Apply Promo Code Saga
function* ApplyPromoCodeSaga({ payload }: { payload: any }): SagaIterator {
  try {
    yield put(displayLoading(true));

    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/reviewsummary"}`,
      params: {
        eventid: payload.eventid,
        boothid: payload.boothid,
        members: payload.members,
        days: payload.days,
        promocode: payload.promocode,
        ticketid: payload.ticketid,
      },
    });

    if (response && response.status === 1) {
      yield put(applyPromoCodeData(response));
    } else {
      yield put(
        applyPromoCodeError(response?.message || "Failed to apply promo code")
      );
    }
  } catch (error) {
    console.error("Apply Promo Code Error:", error);
    yield put(applyPromoCodeError("Failed to apply promo code"));
  } finally {
    yield put(displayLoading(false));
  }
}

// Get Profile Detail Saga
interface GetProfileDetailPayload {}

function* GetProfileDetailSaga({
  payload,
}: {
  payload: GetProfileDetailPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const response = yield call(fetchGet, {
      url: `${baseurl}${"user/profiledetail"}`,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(getProfileDetailData(response));
    } else {
      yield put(getProfileDetailError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(getProfileDetailError(error));
    yield put(displayLoading(false));
  }
}

// Update Profile Saga
interface UpdateProfilePayload {
  fullName?: string;
  countrycode?: string;
  phone?: string;
  dateOfBirth?: string;
  profilePicture?: string;
  userDocument?: string;
  businessName?: string;
  businessPicture?: string;
  businessBanner?: string;
  businessDiscription?: string;
}

function* UpdateProfileSaga({
  payload,
}: {
  payload: UpdateProfilePayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      fullName: payload?.fullName,
      countrycode: payload?.countrycode,
      phone: payload?.phone,
      dateOfBirth: payload?.dateOfBirth,
      profilePicture: payload?.profilePicture,
      userDocument: payload?.userDocument,
      businessName: payload?.businessName,
      businessPicture: payload?.businessPicture,
      businessBanner: payload?.businessBanner,
      businessDiscription: payload?.businessDiscription,
    };

    const response: any = yield call(fetchPost, {
      url: `${baseurl}user/updateProfile`,
      params,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(updateProfileData(response));
    } else {
      yield put(updateProfileError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(updateProfileError(error));
    yield put(displayLoading(false));
  }
}

// Check Booked Date Booth Saga
interface CheckBookedDateBoothPayload {
  eventId?: string;
  boothId?: string;
}

function* CheckBookedDateBoothSaga({
  payload,
}: {
  payload: CheckBookedDateBoothPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      eventId: payload?.eventId,
      boothId: payload?.boothId,
    };

    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/checkbookeddatebooth"}`,
      params,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(checkBookedDateBoothData(response));
    } else {
      yield put(checkBookedDateBoothError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(checkBookedDateBoothError(error));
    yield put(displayLoading(false));
  }
}

// Check Booked Date Saga
interface CheckBookedDatePayload {
  eventId?: string;
  startDate?: string;
  endDate?: string;
}

function* CheckBookedDateSaga({
  payload,
}: {
  payload: CheckBookedDatePayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      eventId: payload?.eventId,
      startDate: payload?.startDate,
      endDate: payload?.endDate,
    };

    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/checkbookeddate"}`,
      params,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(checkBookedDateData(response));
    } else {
      yield put(checkBookedDateError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(checkBookedDateError(error));
    yield put(displayLoading(false));
  }
}

interface RatingReviewPayload {
  bookingId?: string;
  eventId?: string;
  rating?: number;
  review?: string;
}

function* RatingReviewSaga({
  payload,
}: {
  payload: RatingReviewPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      bookingId: payload?.bookingId,
      eventId: payload?.eventId,
      rating: payload?.rating,
      review: payload?.review,
    };

    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/ratingreview"}`,
      params,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(ratingReviewData(response));
    } else {
      yield put(ratingReviewError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(ratingReviewError(error));
    yield put(displayLoading(false));
  }
}

interface CancelBookingPayload {
  bookingId?: string;
  reason?: string;
}

function* CancelBookingSaga({
  payload,
}: {
  payload: CancelBookingPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      bookingId: payload?.bookingId,
      reason: payload?.reason,
    };

    const response = yield call(fetchPut, {
      url: `${baseurl}${"user/cancelbooking"}`,
      params,
    });
    console.log("💳 CANCEL BOOKING params:", params);
    console.log("💳 CANCEL BOOKING RESPONSE:", response);
    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(cancelBookingData(response));
    } else {
      yield put(cancelBookingError(response));
    }
    yield put(displayLoading(false));
  } catch (error) {
    yield put(cancelBookingError(error));
    yield put(displayLoading(false));
  }
}

// Chat Saga Functions
interface SendMessagePayload {
  receiverId: string;
  message: string;
}

function* SendMessageSaga({
  payload,
}: {
  payload: SendMessagePayload;
}): SagaIterator {
  try {
    //yield put(displayLoading(true));
    const response = yield call(fetchPost, {
      url: `${baseurl}user/sendmessage`,
      params: payload,
    });
    if (
      response.status === true ||
      response.status === "true" ||
      response.status === 1
    ) {
      yield put(sendMessageData(response));
    } else {
      yield put(sendMessageError(response.message || "Failed to send message"));
    }
  } catch (error) {
    yield put(sendMessageError(error));
  } finally {
    //yield put(displayLoading(false));
  }
}

interface GetConversationPayload {
  otherUserId: string;
}

function* GetConversationSaga({
  payload,
}: {
  payload: GetConversationPayload;
}): SagaIterator {
  try {
    // yield put(displayLoading(true));
    const response = yield call(fetchPost, {
      url: `${baseurl}user/conversation`,
      params: payload,
    });
    if (
      response.status === true ||
      response.status === "true" ||
      response.status === 1
    ) {
      yield put(getConversationData(response.data || response.messages || []));
    } else {
      yield put(
        getConversationError(response.message || "Failed to get conversation")
      );
    }
  } catch (error) {
    yield put(getConversationError(error));
  } finally {
    // yield put(displayLoading(false));
  }
}

function* GetChatListSaga(): SagaIterator {
  try {
    yield put(displayLoading(true));
    const response = yield call(fetchGet, {
      url: `${baseurl}user/chatlist`,
    });
    if (
      response.status === true ||
      response.status === "true" ||
      response.status === 1
    ) {
      yield put(getChatListData(response.data || response.chats || []));
    } else {
      yield put(
        getChatListError(response.message || "Failed to get chat list")
      );
    }
  } catch (error) {
    yield put(getChatListError(error));
  } finally {
    yield put(displayLoading(false));
  }
}

function* StartLongPollingSaga(): SagaIterator {
  longPollingService.startPolling();
}

function* StopLongPollingSaga(): SagaIterator {
  longPollingService.stopPolling();
}

// Notification Saga Functions
interface GetNotificationListPayload {
  page?: number;
  limit?: number;
}

function* GetNotificationListSaga({
  payload,
}: {
  payload: GetNotificationListPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      page: payload?.page || 1,
      limit: payload?.limit || 10,
    };

    const response = yield call(fetchGet, {
      url: `${baseurl}${"user/notificationlist"}?page=${params.page}&limit=${
        params.limit
      }`,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(getNotificationListData(response));
    } else {
      yield put(getNotificationListError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(getNotificationListError(error));
    yield put(displayLoading(false));
  }
}

interface MarkNotificationAsReadPayload {
  notificationId: string;
}

function* MarkNotificationAsReadSaga({
  payload,
}: {
  payload: MarkNotificationAsReadPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      notificationId: payload?.notificationId,
    };

    const response = yield call(fetchPost, {
      url: `${baseurl}${"user/marknotificationasread"}`,
      params,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(markNotificationAsReadData(response));
    } else {
      yield put(markNotificationAsReadError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(markNotificationAsReadError(error));
    yield put(displayLoading(false));
  }
}

// List Event Saga
interface ListEventPayload {
  page?: number;
  limit?: number;
}

function* ListEventSaga({
  payload,
}: {
  payload: ListEventPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      page: payload?.page || 1,
      limit: payload?.limit || 10,
    };

    const response = yield call(fetchGet, {
      url: `${baseurl}user/listevent?page=${params.page}&limit=${params.limit}`,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(listEventData(response));
    } else {
      yield put(listEventError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(listEventError(error));
    yield put(displayLoading(false));
  }
}

// Get Promo Codes Saga
interface GetPromoCodesPayload {
  page?: number;
  limit?: number;
}

function* GetPromoCodesSaga({
  payload,
}: {
  payload: GetPromoCodesPayload;
}): SagaIterator {
  try {
    console.log("🚀 GET PROMO CODES SAGA: Starting with payload:", payload);
    yield put(displayLoading(true));

    const params = {
      page: payload?.page || 1,
      limit: payload?.limit || 10,
    };

    const apiUrl = `${baseurl}${api_endpoint.getPromoCodes}?page=${params.page}&limit=${params.limit}`;
    console.log("🌐 GET PROMO CODES SAGA: Making API call to:", apiUrl);

    const response = yield call(fetchGet, {
      url: apiUrl,
    });

    console.log("📡 GET PROMO CODES SAGA: API Response:", response);

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      console.log(
        "✅ GET PROMO CODES SAGA: Success - dispatching getPromoCodesData"
      );
      yield put(getPromoCodesData(response));
    } else {
      console.log(
        "❌ GET PROMO CODES SAGA: Error - dispatching getPromoCodesError"
      );
      yield put(getPromoCodesError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    console.log("💥 GET PROMO CODES SAGA: Exception caught:", error);
    yield put(getPromoCodesError(error));
    yield put(displayLoading(false));
  }
}

// Create Help Support Saga
interface CreateHelpSupportPayload {
  fullName: string;
  email: string;
  description: string;
}

function* CreateHelpSupportSaga({
  payload,
}: {
  payload: CreateHelpSupportPayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      fullName: payload?.fullName,
      email: payload?.email,
      description: payload?.description,
    };

    const response = yield call(fetchPost, {
      url: `${baseurl}${api_endpoint.createHelpSupport}`,
      params,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(createHelpSupportData(response));
    } else {
      yield put(createHelpSupportError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(createHelpSupportError(error));
    yield put(displayLoading(false));
  }
}

// Edit Promo Code Saga
interface EditPromoCodePayload {
  id: string;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  discount: number;
  status: string;
}

function* EditPromoCodeSaga({
  payload,
}: {
  payload: EditPromoCodePayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      id: payload?.id,
      code: payload?.code,
      description: payload?.description,
      startDate: payload?.startDate,
      endDate: payload?.endDate,
      discount: payload?.discount,
      status: payload?.status,
    };

    const response = yield call(fetchPut, {
      url: `${baseurl}${api_endpoint.editPromoCode}`,
      params,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(editPromoCodeData(response));
    } else {
      yield put(editPromoCodeError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(editPromoCodeError(error));
    yield put(displayLoading(false));
  }
}

// Create Promo Code Saga
interface CreatePromoCodePayload {
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  discount: number;
}

function* CreatePromoCodeSaga({
  payload,
}: {
  payload: CreatePromoCodePayload;
}): SagaIterator {
  try {
    yield put(displayLoading(true));

    const params = {
      code: payload?.code,
      description: payload?.description,
      startDate: payload?.startDate,
      endDate: payload?.endDate,
      discount: payload?.discount,
    };

    const response = yield call(fetchPost, {
      url: `${baseurl}${api_endpoint.createPromoCode}`,
      params,
    });

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(createPromoCodeData(response));
    } else {
      yield put(createPromoCodeError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    yield put(createPromoCodeError(error));
    yield put(displayLoading(false));
  }
}

// Delete Promo Code Saga
interface DeletePromoCodePayload {
  id: string;
}

function* DeletePromoCodeSaga({
  payload,
}: {
  payload: DeletePromoCodePayload;
}): SagaIterator {
  try {
    console.log("🚀 DELETE PROMO CODE SAGA: Starting with payload:", payload);
    yield put(displayLoading(true));

    const params = {
      id: payload?.id,
    };

    const apiUrl = `${baseurl}${api_endpoint.deletePromoCode}`;
    console.log("🌐 DELETE PROMO CODE SAGA: Making API call to:", apiUrl);
    console.log("📤 DELETE PROMO CODE SAGA: Request params:", params);

    const response = yield call(fetchDelete, {
      url: apiUrl,
      params,
    });

    console.log("📡 DELETE PROMO CODE SAGA: API Response:", response);

    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      console.log(
        "✅ DELETE PROMO CODE SAGA: Success - dispatching deletePromoCodeData"
      );
      yield put(deletePromoCodeData(response));
    } else {
      console.log(
        "❌ DELETE PROMO CODE SAGA: Error - dispatching deletePromoCodeError"
      );
      yield put(deletePromoCodeError(response));
    }

    yield put(displayLoading(false));
  } catch (error) {
    console.log("💥 DELETE PROMO CODE SAGA: Exception caught:", error);
    yield put(deletePromoCodeError(error));
    yield put(displayLoading(false));
  }
}

// Chat Click Saga
function* ChatClickSaga({ payload }: { payload: any }): SagaIterator {
  try {
    yield put(displayLoading(true));

    // Get current user ID from state
    const state = yield select();
    const userId = state.auth?.user?.id || state.auth?.user?.userId;

    if (!userId) {
      yield put(chatClickError("User not found"));
      return;
    }

    // Call API to refresh chat list
    const response = yield call(fetchGet, {
      url: `${base_url_client}/chat-list?userId=${userId}`,
    });

    if (response?.status === 1 || response?.status === true) {
      // Update chat list in Redux
      const chatListData =
        response?.data || response?.chatList || response || [];
      console.log(
        "Saga: Updating chat list with",
        chatListData.length,
        "chats"
      );
      yield put(getChatListData(chatListData));
      yield put(chatClickData("Chat list refreshed successfully"));
    } else {
      console.log("Saga: API call failed:", response);
      yield put(
        chatClickError(response?.message || "Failed to refresh chat list")
      );
    }
  } catch (error: any) {
    yield put(chatClickError(error?.message || "Network error"));
  } finally {
    yield put(displayLoading(false));
  }
  yield takeLatest(
    onGetNotificationList().type as any,
    GetNotificationListSaga
  );
  yield takeLatest(
    onMarkNotificationAsRead().type as any,
    MarkNotificationAsReadSaga
  );
}

function* authSaga() {
  yield takeLatest(onSignin().type as any, onSigninSaga);
  yield takeLatest(onResendVerifyOtp().type as any, onResendVerifyOtpSaga);
  yield takeLatest(
    onUpdateProfileFields().type as any,
    UpdateProfileFieldsSaga
  );
  yield takeLatest(onGetDynamicContent().type as any, getDynamicContentSaga);
  yield takeLatest(onSignup().type as any, onSignupSaga);
  yield takeLatest(onVerifyEmail().type as any, VerifyEmailSaga);
  yield takeLatest(onSendOtp().type as any, SendOtpSaga);
  yield takeLatest(onVerifyOtp().type as any, VerifyOtpSaga);
  yield takeLatest(onForgotPassword().type as any, ForgotPasswordSaga);
  yield takeLatest(onResetPassword().type as any, ResetPasswordSaga);
  yield takeLatest(onSocialLogin().type as any, SocialLoginSaga);
  yield takeLatest(onProfile().type as any, getProfileSaga);
  yield takeLatest(onLogout().type as any, LogoutSaga);
  yield takeLatest(onUpdateLocation().type as any, onUpdateLocationSaga);

  yield takeLatest(onHome().type as any, HomeSaga);
  yield takeLatest(onHomenew().type as any, HomenewSaga);
  yield takeLatest(onFilter().type as any, FilterSaga);
  yield takeLatest(onViewdetails().type as any, ViewdetailsSaga);
  yield takeLatest(onGetDetailEvent().type as any, GetDetailEventSaga);
  yield takeLatest(onUpdateEvent().type as any, UpdateEventSaga);
  yield takeLatest(onDeleteEventPart().type as any, DeleteEventPartSaga);
  yield takeLatest(onDeleteEvent().type as any, DeleteEventSaga);
  yield takeLatest(onSwitchRole().type as any, SwitchRoleSaga);
  yield takeLatest(onCategory().type as any, CategorySaga);
  yield takeLatest(onFacility().type as any, FacilitySaga);
  yield takeLatest(onTogglefavorite().type as any, TogglefavoriteSaga);
  yield takeLatest(onFavoriteslist().type as any, FavoriteslistSaga);
  yield takeLatest(onBookingrequest().type as any, BookingrequestSaga);
  yield takeLatest(onAcceptreject().type as any, AcceptrejectSaga);
  yield takeLatest(onCreateevent().type as any, CreateeventSaga);
  yield takeLatest(onBookingDetail().type as any, BookingDetailSaga);
  yield takeLatest(onReviewSummary().type as any, ReviewSummarySaga);
  yield takeLatest(onHostProfile().type as any, HostProfileSaga);
  yield takeLatest(onCreateBooking().type as any, CreateBookingSaga);
  yield takeLatest(onFetchPromoCodes().type as any, FetchPromoCodesSaga);
  yield takeLatest(onApplyPromoCode().type as any, ApplyPromoCodeSaga);
  yield takeLatest(onGetProfileDetail().type as any, GetProfileDetailSaga);
  yield takeLatest(onUpdateProfile().type as any, UpdateProfileSaga);
  yield takeLatest(
    onCheckBookedDateBooth().type as any,
    CheckBookedDateBoothSaga
  );
  yield takeLatest(onCheckBookedDate().type as any, CheckBookedDateSaga);
  yield takeLatest(onRatingReview().type as any, RatingReviewSaga);
  yield takeLatest(onCancelBooking().type as any, CancelBookingSaga);
  yield takeLatest(getBookingList().type as any, BookingListSaga);

  // Chat sagas
  yield takeLatest(onSendMessage().type as any, SendMessageSaga);
  yield takeLatest(onGetConversation().type as any, GetConversationSaga);
  yield takeLatest(onGetChatList().type as any, GetChatListSaga);
  yield takeLatest(onStartLongPolling().type as any, StartLongPollingSaga);
  yield takeLatest(onStopLongPolling().type as any, StopLongPollingSaga);

  // Notification sagas
  yield takeLatest(
    onGetNotificationList().type as any,
    GetNotificationListSaga
  );
  yield takeLatest(
    onMarkNotificationAsRead().type as any,
    MarkNotificationAsReadSaga
  );
  yield takeLatest(onChatClick().type as any, ChatClickSaga);

  // List Event saga
  yield takeLatest(onListEvent().type as any, ListEventSaga);

  // Get Promo Codes saga
  yield takeLatest(onGetPromoCodes().type as any, GetPromoCodesSaga);

  // Create Help Support saga
  yield takeLatest(onCreateHelpSupport().type as any, CreateHelpSupportSaga);

  // Edit Promo Code saga
  yield takeLatest(onEditPromoCode().type as any, EditPromoCodeSaga);

  // Create Promo Code saga
  yield takeLatest(onCreatePromoCode().type as any, CreatePromoCodeSaga);

  // Delete Promo Code saga
  yield takeLatest(onDeletePromoCode().type as any, DeletePromoCodeSaga);
}

export default authSaga;
