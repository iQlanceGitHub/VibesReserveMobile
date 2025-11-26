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
        console.log('🔔 AppWrapper: Starting notification initialization...');
        
        // Initialize the notification service
        await notificationService.initialize();
        console.log('✅ AppWrapper: Notification service initialized');
        
        // Get FCM token with retry logic
        let token = null;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (!token && retryCount < maxRetries) {
          try {
            token = await notificationService.getToken();
            if (token) {
              console.log('✅ AppWrapper: FCM token obtained:', token);
              break;
            }
          } catch (error) {
            console.log(`⚠️ AppWrapper: Token attempt ${retryCount + 1} failed:`, error);
          }
          
          retryCount++;
          if (retryCount < maxRetries) {
            // Wait 1 second before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        if (token) {
          // Store token in Redux for use in login/sign-up
          dispatch(setDeviceToken(token));
          console.log('✅ AppWrapper: Device token stored in Redux');
        } else {
          // Use fallback token for development
          const fallbackToken = `dev_fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          dispatch(setDeviceToken(fallbackToken));
          console.log('⚠️ AppWrapper: Using fallback token:', fallbackToken);
        }
      } catch (error) {
        console.error('❌ AppWrapper: Error initializing notifications:', error);
        
        // Use fallback token for development
        const fallbackToken = `dev_fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        dispatch(setDeviceToken(fallbackToken));
        console.log('⚠️ AppWrapper: Using fallback token due to error:', fallbackToken);
      }
    };
    
    // Initialize after a short delay to ensure Firebase is ready
    setTimeout(() => {
      initializeNotifications();
    }, 3000); // Increased delay to 3 seconds
    
  }, [dispatch]);


  // Return null since this component only handles push notifications
  return null;
};

export default AppWrapper;