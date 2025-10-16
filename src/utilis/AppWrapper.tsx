import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import messaging from "@react-native-firebase/messaging";
import { setDeviceToken } from "../redux/auth/actions";
import notificationService from "../services/notificationService";

const AppWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    
    // Initialize notification service
    const initializeNotifications = async () => {
      try {
        // Initialize the notification service
        await notificationService.initialize();
        
        // Get FCM token
        const token = await notificationService.getToken();
        
        if (token) {
          // Store token in Redux for use in login/sign-up
          dispatch(setDeviceToken(token));
        } else {
          // Use fallback token for development
          const fallbackToken = `dev_fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          dispatch(setDeviceToken(fallbackToken));
        }
      } catch (error) {
        console.error('❌ Error initializing notifications:', error);
        
        // Use fallback token for development
        const fallbackToken = `dev_fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        dispatch(setDeviceToken(fallbackToken));
      }
    };
    
    // Initialize after a short delay to ensure Firebase is ready
    setTimeout(() => {
      initializeNotifications();
    }, 2000);
    
  }, [dispatch]);


  // Return null since this component only handles push notifications
  return null;
};

export default AppWrapper;