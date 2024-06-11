import { useEffect, useState } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";

const useDarkMode = (): boolean => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    systemColorScheme === "dark"
  );

  useEffect(() => {
    setIsDarkMode(systemColorScheme === "dark");
  }, [systemColorScheme]);

  return isDarkMode;
};

export default useDarkMode;
