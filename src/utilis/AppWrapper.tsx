import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import messaging from "@react-native-firebase/messaging";
import { setDeviceToken } from "../redux/auth/actions";

const AppWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    
    // Get FCM token directly using the working approach
    const getToken = async () => {
      try {
        const token = await messaging().getToken();
        
        // Store token in Redux for use in login/sign-up
        dispatch(setDeviceToken(token));
        
      } catch (error) {
        
        // Use fallback token for development
        const fallbackToken = `dev_fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        dispatch(setDeviceToken(fallbackToken));
      }
    };
    
    // Get token after a short delay to ensure Firebase is ready
    setTimeout(() => {
      getToken();
    }, 2000);
    
  }, [dispatch]);


  // Return null since this component only handles push notifications
  return null;
};

export default AppWrapper;