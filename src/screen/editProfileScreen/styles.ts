import { StyleSheet } from "react-native";
import { colors } from "../../utilis/colors";
import { fonts } from "../../utilis/fonts";
import {
  horizontalScale,
  verticalScale,
  fontScale,
} from "../../utilis/appConstant";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gradient_dark_purple,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(36),
  },
  headerTitle: {
    fontSize: fontScale(20),
    fontWeight: "600",
    lineHeight: fontScale(24),
    fontFamily: fonts.semiBold,
    color: colors.white,
    textAlign: "center",
  },
  headerSpacer: {
    width: horizontalScale(40),
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(120),
    flexGrow: 1,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: verticalScale(22),
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: horizontalScale(94),
    height: horizontalScale(94),
    borderRadius: horizontalScale(47),
    borderWidth: horizontalScale(4),
    borderColor: colors.violate,
  },
  defaultProfileContainer: {
    width: horizontalScale(94),
    height: horizontalScale(94),
    borderRadius: horizontalScale(47),
    borderWidth: horizontalScale(3),
    borderColor: colors.violate,
    backgroundColor: colors.profileCardBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  editProfileButton: {
    position: "absolute",
    bottom: verticalScale(0),
    right: horizontalScale(0),
    width: horizontalScale(26),
    height: horizontalScale(26),
    borderRadius: horizontalScale(18),
    backgroundColor: colors.violate,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.gradient_dark_purple,
  },
  formContainer: {
    paddingHorizontal: horizontalScale(20),
  },
  inputField: {
    marginBottom: verticalScale(16),
  },
  documentLabel: {
    fontSize: fontScale(14),
    fontWeight: "500",
    lineHeight: fontScale(18),
    fontFamily: fonts.medium,
    color: colors.white,
    marginBottom: verticalScale(8),
  },
  documentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.profileCardBackground,
    width: horizontalScale(332),
    height: verticalScale(105),
    borderRadius: 20,
    padding: horizontalScale(16),
    borderWidth: 1,
    borderColor: colors.whiteTransparentMedium,
    gap: 8,
  },
  documentThumbnail: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  documentImage: {
    width: horizontalScale(133),
    height: verticalScale(77),
    borderRadius: 13.41,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: colors.whiteTransparentMedium,
  },
  updateButton: {
    backgroundColor: colors.violate,
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(10),
    borderRadius: horizontalScale(20),
    alignItems: "center",
    justifyContent: "center",
  },
  updateButtonText: {
    fontSize: fontScale(12),
    lineHeight: fontScale(16),
    fontWeight: "400",
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  buttonContainer: {
    position: "absolute",
    bottom: verticalScale(0),
    left: horizontalScale(0),
    right: horizontalScale(0),
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(30),
    paddingTop: verticalScale(20),
    backgroundColor: colors.gradient_dark_purple,
  },
  saveButton: {
    width: "100%",
    marginBottom: verticalScale(0),
  },
  documentImageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 13.41,
  },
  noDocumentText: {
    color: colors.gray,
    fontSize: 12,
    textAlign: "center",
  },
});
