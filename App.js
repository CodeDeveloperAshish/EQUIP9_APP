import "react-native-gesture-handler";
import React, { useCallback } from "react";
import RootNavigation from "./app/navigation/RootNavigation";
import { NativeBaseProvider, Box } from "native-base";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { LogBox } from "react-native";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import { toastConfig } from "./app/utils/ToastConfig";

SplashScreen.preventAutoHideAsync();
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default function App() {
  //Loading Fonts
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Thin": require("./assets/fonts/Poppins-Thin.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  //Storing Token Generated Social Logins
  const tokenCache = {
    getToken(key) {
      try {
        return SecureStore.getItemAsync(key);
      } catch (err) {
        return null;
      }
    },
    saveToken(key, value) {
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        return null;
      }
    },
  };

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <NativeBaseProvider>
          <RootNavigation onLayoutRootView={onLayoutRootView} />
        </NativeBaseProvider>
        <Toast config={toastConfig} />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
