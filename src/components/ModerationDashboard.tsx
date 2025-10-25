import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import { colors } from '../utilis/colors';
import { fonts } from '../utilis/fonts';
import LinearGradient from 'react-native-linear-gradient';
import BackArrow from '../assets/svg/ArrowLeft';
import ModerationService from '../services/moderationService';

interface ModerationDashboardProps {
  navigation?: any;
}

const ModerationDashboard: React.FC<ModerationDashboardProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    dismissedReports: 0,
    blockedUsers: 0,
  });
  const [pendingReports, setPendingReports] = useState<any[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);

  const moderationService = ModerationService.getInstance();

  useEffect(() => {
    loadModerationData();
  }, []);

  const loadModerationData = async () => {
    try {
      const moderationStats = moderationService.getModerationStats();
      const pending = moderationService.getPendingReports();
      const blocked = moderationService.getBlockedUsers();

      setStats(moderationStats);
      setPendingReports(pending);
      setBlockedUsers(blocked);
    } catch (error) {
      console.error('Failed to load moderation data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadModerationData();
    setRefreshing(false);
  };

  const handleReviewReport = (reportId: string) => {
    Alert.alert(
      'Review Report',
      'This would open a detailed review interface in a real app.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Review', onPress: () => console.log('Reviewing report:', reportId) },
      ]
    );
  };

  const handleUnblockUser = (userId: string) => {
    Alert.alert(
      'Unblock User',
      'Are you sure you want to unblock this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: async () => {
            await moderationService.unblockUser(userId, 'admin');
            await loadModerationData();
          },
        },
      ]
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderStatsCard = (title: string, value: number, color: string) => (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsTitle}>{title}</Text>
    </View>
  );

  const renderReportItem = (report: any) => (
    <View key={report.id} style={styles.reportItem}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportType}>{report.contentType.toUpperCase()}</Text>
        <Text style={styles.reportTime}>{formatTimestamp(report.timestamp)}</Text>
      </View>
      <Text style={styles.reportReason}>Reason: {report.reason}</Text>
      {report.details && (
        <Text style={styles.reportDetails}>{report.details}</Text>
      )}
      <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => handleReviewReport(report.id)}
      >
        <Text style={styles.reviewButtonText}>Review</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBlockedUserItem = (blockedUser: any) => (
    <View key={blockedUser.id} style={styles.blockedUserItem}>
      <View style={styles.blockedUserHeader}>
        <Text style={styles.blockedUserId}>User ID: {blockedUser.userId}</Text>
        <Text style={styles.blockedUserTime}>{formatTimestamp(blockedUser.timestamp)}</Text>
      </View>
      <Text style={styles.blockedUserReason}>Reason: {blockedUser.reason}</Text>
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblockUser(blockedUser.userId)}
      >
        <Text style={styles.unblockButtonText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.profileCardBackground} />
      
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
            <BackArrow />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Moderation Dashboard</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Statistics */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.statsGrid}>
              {renderStatsCard('Total Reports', stats.totalReports, colors.primary)}
              {renderStatsCard('Pending', stats.pendingReports, '#FFA500')}
              {renderStatsCard('Resolved', stats.resolvedReports, '#4CAF50')}
              {renderStatsCard('Dismissed', stats.dismissedReports, '#9E9E9E')}
              {renderStatsCard('Blocked Users', stats.blockedUsers, '#F44336')}
            </View>
          </View>

          {/* Pending Reports */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Pending Reports ({pendingReports.length})
            </Text>
            {pendingReports.length > 0 ? (
              pendingReports.map(renderReportItem)
            ) : (
              <Text style={styles.emptyText}>No pending reports</Text>
            )}
          </View>

          {/* Blocked Users */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Blocked Users ({blockedUsers.length})
            </Text>
            {blockedUsers.length > 0 ? (
              blockedUsers.map(renderBlockedUserItem)
            ) : (
              <Text style={styles.emptyText}>No blocked users</Text>
            )}
          </View>

          {/* 24-Hour Response Notice */}
          <View style={styles.noticeSection}>
            <Text style={styles.noticeTitle}>⚠️ 24-Hour Response Requirement</Text>
            <Text style={styles.noticeText}>
              All reports are automatically reviewed within 24 hours. 
              Violating content is removed immediately, and users are 
              warned, suspended, or banned based on severity.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  headerSpacer: {
    width: 35,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  statsValue: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 5,
  },
  statsTitle: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textColor,
  },
  reportItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FFA500',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportType: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  reportTime: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: colors.textColor,
  },
  reportReason: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.white,
    marginBottom: 5,
  },
  reportDetails: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textColor,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  reviewButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  reviewButtonText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  blockedUserItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#F44336',
  },
  blockedUserHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  blockedUserId: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  blockedUserTime: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: colors.textColor,
  },
  blockedUserReason: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textColor,
    marginBottom: 10,
  },
  unblockButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  unblockButtonText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textColor,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  noticeSection: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  noticeTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.white,
    lineHeight: 18,
  },
});

export default ModerationDashboard;
