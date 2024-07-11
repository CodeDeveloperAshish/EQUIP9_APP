import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback } from "react";
import { useOAuth, useUser } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../hooks/warmUpBrowser";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

WebBrowser.maybeCompleteAuthSession();

const SocialLoginButtons = () => {
  const navigation = useNavigation();
  useWarmUpBrowser();
  const { user } = useUser();
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({
    strategy: "oauth_facebook",
  });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
    strategy: "oauth_apple",
  });

  const onPressOAuth = useCallback(async (provider) => {
    try {
      const startOAuthFlow =
        provider === "google"
          ? startGoogleOAuthFlow
          : provider === "facebook"
          ? startFacebookOAuthFlow
          : startAppleOAuthFlow;

      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
        await SecureStore.setItemAsync("loginStatus", "true");
        navigation.navigate("HomeScreen");
      } else {
        // Handle the case where additional steps are needed
      }
    } catch (error) {
      Alert.alert(
        "OAuth Error",
        `An error occurred during the OAuth process: ${error.message || err}`
      );
    }
  }, []);

  return (
    <View className="flex-row justify-center gap-6 mt-0">
      <TouchableOpacity
        onPress={() => onPressOAuth("facebook")}
        className="border rounded-md border-gray-200 w-14 h-14 justify-center items-center"
      >
        <Image
          style={{ width: 25, height: 25 }}
          resizeMode="contain"
          source={require("../../assets/images/facebook.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPressOAuth("google")}
        className="border rounded-md border-gray-200  w-14 h-14 justify-center items-center"
      >
        <Image
          style={{ width: 25, height: 25 }}
          resizeMode="contain"
          source={require("../../assets/images/google.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPressOAuth("apple")}
        className="border rounded-md border-gray-200 w-14 h-14 justify-center items-center"
      >
        <Image
          style={{ width: 25, height: 30 }}
          resizeMode="contain"
          source={require("../../assets/images/apple.png")}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SocialLoginButtons;
