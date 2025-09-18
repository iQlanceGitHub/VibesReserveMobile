import { call, put, takeLatest, select } from "redux-saga/effects";

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
} from "./actions";

import { base_url_client, base_url_qa } from "../apiConstant";
import { fetchPost, fetchGet, fetchPut } from "../services";

const baseurl = base_url_client;

interface SigninPayload {
  email?: string;
  password?: string;
  deviceToken?: string;
  deviceType?: string;
  timeZone?: string;
}

function* onSigninSaga({ payload }: { payload: SigninPayload }) {
  try {
    yield put(displayLoading(true));
    const params = {
      //"currentRole": "user",
      "email": payload?.email,
      "password": payload?.password,
      "deviceToken": 'abcd',
      "deviceType": "ios",
      "timeZone": payload?.timeZone,
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${'user/signIn'}`,
      params,
    });
    console.log(`==>> ${baseurl}${'user/signIn'}`)

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(signinData(response));
    } else {
      console.log("Error:===2", response);
      yield put(signinError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
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

function* onSignupSaga({ payload }: { payload: SignupPayload }) {
  try {
    yield put(displayLoading(true));
    const params = {
      "currentRole": payload?.currentRole,  //user,host <- U need small
      "fullName": payload?.fullName,
      "email": payload?.email,
      "countrycode": payload?.countrycode,
      "phone": payload?.phone,
      "dateOfBirth": payload?.dateOfBirth,
      "password": payload?.password,
      "confirmPassword": payload?.confirmPassword,
      "userDocument": payload?.userDocument,
      "timeZone": payload?.timeZone,
      "loginType": payload?.loginType,
    }
    const response = yield call(fetchPost, {
      url: `${baseurl}${'user/signUp'}`,
      params,
    });
    console.log(`==>> ${baseurl}${'user/signUp'}`)

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(signupData(response));
    } else {
      console.log("Error:===2", response);
      yield put(signupError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
    yield put(signupError(error));
    yield put(displayLoading(false));
  }
}

interface ForgotPasswordPayload {
  email?: string;
}

function* ForgotPasswordSaga({ payload }: { payload: ForgotPasswordPayload }) {
  try {
    yield put(displayLoading(true));
    const params = {
      //"currentRole": "user",
      "type": "email",
      "typevalue": payload?.email,
      "deviceToken": 'abcd',
      "deviceType": "ios",
      "usingtype": "forgot_password"//forgot_password,signup
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${'user/forgotPassword'}`,
      params,
    });
    console.log(`==>> ${baseurl}${'user/signIn'}`)

    // console.log('response:->', response);
    if (response?.status == 1 || response?.status == true || response?.status == "1" || response?.status == "true") {
      yield put(forgotPasswordData(response));
    } else {
      console.log('Error:===2', response);
      yield put(forgotPasswordError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log('Error:===', error);
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
}) {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${'user/resendOtp'}`,
      params,
    });
    console.log(`==>> ${baseurl}${'user/resendOtp'}`)

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(resendVerifyOtpData(response));
    } else {
      console.log("Error:===2", response);
      yield put(resendVerifyOtpError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
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
}) {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${"update-profile-fields"}`,
      params,
    });
    console.log(`==>> ${baseurl}${"update-profile-fields"}`);

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(updateProfileFieldsData(response));
    } else {
      console.log("Error:===2", response);
      yield put(updateProfileFieldsError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
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
}) {
  try {
    yield put(displayLoading(true));

    const response = yield call(fetchGet, {
      url: `${baseurl}${`get-dynamic-content?type=${payload?.type}`}`,
    });

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(getDynamicContentData(response));
    } else {
      console.log("Errors", response);
      yield put(getDynamicContentError(response));
    }
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error", error);
    yield put(getDynamicContentError(error));
    yield put(displayLoading(false));
  }
}

interface VerifyEmailPayload {
  email?: string;
}

