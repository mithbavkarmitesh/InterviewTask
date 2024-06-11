import { wp } from "@/utils/layoutUtils";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  cardContainer: {
    elevation: 4,
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 4,
    marginTop: 10,
    zIndex: 1,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    overflow: "hidden",
  },
  inputContainerStyle: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: "#FFF",
    paddingHorizontal: 0,
  },
  statusVisibiltyWrapper: {
    zIndex: 3,
    elevation: 3,
  },
  statusRestrictionsWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingHorizontal: 10,
  },
  statusRestrictionsContainer: {
    flexDirection: "row",
    paddingVertical: 5,
    alignItems: "center",
  },
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "36%",
  },
  actionButtonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  postButtonText: {
    paddingHorizontal: 18,
    textAlign: "center",
  },
  postButtonTextContainer: { height: 35 },
});

export default styles;
