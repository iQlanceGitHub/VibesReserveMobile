import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModerationService from '../services/moderationService';

interface ModerationContextType {
  eulaAccepted: boolean;
  acceptEULA: () => Promise<void>;
  reportContent: (contentType: string, contentId: string, reason: string, details: string, reporterId: string) => Promise<void>;
  blockUser: (userId: string, blockedBy: string, reason: string, userName?: string, userProfilePicture?: string) => Promise<void>;
  unblockUser: (userId: string, unblockedBy: string) => Promise<boolean>;
  isUserBlocked: (userId: string) => boolean;
  getBlockedUsers: () => any[];
  getBlockedUserInfo: (userId: string) => any;
  getModerationStats: () => any;
}

const ModerationContext = createContext<ModerationContextType | undefined>(undefined);

export const useModeration = () => {
  const context = useContext(ModerationContext);
  if (!context) {
    throw new Error('useModeration must be used within a ModerationProvider');
  }
  return context;
};

interface ModerationProviderProps {
  children: React.ReactNode;
}

export const ModerationProvider: React.FC<ModerationProviderProps> = ({ children }) => {
  const [eulaAccepted, setEulaAccepted] = useState(false);
  const moderationService = ModerationService.getInstance();

  useEffect(() => {
    checkEULAAcceptance();
  }, []);

  const checkEULAAcceptance = async () => {
    try {
      const eulaData = await AsyncStorage.getItem('eula_accepted');
      if (eulaData) {
        setEulaAccepted(true);
      }
    } catch (error) {
      console.error('Failed to check EULA acceptance:', error);
    }
  };

  const acceptEULA = async () => {
    try {
      const eulaVersion = "1.0";
      const timestamp = new Date().toISOString();
      
      await AsyncStorage.setItem("eula_accepted", JSON.stringify({
        version: eulaVersion,
        timestamp: timestamp,
      }));
      
      setEulaAccepted(true);
      console.log("EULA accepted locally:", { version: eulaVersion, timestamp });
    } catch (error) {
      console.error("Failed to accept EULA:", error);
      throw error;
    }
  };

  const reportContent = async (
    contentType: string,
    contentId: string,
    reason: string,
    details: string,
    reporterId: string
  ) => {
    try {
      await moderationService.reportContent(
        contentType as any,
        contentId,
        reason,
        details,
        reporterId
      );
    } catch (error) {
      console.error('Failed to report content:', error);
      throw error;
    }
  };

  const blockUser = async (userId: string, blockedBy: string, reason: string, userName?: string, userProfilePicture?: string) => {
    try {
      await moderationService.blockUser(userId, blockedBy, reason, userName, userProfilePicture);
    } catch (error) {
      console.error('Failed to block user:', error);
      throw error;
    }
  };

  const unblockUser = async (userId: string, unblockedBy: string): Promise<boolean> => {
    try {
      return await moderationService.unblockUser(userId, unblockedBy);
    } catch (error) {
      console.error('Failed to unblock user:', error);
      throw error;
    }
  };

  const isUserBlocked = (userId: string): boolean => {
    return moderationService.isUserBlocked(userId);
  };

  const getBlockedUsers = () => {
    return moderationService.getBlockedUsers();
  };

  const getBlockedUserInfo = (userId: string) => {
    return moderationService.getBlockedUserInfo(userId);
  };

  const getModerationStats = () => {
    return moderationService.getModerationStats();
  };

  const value: ModerationContextType = {
    eulaAccepted,
    acceptEULA,
    reportContent,
    blockUser,
    unblockUser,
    isUserBlocked,
    getBlockedUsers,
    getBlockedUserInfo,
    getModerationStats,
  };

  return (
    <ModerationContext.Provider value={value}>
      {children}
    </ModerationContext.Provider>
  );
};
