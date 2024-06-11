import { BaseView } from "@/components/atoms";
import { RNCountryFilter } from "@/components/molecules";
import { useTheme } from "@/theme";
import { DownChevronSvgIcon, DownIcon } from "@/theme/assets/svg";
import { wp } from "@/utils/layoutUtils";
import { StyleSheet } from "react-native";
import { PressableOpacity } from "react-native-pressable-opacity";

export default function SelectedCountry({
  showCountryPicker,
  setShowCountryPicker,
  handleSelectCountry,
  selectedCountry,
}: any) {
  const { layout, backgrounds, variant } = useTheme();
  const isDarkTheme = variant === "dark";
  const containerStyle = StyleSheet.flatten([
    layout.row,
    layout.center,
    backgrounds.textInputBackground,
    { paddingHorizontal: wp(12) },
  ]);

  return (
    <BaseView style={containerStyle}>
      <BaseView style={styles.countryContainer}>
        <RNCountryFilter
          onSelectCountry={handleSelectCountry}
          showCountryPicker={showCountryPicker}
          selectedCountry={selectedCountry}
        />
      </BaseView>
      <PressableOpacity
        onPress={() => {
          setShowCountryPicker(true);
        }}
        style={{ marginLeft: 5, marginRight: 13 }}
      >
        {isDarkTheme ? (
          <DownChevronSvgIcon height={10} width={10} />
        ) : (
          <DownIcon style={{ marginLeft: 5, marginRight: 13 }} fill={"white"} />
        )}
      </PressableOpacity>

      <BaseView style={styles.verticalBar} />
    </BaseView>
  );
}

const styles = StyleSheet.create({
  countryContainer: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: 2,
  },
  verticalBar: {
    height: "100%",
    width: 1,
    backgroundColor: "#709C3C",
  },
});
