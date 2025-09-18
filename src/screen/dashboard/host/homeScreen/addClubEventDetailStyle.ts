import { StyleSheet } from "react-native";
import { colors } from "../../../../utilis/colors";
import { fonts } from "../../../../utilis/fonts";
import {
  horizontalScale,
  verticalScale,
  fontScale,
} from "../../../../utilis/appConstant";

const addClubDetailStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gradient_dark_purple,
  },
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(20),
  },
  headerTitle: {
    color: colors.white,
    fontSize: fontScale(20),
    fontWeight: "600",
    fontFamily: fonts.semiBold,
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: horizontalScale(30),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
  },
  formElement: {
    marginBottom: verticalScale(16),
  },
  errorText: {
    color: colors.red,
    fontSize: fontScale(12),
    fontFamily: fonts.regular,
    marginTop: verticalScale(4),
    marginLeft: horizontalScale(4),
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: horizontalScale(8),
  },
  typeContainer: {
    paddingVertical: verticalScale(8),
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(15),
  },
  timeInputContainer: {
    flex: 1,
    marginHorizontal: horizontalScale(5),
    position: "relative",
  },
  timePickerButton: {
    position: "absolute",
    right: 15,
    top: 40,
    zIndex: 1,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  timeInputButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.transparent,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: colors.whiteTransparentMedium,
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(15),
    minHeight: verticalScale(50),
  },
  timeInputText: {
    color: colors.white,
    fontSize: fontScale(15),
    fontFamily: fonts.reguler,
    flex: 1,
  },
  timeInputPlaceholder: {
    color: colors.white,
    fontSize: fontScale(15),
    fontFamily: fonts.reguler,
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(15),
  },
  dateInputContainer: {
    flex: 1,
    marginHorizontal: horizontalScale(5),
  },
  label: {
    color: colors.white,
    fontSize: fontScale(14),
    fontFamily: fonts.medium,
    marginBottom: verticalScale(8),
  },
  required: {
    color: colors.textColor,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.transparent,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: colors.whiteTransparentMedium,
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(15),
    minHeight: verticalScale(50),
  },
  dropdownButtonError: {
    borderColor: colors.red,
  },
  dropdownText: {
    color: colors.white,
    fontSize: fontScale(15),
    fontFamily: fonts.reguler,
    flex: 1,
  },
  placeholderText: {
    color: colors.textColor,
  },
  capacityContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: verticalScale(15),
  },
  capacityButton: {
    width: horizontalScale(40),
    height: verticalScale(40),
    borderRadius: 20,
    backgroundColor: colors.violate,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: horizontalScale(10),
    marginBottom: verticalScale(5),
  },
  capacityButtonText: {
    color: colors.white,
    fontSize: fontScale(12),
    fontFamily: fonts.semiBold,
  },

  // Image Section
  imageSection: {
    marginBottom: verticalScale(20),
  },
  sectionLabel: {
    color: colors.white,
    fontSize: fontScale(14),
    fontFamily: fonts.medium,
    marginBottom: verticalScale(8),
  },
  imageContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  imageBoxesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  imageUploadBox: {
    width: horizontalScale(100),
    height: verticalScale(100),
    borderRadius: horizontalScale(20),
    borderWidth: horizontalScale(1),
    borderColor: colors.whiteTransparentMedium,
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(10),
  },
  addNewBoothButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.transparent,
    paddingHorizontal: horizontalScale(5),
    paddingVertical: verticalScale(5),
    alignSelf: "flex-end",
  },
  addNewBoothText: {
    color: colors.white,
    fontSize: fontScale(12),
    fontFamily: fonts.medium,
    marginLeft: horizontalScale(5),
  },

  // Upload Photos Row
  uploadPhotosRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  facilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  facilityCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "31%",
    marginBottom: verticalScale(12),
  },
  facilityCheckbox: {
    width: verticalScale(20),
    height: verticalScale(20),
    borderRadius: verticalScale(4),
    borderWidth: 1,
    borderColor: colors.disableGray,
    backgroundColor: colors.transparent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: horizontalScale(8),
  },
  facilityCheckedBox: {
    backgroundColor: colors.violate,
    borderColor: colors.violate,
  },
  facilityCheckmark: {
    color: colors.white,
    fontSize: fontScale(12),
    fontWeight: "600",
  },
  facilityCheckboxText: {
    color: colors.textcolor,
    fontSize: fontScale(14),
    fontFamily: fonts.medium,
    flex: 1,
  },

  // Date Picker Custom Style
  datePickerWrapper: {
    position: "relative",
  },
  datePickerRightIcon: {
    position: "absolute",
    right: horizontalScale(15),
    top: verticalScale(40),
    zIndex: 1,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: colors.violate,
    borderRadius: 25,
    paddingVertical: verticalScale(15),
    marginTop: verticalScale(20),
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlayBackground,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    padding: horizontalScale(20),
    width: "80%",
    maxHeight: "60%",
  },
  modalTitle: {
    color: colors.white,
    fontSize: fontScale(18),
    fontFamily: fonts.semiBold,
    textAlign: "center",
    marginBottom: verticalScale(20),
  },
  modalItem: {
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalItemText: {
    color: colors.white,
    fontSize: fontScale(16),
    fontFamily: fonts.medium,
  },
  modalCloseButton: {
    marginTop: verticalScale(15),
    paddingVertical: verticalScale(12),
    alignItems: "center",
  },
  modalCloseText: {
    color: colors.textColor,
    fontSize: fontScale(16),
    fontFamily: fonts.medium,
  },
  addNewTicketButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  addNewTicketText: {
    color: colors.white,
    fontSize: fontScale(14),
    fontWeight: "500",
    fontFamily: fonts.medium,
    marginLeft: horizontalScale(8),
  },
  capacityFormElement: {
    marginBottom: verticalScale(8),
  },
});

export default addClubDetailStyle;
