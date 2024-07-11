import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider, Stack } from "native-base";
import IconTextInput from "../components/IconTextInput";
import Colors from "../utils/Colors";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import SocialLoginButton from "../components/SocialLoginButtons";
import LinearButton from "../components/LinearButton";
import * as SecureStore from "expo-secure-store";
import GlobalApi from "../apis/GlobalApi";
import { ToastMessage } from "../components/ToastMessage";

const LoginScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSignIn = () => {
    //Login Validation
    if (mobileNumber == "") {
      return ToastMessage(
        "error",
        "Mobile Number Required",
        "Please enter your mobile number"
      );
    } else if (mobileNumber.length < 10) {
      return ToastMessage(
        "error",
        "Invalid Mobile Number",
        "Mobile number must be exactly 10 digits."
      );
    } else if (password == "") {
      return ToastMessage(
        "error",
        "Password Required",
        "Please enter password"
      );
    } else if (password.length < 5) {
      return ToastMessage(
        "error",
        "Inavalid Password",
        "Password must be at least 8 characters long"
      );
    }

    // HTTP Request
    setLoader(true);
    GlobalApi.signIn(mobileNumber, password)
      .then(async (response) => {
        setLoader(false);

        if (response.accessToken && response.user) {
          await SecureStore.setItemAsync("accessToken", response.accessToken);
          await SecureStore.setItemAsync("firstName", response.user.firstName);
          await SecureStore.setItemAsync("lastName", response.user.lastName);
          await SecureStore.setItemAsync(
            "mobileNumber",
            JSON.stringify(response.user.mobileNumber)
          );
          await SecureStore.setItemAsync("userId", response.user._id);
          ToastMessage(
            "success",
            "Login Successful",
            "Welcome back! You have successfully logged in."
          );

          navigation.navigate("HomeScreen");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log(error.message);
        ToastMessage("error", error.response.data.message);
      });
  };
  useEffect(() => {
    // Check User Session
    setMobileNumber("");
    setPassword("");
    const CheckLoginStatus = async () => {
      try {
        const loginStatus = await SecureStore.getItemAsync("loginStatus");
        const ln = await SecureStore.getItemAsync("lastName");
        if (loginStatus === "true") {
          //if Session exist navigate to honescreen
          navigation.replace("HomeScreen");
        }
      } catch (error) {}
    };

    CheckLoginStatus();
  }, [isFocused]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <Image
          style={{ width: 150, height: 100 }}
          resizeMode="contain"
          className="self-center mt-10"
          source={require("../../assets/images/equiplogo.png")}
        />
        <View className="px-4 mt-10">
          <Text
            style={{
              fontFamily: "Poppins-SemiBold",
              fontSize: 30,
              textAlign: "center",
            }}
          >
            Login
          </Text>
          <Text
            className="text-gray-400"
            style={{
              fontFamily: "Poppins-Medium",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            Please sign in to continue
          </Text>
          <Stack space={4} w="100%" alignItems="center" className="mt-10">
            <IconTextInput
              setValue={setMobileNumber}
              value={mobileNumber}
              maxLength={10}
              LeftIcon={require("../../assets/icons/phone.png")}
              Placeholder="Mobile Number"
              keyboardType="numeric"
            />
            <IconTextInput
              setValue={setPassword}
              value={password}
              onChangeText={(value) => handleChange("password", value)}
              LeftIcon={require("../../assets/icons/lock.png")}
              Placeholder="Password"
            />
          </Stack>

          <LinearButton onPress={handleSignIn} loader={loader} Title="Login" />

          <View className="flex-row justify-between items-center mt-6">
            <Divider width={"40%"} my="5" />
            <Text
              className="text-gray-400"
              style={{
                fontFamily: "Poppins-Regular",
              }}
            >
              OR
            </Text>
            <Divider width={"40%"} my="2" />
          </View>
          <SocialLoginButton />
          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterScreen")}
          >
            <Text
              className="mt-10 text-base"
              style={{
                fontFamily: "Poppins-Medium",
                textAlign: "center",
              }}
            >
              Don't Have an account?{" "}
              <Text style={{ color: Colors.PrimaryColor }}>Sign Up</Text>{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
