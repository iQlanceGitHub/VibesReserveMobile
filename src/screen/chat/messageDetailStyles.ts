import { StyleSheet } from "react-native";
import { colors } from "../../utilis/colors";
import { fonts } from "../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../utilis/appConstant";

export default StyleSheet.create({
  container: {
    flex: verticalScale(1),
    backgroundColor: colors.gradient_dark_purple,
  },
  safeArea: {
    flex: verticalScale(1),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(16),
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: horizontalScale(16),
  },
  headerAvatar: {
    width: verticalScale(48),
    height: verticalScale(48),
    borderRadius: verticalScale(90),
    marginRight: horizontalScale(12),
    borderWidth: verticalScale(2),
    borderColor: colors.violate,
  },
  userDetails: {
    flex: 1,
  },
  headerUserName: {
    fontSize: fontScale(16),
    fontFamily: fonts.Bold,
    fontWeight: "700",
    color: colors.white,
    marginBottom: verticalScale(2),
  },
  onlineStatus: {
    fontSize: fontScale(12),
    fontFamily: fonts.Regular,
    fontWeight: "400",
    color: colors.textColor,
  },
  messagesContainer: {
    flex: verticalScale(1),
  },
  scrollView: {
    flex: verticalScale(1),
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(16),
  },
  messageContainer: {
    marginBottom: verticalScale(25),
  },
  userMessage: {
    alignItems: "flex-end",
  },
  otherMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: horizontalScale(280),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    borderRadius: verticalScale(20),
    marginBottom: verticalScale(4),
  },
  userBubble: {
    backgroundColor: colors.violate,
  },
  otherBubble: {
    backgroundColor: colors.cardBackground,
    borderWidth: verticalScale(1),
    borderColor: colors.purpleBorder,
  },
  messageText: {
    fontSize: fontScale(14),
    fontFamily: fonts.Regular,
    fontWeight: "400",
    lineHeight: verticalScale(20),
  },
  userMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: colors.white,
  },
  messageTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(4),
  },
  userTimeContainer: {
    justifyContent: "flex-end",
  },
  otherTimeContainer: {
    justifyContent: "flex-start",
  },
  messageTime: {
    fontSize: fontScale(10),
    fontFamily: fonts.Regular,
    fontWeight: "400",
    color: colors.messageTimestamp,
  },
  readStatus: {
    fontSize: fontScale(10),
    fontFamily: fonts.Regular,
    fontWeight: "400",
    color: colors.messageTimestamp,
    marginLeft: horizontalScale(4),
  },
  inputContainer: {
    paddingHorizontal: horizontalScale(20),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardBackground,
    width: horizontalScale(329),
    height: verticalScale(64),
    borderRadius: verticalScale(90),
    borderWidth: verticalScale(1),
    borderColor: colors.purpleBorder,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(8),
    opacity: 1,
  },
  textInput: {
    flex: 1,
    fontSize: fontScale(14),
    fontFamily: fonts.Regular,
    fontWeight: "400",
    color: colors.white,
    maxHeight: verticalScale(100),
    paddingVertical: verticalScale(15),
  },
  sendButton: {
    alignItems: "center",
    justifyContent: "center",
  },
});
