import { useTheme } from "@/theme";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
  CountryModalProvider,
  DARK_THEME,
  DEFAULT_THEME,
} from "react-native-country-picker-modal";

const DARK = "dark";
interface CountryPickerMoleculeProps {
  selectedCountry: Country | null;
  showCountryPicker?: boolean;
  onSelectCountry: (country: Country) => void;
}

const RNCountryPicker = ({
  selectedCountry,
  showCountryPicker,
  onSelectCountry,
}: CountryPickerMoleculeProps): React.JSX.Element => {
  const { variant, colors } = useTheme();
  const isDarkTheme = variant === DARK;

  const handleSelectCountry = useCallback(
    (country: Country) => {
      setCountryCode(country.cca2);
      onSelectCountry(country);
      setVisible(false);
    },
    [onSelectCountry]
  );

  const [countryCode, setCountryCode] = useState<CountryCode>("IN");

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (showCountryPicker) setVisible(true);
  }, [showCountryPicker]);

  return (
    <CountryPicker
      theme={
        isDarkTheme
          ? {
              ...DARK_THEME,
              backgroundColor: colors.background,
              fontFamily: "DMSans-Regular",
            }
          : {
              ...DEFAULT_THEME,
              backgroundColor: colors.background,
              primaryColor: colors.baseTextColor,
              primaryColorVariant: colors.baseTextColor,
              filterPlaceholderTextColor: colors.baseTextColor,
              fontFamily: "DMSans-Regular",
              onBackgroundTextColor: colors.baseTextColor,
            }
      }
      withFilter
      withEmoji
      withFlag
      withModal
      countryCode={selectedCountry?.cca2 || "IN"}
      preferredCountries={["IN", "US"]}
      onSelect={handleSelectCountry}
      onClose={() => setVisible(false)}
      onOpen={() => {
        setVisible(true);
      }}
      visible={visible}
      modalProps={{
        animationType: "slide",
        visible: visible,
        onRequestClose: () => {
          setVisible(false);
        },
      }}
    />
  );
};

export default RNCountryPicker;

const styles = StyleSheet.create({});
