import { StyleSheet } from "react-native";
import { colors } from "../../../../utilis/colors";
import { fonts } from "../../../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../../../utilis/appConstant";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.hostGradientStart,
  },
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    // Remove default padding as we're handling it with useSafeAreaInsets
  },
  contentContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: fontScale(14),
    fontWeight: "800",
    fontFamily: fonts.ExtraBold,
    color: colors.white,
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(15),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(20),
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: horizontalScale(40),
    paddingVertical: verticalScale(60),
  },
  emptyText: {
    fontSize: fontScale(18),
    fontWeight: "600",
    fontFamily: fonts.SemiBold,
    color: colors.white,
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: fontScale(14),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.whiteTransparentMedium,
    textAlign: "center",
    lineHeight: fontScale(20),
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlayBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.backgroundColor,
    borderRadius: horizontalScale(16),
    padding: horizontalScale(20),
    marginHorizontal: horizontalScale(20),
    maxHeight: verticalScale(500),
    width: '90%',
    borderWidth: 1,
    borderColor: colors.violate20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  modalTitle: {
    fontSize: fontScale(18),
    fontWeight: '700',
    fontFamily: fonts.Bold,
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: horizontalScale(32),
    height: verticalScale(32),
    borderRadius: horizontalScale(16),
    backgroundColor: colors.vilate20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.violate,
  },
  modalSubtitle: {
    fontSize: fontScale(14),
    fontWeight: '400',
    fontFamily: fonts.Regular,
    color: colors.textColor,
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  reasonTextInput: {
    borderWidth: 1,
    borderColor: colors.violate20,
    borderRadius: horizontalScale(12),
    padding: horizontalScale(16),
    fontSize: fontScale(14),
    fontFamily: fonts.Regular,
    color: colors.white,
    backgroundColor: colors.unselectedBackground,
    marginBottom: verticalScale(20),
    textAlignVertical: 'top',
    minHeight: verticalScale(100),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: horizontalScale(12),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(20),
    borderRadius: horizontalScale(12),
    borderWidth: 1,
    borderColor: colors.textColor,
    alignItems: 'center',
    backgroundColor: colors.transparent,
  },
  cancelButtonText: {
    fontSize: fontScale(14),
    fontWeight: '600',
    fontFamily: fonts.SemiBold,
    color: colors.textColor,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(20),
    borderRadius: horizontalScale(12),
    backgroundColor: colors.red,
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: fontScale(14),
    fontWeight: '600',
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
  doneButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(20),
    borderRadius: horizontalScale(12),
    backgroundColor: colors.violate,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: fontScale(14),
    fontWeight: '600',
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(20),
    borderRadius: horizontalScale(12),
    backgroundColor: colors.violate,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: fontScale(14),
    fontWeight: '600',
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
});

export default styles;