function* VerifyEmailSaga({ payload }: { payload: VerifyEmailPayload }) {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${"verify-email"}`,
      params,
    });
    console.log(`==>> ${baseurl}${"verify-email"}`);

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(verifyEmailData(response));
    } else {
      console.log("Error:===2", response);
      yield put(verifyEmailError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
    yield put(verifyEmailError(error));
    yield put(displayLoading(false));
  }
}

interface SendOtpPayload {
  email?: string;
}

function* SendOtpSaga({ payload }: { payload: SendOtpPayload }) {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${"send-otp"}`,
      params,
    });
    console.log(`==>> ${baseurl}${"send-otp"}`);

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(sendOtpData(response));
    } else {
      console.log("Error:===2", response);
      yield put(sendOtpError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
    yield put(sendOtpError(error));
    yield put(displayLoading(false));
  }
}

interface VerifyOtpPayload {
  email?: string;
}

function* VerifyOtpSaga({ payload }: { payload: VerifyOtpPayload }) {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${'user/otpVerify'}`,
      params,
    });
    console.log(`==>> ${baseurl}${'user/otpVerify'}`)

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(verifyOtpData(response));
    } else {
      console.log("Error:===2", response);
      yield put(verifyOtpError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
    yield put(verifyOtpError(error));
    yield put(displayLoading(false));
  }
}

interface ResetPasswordPayload { }

function* ResetPasswordSaga({ payload }: { payload: ResetPasswordPayload }) {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${'user/ResetPassword'}`,
      params,
    });
    console.log(`==>> ${baseurl}${'user/ResetPassword'}`)

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(resetPasswordData(response));
    } else {
      console.log("Error:===2", response);
      yield put(resetPasswordError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
    yield put(resetPasswordError(error));
    yield put(displayLoading(false));
  }
}

interface SocialLoginPayload { }

