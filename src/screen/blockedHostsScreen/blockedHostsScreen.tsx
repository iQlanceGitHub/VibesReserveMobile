import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utilis/colors';
import { fonts } from '../../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../../utilis/appConstant';
import LinearGradient from 'react-native-linear-gradient';
import BackArrow from '../../assets/svg/ArrowLeft';
import { useModeration } from '../../contexts/ModerationContext';
import { showToast } from '../../utilis/toastUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

const BlockedHostsScreen = () => {
  const navigation = useNavigation();
  const { getBlockedUsers, unblockUser } = useModeration();
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    loadBlockedUsers();
    loadCurrentUserId();
  }, []);

  const loadCurrentUserId = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem("user_data");
      if (userDataStr) {
        const parsed = JSON.parse(userDataStr);
        const id = parsed?.id || parsed?._id || "";
        setCurrentUserId(id);
      }
    } catch (error) {
      console.error('Failed to load current user ID:', error);
    }
  };

  const loadBlockedUsers = () => {
    const blocked = getBlockedUsers();
    setBlockedUsers(blocked);
  };

  const handleUnblockUser = async (userId: string, userName: string) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${userName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Unblock',
          onPress: async () => {
            try {
              await unblockUser(userId, currentUserId);
              showToast('success', `${userName} has been unblocked successfully`);
              loadBlockedUsers(); // Refresh the list
            } catch (error) {
              console.error('Failed to unblock user:', error);
              showToast('error', 'Failed to unblock user. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderBlockedUser = (user: any) => (
    <View key={user.id} style={styles.blockedUserCard}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>
            {user.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {user.userName || 'Unknown User'}
          </Text>
          <Text style={styles.blockReason}>
            Blocked: {user.reason || 'No reason provided'}
          </Text>
          <Text style={styles.blockDate}>
            {new Date(user.timestamp).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblockUser(user.userId, user.userName)}
      >
        <Text style={styles.unblockButtonText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.profileCardBackground} />
      
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <BackArrow />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Blocked Hosts</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {blockedUsers.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Blocked Hosts</Text>
                <Text style={styles.emptyDescription}>
                  You haven't blocked any hosts yet. Blocked hosts will appear here.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.summaryContainer}>
                  <Text style={styles.summaryText}>
                    You have blocked {blockedUsers.length} host{blockedUsers.length !== 1 ? 's' : ''}
                  </Text>
                </View>
                {blockedUsers.map(renderBlockedUser)}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default BlockedHostsScreen;
