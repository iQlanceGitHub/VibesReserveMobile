import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserPermissions {
  canLike: boolean;
  canDislike: boolean;
  canBookmark: boolean;
  canReview: boolean;
  canBook: boolean;
}

export const getUserStatus = async (): Promise<'logged_in' | 'skipped' | 'guest' | null> => {
  try {
    const status = await AsyncStorage.getItem('user_status');
    return status as 'logged_in' | 'skipped' | 'guest' | null;
  } catch (error) {
    console.error('Error getting user status:', error);
    return null;
  }
};

export const getUserPermissions = async (): Promise<UserPermissions | null> => {
  try {
    const permissions = await AsyncStorage.getItem('user_permissions');
    return permissions ? JSON.parse(permissions) : null;
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return null;
  }
};

export const checkPermission = async (action: keyof UserPermissions): Promise<boolean> => {
  try {
    const permissions = await getUserPermissions();
    const status = await getUserStatus();
    
    // If user is logged in, they have all permissions
    if (status === 'logged_in') {
      return true;
    }
    
    // If user is skipped or guest, check specific permission
    return permissions ? permissions[action] : false;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

export const showLoginAlert = (navigation: any, action: string = 'this action') => {
  // This will be handled by the custom alert component
  // We'll return a flag to indicate that the alert should be shown
  return {
    shouldShowAlert: true,
    title: 'Login Required',
    message: `Please sign in to ${action}. You can explore the app without an account, but some features require login.`,
    primaryButtonText: 'Sign In',
    secondaryButtonText: 'Continue Exploring',
    onPrimaryPress: () => navigation.navigate('SignInScreen'),
  };
};

export const handleRestrictedAction = async (
  action: keyof UserPermissions,
  navigation: any,
  actionName: string = 'perform this action'
): Promise<boolean> => {
  const hasPermission = await checkPermission(action);
  
  if (!hasPermission) {
    // Return the alert config instead of showing it directly
    return false;
  }
  
  return true;
};
