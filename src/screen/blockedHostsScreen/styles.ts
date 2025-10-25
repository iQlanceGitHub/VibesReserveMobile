import { StyleSheet } from 'react-native';
import { colors } from '../../utilis/colors';
import { fonts } from '../../utilis/fonts';
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from '../../utilis/appConstant';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: fontScale(18),
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
    marginHorizontal: horizontalScale(20),
  },
  headerSpacer: {
    width: 35,
  },
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(60),
  },
  emptyTitle: {
    fontSize: fontScale(20),
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: fontScale(14),
    fontFamily: fonts.regular,
    color: colors.white,
    textAlign: 'center',
    lineHeight: fontScale(20),
    opacity: 0.8,
  },
  summaryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: verticalScale(10),
    padding: horizontalScale(15),
    marginBottom: verticalScale(20),
  },
  summaryText: {
    fontSize: fontScale(14),
    fontFamily: fonts.medium,
    color: colors.white,
    textAlign: 'center',
  },
  blockedUserCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: verticalScale(12),
    padding: horizontalScale(15),
    marginBottom: verticalScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: horizontalScale(50),
    height: verticalScale(50),
    borderRadius: verticalScale(25),
    backgroundColor: colors.violate,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(12),
  },
  userAvatarText: {
    fontSize: fontScale(18),
    fontFamily: fonts.bold,
    color: colors.white,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: fontScale(16),
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: verticalScale(4),
  },
  blockReason: {
    fontSize: fontScale(12),
    fontFamily: fonts.medium,
    color: '#FF4444',
    marginBottom: verticalScale(2),
  },
  blockDate: {
    fontSize: fontScale(11),
    fontFamily: fonts.regular,
    color: colors.white,
    opacity: 0.7,
  },
  unblockButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(8),
    borderRadius: verticalScale(20),
  },
  unblockButtonText: {
    fontSize: fontScale(12),
    fontFamily: fonts.medium,
    color: colors.white,
  },
});

export default styles;
