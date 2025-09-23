import produce from 'immer';

import { handleActions } from 'redux-actions';

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

  getDynamicContentData,
  getDynamicContentError,

  updateLocationData,
  updateLocationError,

  homeData,
  homeError,

  filterData,
  filterError,

  viewdetailsData,
  viewdetailsError,

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

} from './actions';

export const initialState = {
  loader: false,
  status: false,
  internetConnection: false,
  signup: '',
  signupErr: '',
  signin: '',
  signinErr: '',
  resendVerifyOtp: '',
  resendVerifyOtpErr: '',
  verifyEmail: '',
  verifyEmailErr: '',
  sendOtp: '',
  sendOtpErr: '',
  verifyOtp: '',
  verifyOtpErr: '',

  forgotPassword: '',
  forgotPasswordErr: '',

  resetPassword: '',
  resetPasswordErr: '',
  socialLogin: '',
  socialLoginErr: '',
  updateProfileFields: '',
  updateProfileFieldsErr: '',
  profile: '',
  profileErr: '',
  logout: '',
  logoutErr: '',
  getDynamicContent: '',
  getDynamicContentErr: '',
  updateLocation: '',
  updateLocationErr: '',

  home: '',
  homeErr: '',

  filter: '',
  filterErr: '',

  viewdetails: '',
  viewdetailsErr: '',

  category: '',
  categoryErr: '',

  facility: '',
  facilityErr: '',

  togglefavorite: '',
  togglefavoriteErr: '',

  favoriteslist: '',
  favoriteslistErr: '',

  bookingrequest: '',
  bookingrequestErr: '',

  acceptreject: '',
  acceptrejectErr: '',

  createevent: '',
  createeventErr: '',

  user: '',

};

