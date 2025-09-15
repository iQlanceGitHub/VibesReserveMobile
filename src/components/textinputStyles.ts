import { StyleSheet } from "react-native";
import { colors } from "../utilis/colors";

export default StyleSheet.create({
  errorMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  errorMessageText: {
    color: colors.red,
    flex: 1,
    marginLeft: -6,
  },
});
