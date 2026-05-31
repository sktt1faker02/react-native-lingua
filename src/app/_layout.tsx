import "../global.css";

import { fontFamilies } from "@/theme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    [fontFamilies.regular]: require("../../assets/fonts/Poppins-Regular.ttf"),
    [fontFamilies.medium]: require("../../assets/fonts/Poppins-Medium.ttf"),
    [fontFamilies.semiBold]: require("../../assets/fonts/Poppins-SemiBold.ttf"),
    [fontFamilies.bold]: require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#FFFFFF" },
        headerShown: false,
      }}
    />
  );
}