function* SocialLoginSaga({ payload }: { payload: SocialLoginPayload }) {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${'user/checkSocialid'}`,
      params,
    });
    console.log(`==>> ${baseurl}${'user/checkSocialid'}`)

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(socialLoginData(response));
    } else {
      console.log("Error:===2", response);
      yield put(socialLoginError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
    yield put(socialLoginError(error));
    yield put(displayLoading(false));
  }
}


interface UpdateLocationPayload {
  userId?: string;
  longitude?: string;
  latitude?: string;
}

function* onUpdateLocationSaga({ payload }: { payload: UpdateLocationPayload }) {
  try {
    yield put(displayLoading(true));
    const params = {
      "userId": payload?.userId,
      "longitude": payload?.longitude,
      "latitude": payload?.latitude,
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${'user/updateLocation'}`,
      params,
    });
    console.log(`==>> ${baseurl}${'user/updateLocation'}`)

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(updateLocationData(response));
    } else {
      console.log("Error:===2", response);
      yield put(updateLocationError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
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

function* HomeSaga({ payload }: { payload: HomePayload }) {
  try {
    yield put(displayLoading(true));
    const params = {
      "lat": payload?.lat,
      "long": payload?.long,
      categoryid:payload?.categoryid,
      userId:payload?.userId,
      search_keyword: payload?.search_keyword,
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${'user/home'}`,
      params,
    });
    console.log(`==>> ${baseurl}${'user/home'}`)

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(homeData(response));
    } else {
      console.log("Error:===2", response);
      yield put(homeError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
    yield put(homeError(error));
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

function* FilterSaga({ payload }: { payload: FilterPayload }) {
  try {
    yield put(displayLoading(true));
    const params = {
      "lat": payload?.lat,
      "long": payload?.long,
      "categoryId": payload?.categoryId,
      "minPrice": payload?.minPrice,
      "maxPrice": payload?.maxPrice,
      "date": payload?.date,
      "minDistance": payload?.minDistance,
      "maxDistance": payload?.maxDistance,
      "userId": payload?.userId,
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${'user/filter'}`,
      params,
    });
    console.log(`==>> ${baseurl}${'user/filter'}`)

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(homeData(response));
    } else {
      console.log("Error:===2", response);
      yield put(homeError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
    yield put(homeError(error));
    yield put(displayLoading(false));
  }
}

interface ProfilePayload { }

function* getProfileSaga({ payload }: { payload: ProfilePayload }) {
  try {
    yield put(displayLoading(true));

    const response = yield call(fetchGet, {
      url: `${baseurl}${`user-profile`}`,
    });

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(profileData(response));
    } else {
      console.log("Errors", response);
      yield put(profileError(response));
    }
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error", error);
    yield put(profileError(error));
    yield put(displayLoading(false));
  }
}

interface LogoutPayload { }

function* LogoutSaga({ payload }: { payload: LogoutPayload }) {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${"logout"}`,
      params,
    });
    console.log(`==>> ${baseurl}${"logout"}`);

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(logoutData(response));
    } else {
      console.log("Error:===2", response);
      yield put(logoutError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
    yield put(logoutError(error));
    yield put(displayLoading(false));
  }
}


interface ViewdetailsPayload {
  id?: string;
}

function* ViewdetailsSaga({ payload }: { payload: ViewdetailsPayload }) {
  try {
    yield put(displayLoading(true));

    const response = yield call(fetchGet, {
      url: `${baseurl}${`user/viewdetails/${payload?.id}`}`,
    });

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(viewdetailsData(response));
    } else {
      console.log("Errors", response);
      yield put(viewdetailsError(response));
    }
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error", error);
    yield put(viewdetailsError(error));
    yield put(displayLoading(false));
  }
}

interface CategoryPayload {  
  page?: number;
  limit?: number;
}

function* CategorySaga({ payload }: { payload: CategoryPayload }) {
  try {
    yield put(displayLoading(true));

    const response = yield call(fetchGet, {
      url: `${baseurl}${`user/category?page=${payload?.page}&limit=${payload?.limit}`}`,
    });

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(categoryData(response));
    } else {
      console.log("Errors", response);
      yield put(categoryError(response));
    }
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error", error);
    yield put(categoryError(error));
    yield put(displayLoading(false));
  }
}

interface FacilityPayload {  
  page?: number;
  limit?: number;
}

function* FacilitySaga({ payload }: { payload: FacilityPayload }) {
  try {
    yield put(displayLoading(true));

    const response = yield call(fetchGet, {
      url: `${baseurl}${`user/facility?page=${payload?.page}&limit=${payload?.limit}`}`,
    });

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(facilityData(response));
    } else {
      console.log("Errors", response);
      yield put(facilityError(response));
    }
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error", error);
    yield put(facilityError(error));
    yield put(displayLoading(false));
  }
}


interface TogglefavoritePayload {
  eventId?: string;
}

function* TogglefavoriteSaga({ payload }: { payload: TogglefavoritePayload }) {
  try {
    yield put(displayLoading(true));
    const params = {
      "eventId": payload?.eventId,
      
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${'user/togglefavorite'}`,
      params,
    });
    console.log(`==>> ${baseurl}${'user/togglefavorite'}`)

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(togglefavoriteData(response));
    } else {
      console.log("Error:===2", response);
      yield put(togglefavoriteError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
    yield put(togglefavoriteError(error));
    yield put(displayLoading(false));
  }
}


interface FavoriteslistPayload {
  eventId?: string;
}

interface BookingrequestPayload {
  page: number;
  limit: number;
}

interface AcceptrejectPayload {
  bookingId: string;
  action: 'accept' | 'reject';
  reason: string;
}