const authReducer = handleActions(
  {
    [displayLoading().type]: produce((draft, action) => {
      draft.loader = action.payload;
    }),

    [onStatus().type]: produce((draft, action) => {
      draft.status = action.payload;
    }),

    //Set USer
    [setUser().type]: produce((draft, action) => {
      draft.user = action.payload;
    }),

    // INTERNET CONNECTIVITY
    [internetConnectivity().type]: produce((draft, action) => {
      draft.internetConnection = action.payload;
    }),

    // payload signin
    [signinData().type]: produce((draft, action) => {
      console.log('payload signin', action.payload);
      draft.signin = action.payload;
    }),
    [signinError().type]: produce((draft, action) => {
      console.log('payload signin Eror', action.payload);
      draft.signinErr = action.payload;
    }),

    // payload signup
    [signupData().type]: produce((draft, action) => {
      console.log('payload signup', action.payload);
      draft.signup = action.payload;
    }),
    [signupError().type]: produce((draft, action) => {
      console.log('payload signup Eror', action.payload);
      draft.signupErr = action.payload;
    }),


    // payload resendVerifyOtp
    [resendVerifyOtpData().type]: produce((draft, action) => {
      console.log('payload resend Verify Otp', action.payload);
      draft.resendVerifyOtp = action.payload;
    }),
    [resendVerifyOtpError().type]: produce((draft, action) => {
      console.log('payload resend Verify Otp Err', action.payload);
      draft.resendVerifyOtpErr = action.payload;
    }),


    // payload verifyEmailData
    [verifyEmailData().type]: produce((draft, action) => {
      console.log('payload verify Email', action.payload);
      draft.verifyEmail = action.payload;
    }),
    [verifyEmailError().type]: produce((draft, action) => {
      console.log('payload verify Email Err', action.payload);
      draft.verifyEmailErr = action.payload;
    }),


    // payload verifyEmailData
    [sendOtpData().type]: produce((draft, action) => {
      console.log('payload send Otp', action.payload);
      draft.sendOtp = action.payload;
    }),
    [sendOtpError().type]: produce((draft, action) => {
      console.log('payload send Otp Err', action.payload);
      draft.sendOtpErr = action.payload;
    }),

    // payload verifyOtpData
    [verifyOtpData().type]: produce((draft, action) => {
      console.log('payload verify Otp', action.payload);
      draft.verifyOtp = action.payload;
    }),
    [verifyOtpError().type]: produce((draft, action) => {
      console.log('payload verify Otp Err', action.payload);
      draft.verifyOtpErr = action.payload;
    }),

    // payload ForgotPasswordData
    [forgotPasswordData().type]: produce((draft, action) => {
      console.log('payload forgot Password', action.payload);
      draft.forgotPassword = action.payload;
    }),
    [forgotPasswordError().type]: produce((draft, action) => {
      console.log('payload forgot Password Err', action.payload);
      draft.forgotPasswordErr = action.payload;
    }),


    // payload resetPasswordData
    [resetPasswordData().type]: produce((draft, action) => {
      console.log('payload reset Password ', action.payload);
      draft.resetPassword = action.payload;
    }),
    [resetPasswordError().type]: produce((draft, action) => {
      console.log('payload reset Password Err', action.payload);
      draft.resetPasswordErr = action.payload;
    }),

    [socialLoginData().type]: produce((draft, action) => {
      console.log('payload social Login ', action.payload);
      draft.socialLogin = action.payload;
    }),
    [socialLoginError().type]: produce((draft, action) => {
      console.log('payload social Login Err', action.payload);
      draft.socialLoginErr = action.payload;
    }),

    [updateProfileFieldsData().type]: produce((draft, action) => {
      console.log('payload update Profile Fields ', action.payload);
      draft.updateProfileFields = action.payload;
    }),
    [updateProfileFieldsError().type]: produce((draft, action) => {
      console.log('payload update Profile Fields Err', action.payload);
      draft.updateProfileFieldsErr = action.payload;
    }),
    [profileData().type]: produce((draft, action) => {
      console.log('payload profile ', action.payload);
      draft.profile = action.payload;
    }),
    [profileError().type]: produce((draft, action) => {
      console.log('payload profile Err', action.payload);
      draft.profileErr = action.payload;
    }),


    [logoutData().type]: produce((draft, action) => {
      console.log('payload logout ', action.payload);
      draft.logout = action.payload;
    }),
    [logoutError().type]: produce((draft, action) => {
      console.log('payload logout Err', action.payload);
      draft.logoutErr = action.payload;
    }),

    [getDynamicContentData().type]: produce((draft, action) => {
      console.log('payload getDynamicContent ', action.payload);
      draft.getDynamicContent = action.payload;
    }),
    [getDynamicContentError().type]: produce((draft, action) => {
      console.log('payload get Dynamic Content Err ', action.payload);
      draft.getDynamicContentErr = action.payload;
    }),

    [updateLocationData().type]: produce((draft, action) => {
      console.log('payload updateLocation ', action.payload);
      draft.updateLocation = action.payload;
    }),
    [updateLocationError().type]: produce((draft, action) => {
      console.log('payload updateLocationErr Err ', action.payload);
      draft.updateLocationErr = action.payload;
    }),

    // payload home
    [homeData().type]: produce((draft, action) => {
      console.log('payload home', action.payload);
      draft.home = action.payload;
    }),
    [homeError().type]: produce((draft, action) => {
      console.log('payload home Error', action.payload);
      draft.homeErr = action.payload;
    }),

     // payload filter
    [filterData().type]: produce((draft, action) => {
      console.log('payload filter', action.payload);
      draft.filter = action.payload;
    }),
    [filterError().type]: produce((draft, action) => {
      console.log('payload filter Error', action.payload);
      draft.filterErr = action.payload;
    }),

     // payload viewdetails
    [viewdetailsData().type]: produce((draft, action) => {
      console.log('payload viewdetails', action.payload);
      draft.viewdetails = action.payload;
    }),
    [viewdetailsError().type]: produce((draft, action) => {
      console.log('payload viewdetails Error', action.payload);
      draft.viewdetailsErr = action.payload;
    }),

    // payload category
    [categoryData().type]: produce((draft, action) => {
      console.log('payload category', action.payload);
      draft.category = action.payload;
    }),
    [categoryError().type]: produce((draft, action) => {
      console.log('payload category Error', action.payload);
      draft.categoryErr = action.payload;
    }),

    // payload facility
    [facilityData().type]: produce((draft, action) => {
      console.log('payload facility', action.payload);
      draft.facility = action.payload;
    }),
    [facilityError().type]: produce((draft, action) => {
      console.log('payload facility Error', action.payload);
      draft.facilityErr = action.payload;
    }),

    // payload togglefavorite
    [togglefavoriteData().type]: produce((draft, action) => {
      console.log('payload togglefavorite', action.payload);
      draft.togglefavorite = action.payload;
    }),
    [togglefavoriteError().type]: produce((draft, action) => {
      console.log('payload togglefavorite Error', action.payload);
      draft.togglefavoriteErr = action.payload;
    }),

     // payload favoriteslist
    [favoriteslistData().type]: produce((draft, action) => {
      console.log('payload togglefavorite', action.payload);
      draft.favoriteslist = action.payload;
    }),
    [favoriteslistError().type]: produce((draft, action) => {
      console.log('payload togglefavorite Error', action.payload);
      draft.favoriteslistErr = action.payload;
    }),

    // payload bookingrequest
    [bookingrequestData().type]: produce((draft, action) => {
      console.log('payload bookingrequest', action.payload);
      draft.bookingrequest = action.payload;
    }),
    [bookingrequestError().type]: produce((draft, action) => {
      console.log('payload bookingrequest Error', action.payload);
      draft.bookingrequestErr = action.payload;
    }),

    // payload acceptreject
    [acceptrejectData().type]: produce((draft, action) => {
      console.log('payload acceptreject', action.payload);
      draft.acceptreject = action.payload;
    }),
    [acceptrejectError().type]: produce((draft, action) => {
      console.log('payload acceptreject Error', action.payload);
      draft.acceptrejectErr = action.payload;
    }),

    // payload createevent
    [createeventData().type]: produce((draft, action) => {
      console.log('payload createevent', action.payload);
      draft.createevent = action.payload;
    }),
    [createeventError().type]: produce((draft, action) => {
      console.log('payload createevent Error', action.payload);
      draft.createeventErr = action.payload;
    }),
    
  },
  initialState,
);

export default authReducer;
