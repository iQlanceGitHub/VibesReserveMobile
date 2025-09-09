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
} from "./actions";

import { base_url_client, base_url_qa } from "../apiConstant";
import { fetchPost, fetchGet } from "../services";

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
      "currentRole":"user",
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

function* SignupSaga({ payload }: { payload: SignupPayload }) {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${"signUp"}`,
      params,
    });
    console.log(`==>> ${baseurl}${"signUp"}`);
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
    const params = {
      email: payload.email,
    };
    const response = yield call(fetchPost, {
      url: `${baseurl}${"resend-verify-otp"}`,
      params,
    });
    console.log(`==>> ${baseurl}${"resend-verify-otp"}`);

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
      url: `${baseurl}${"verify-otp"}`,
      params,
    });
    console.log(`==>> ${baseurl}${"verify-otp"}`);

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

interface ResetPasswordPayload {}

function* ResetPasswordSaga({ payload }: { payload: ResetPasswordPayload }) {
  try {
    yield put(displayLoading(true));
    const params = payload;
    const response = yield call(fetchPost, {
      url: `${baseurl}${"reset-password"}`,
      params,
    });
    console.log(`==>> ${baseurl}${"reset-password"}`);

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

interface SocialLoginPayload {}

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

interface ProfilePayload {}

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

interface LogoutPayload {}

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

function* authSaga() {
  yield takeLatest(onSignin().type, onSigninSaga);
  yield takeLatest(onResendVerifyOtp().type, onResendVerifyOtpSaga);
  yield takeLatest(onUpdateProfileFields().type, UpdateProfileFieldsSaga);
  yield takeLatest(onGetDynamicContent().type, getDynamicContentSaga);
  yield takeLatest(onSignup().type, SignupSaga);
  yield takeLatest(onVerifyEmail().type, VerifyEmailSaga);
  yield takeLatest(onSendOtp().type, SendOtpSaga);
  yield takeLatest(onVerifyOtp().type, VerifyOtpSaga);
  yield takeLatest(onResetPassword().type, ResetPasswordSaga);
  yield takeLatest(onSocialLogin().type, SocialLoginSaga);
  yield takeLatest(onProfile().type, getProfileSaga);
  yield takeLatest(onLogout().type, LogoutSaga);
}

export default authSaga;