interface CreateeventPayload {
  type: string;
  name: string;
  details: string;
  entryFee: number;
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

function* FavoriteslistSaga({ payload }: { payload: FavoriteslistPayload }) {
  try {
    yield put(displayLoading(true));
    const params = {
      "eventId": payload?.eventId,
      
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${'user/favoriteslist'}`,
      params,
    });
    console.log(`==>> ${baseurl}${'user/favoriteslist'}`)

    console.log("response:->", response);
    if (
      response?.status == 1 ||
      response?.status == true ||
      response?.status == "1" ||
      response?.status == "true"
    ) {
      yield put(favoriteslistData(response));
    } else {
      console.log("Error:===2", response);
      yield put(favoriteslistError(response));
    }
    //yield put(signinData(response));
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
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
  }
  
  function* BookingrequestSaga({ payload }: { payload: BookingrequestPayload }) {
    try {
      yield put(displayLoading(true));
      const params = {
        "status": 'pending',
        
      };
      const response = yield call(fetchPost, {
      url: `${baseurl}${`user/bookingrequest?page=${payload?.page}&limit=${payload?.limit}`}`,
      params,
    });
    
    console.log("BookingrequestSaga response:", response);
    
    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(bookingrequestData(response));
    } else {
      console.log("Error:===2", response);
      yield put(bookingrequestError(response));
    }
    
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
    yield put(bookingrequestError(error));
    yield put(displayLoading(false));
  }
}

function* AcceptrejectSaga({ payload }: { payload: AcceptrejectPayload }) {
  try {
    yield put(displayLoading(true));
    
    const params = {
      "bookingId": payload?.bookingId,
      "action": payload?.action,
      "reason": payload?.reason,
    };
    
    const response = yield call(fetchPut, {
      url: `${baseurl}${`user/acceptreject`}`,
      params,
    });
    
    console.log("AcceptrejectSaga response:", response);
    
    if (
      response?.status === true ||
      response?.status === "true" ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(acceptrejectData(response));
    } else {
      console.log("Error:===2", response);
      yield put(acceptrejectError(response));
    }
    
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
    yield put(acceptrejectError(error));
    yield put(displayLoading(false));
  }
}

function* CreateeventSaga({ payload }: { payload: CreateeventPayload }) {
  try {
    yield put(displayLoading(true));
    
    const response = yield call(fetchPost, {
      url: `${baseurl}${`user/createevent`}`,
      params: payload,
    });
    
    console.log("CreateeventSaga response:", response);
    
    if (
      response?.status === true ||
      response?.status === 'true' ||
      response?.status === 1 ||
      response?.status === "1"
    ) {
      yield put(createeventData(response));
    } else {
      console.log("Error:===2", response);
      yield put(createeventError(response));
    }
    
    yield put(displayLoading(false));
  } catch (error) {
    console.log("Error:===", error);
    yield put(createeventError(error));
    yield put(displayLoading(false));
  }
}

function* authSaga() {
  yield takeLatest(onSignin().type, onSigninSaga);
  yield takeLatest(onResendVerifyOtp().type, onResendVerifyOtpSaga);
  yield takeLatest(onUpdateProfileFields().type, UpdateProfileFieldsSaga);
  yield takeLatest(onGetDynamicContent().type, getDynamicContentSaga);
  yield takeLatest(onSignup().type, onSignupSaga);
  yield takeLatest(onVerifyEmail().type, VerifyEmailSaga);
  yield takeLatest(onSendOtp().type, SendOtpSaga);
  yield takeLatest(onVerifyOtp().type, VerifyOtpSaga);
  yield takeLatest(onForgotPassword().type, ForgotPasswordSaga);
  yield takeLatest(onResetPassword().type, ResetPasswordSaga);
  yield takeLatest(onSocialLogin().type, SocialLoginSaga);
  yield takeLatest(onProfile().type, getProfileSaga);
  yield takeLatest(onLogout().type, LogoutSaga);
  yield takeLatest(onUpdateLocation().type, onUpdateLocationSaga);

  yield takeLatest(onHome().type, HomeSaga);
  yield takeLatest(onFilter().type, FilterSaga);
  yield takeLatest(onViewdetails().type, ViewdetailsSaga);
  yield takeLatest(onCategory().type, CategorySaga);
  yield takeLatest(onFacility().type, FacilitySaga);
  yield takeLatest(onTogglefavorite().type, TogglefavoriteSaga);
  yield takeLatest(onFavoriteslist().type, FavoriteslistSaga);
  yield takeLatest(onBookingrequest().type, BookingrequestSaga);
  yield takeLatest(onAcceptreject().type, AcceptrejectSaga);
  yield takeLatest(onCreateevent().type, CreateeventSaga);

}

export default authSaga;
