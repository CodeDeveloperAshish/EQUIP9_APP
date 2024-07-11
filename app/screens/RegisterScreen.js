import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider, Stack } from "native-base";
import IconTextInput from "../components/IconTextInput";
import Colors from "../utils/Colors";
import { useNavigation } from "@react-navigation/native";
import SocialLoginButton from "../components/SocialLoginButtons";
import LinearButton from "../components/LinearButton";
import GlobalApi from "../apis/GlobalApi";
import { ToastMessage } from "../components/ToastMessage";

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);

  const handleRegister = () => {
    if (firstName == "") {
      return ToastMessage(
        "error",
        "First Name Required",
        "Please enter your first name"
      );
    } else if (lastName == "") {
      return ToastMessage(
        "error",
        "Last Name Required",
        "Please enter your last name"
      );
    } else if (mobileNumber == "") {
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

    setLoader(true);
    GlobalApi.register(firstName, lastName, mobileNumber, password)
      .then(async (response) => {
        if (response.data) {
          ToastMessage(
            "success",
            "Registration Successful",
            "You have successfully registered. Login to explore!"
          );
          navigation.navigate("LoginScreen");
        }
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        ToastMessage("error", error.response.data.message);
      });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="px-4 mt-10">
          <Text
            style={{
              fontFamily: "Poppins-SemiBold",
              fontSize: 30,
              textAlign: "center",
            }}
          >
            Register
          </Text>
          <Text
            className="text-gray-400"
            style={{
              fontFamily: "Poppins-Medium",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            Please register to Login
          </Text>

          <Stack space={4} w="100%" alignItems="center" className="mt-10">
            <IconTextInput
              setValue={setFirstName}
              value={firstName}
              LeftIcon={require("../../assets/icons/user.png")}
              Placeholder="First Name"
            />
            <IconTextInput
              setValue={setLastName}
              value={lastName}
              LeftIcon={require("../../assets/icons/user.png")}
              Placeholder="Last Name"
            />
            <IconTextInput
              setValue={setMobileNumber}
              value={mobileNumber}
              LeftIcon={require("../../assets/icons/phone.png")}
              Placeholder="Mobile Number"
              maxLength={10}
              keyboardType="numeric"
            />
            <IconTextInput
              setValue={setPassword}
              value={password}
              LeftIcon={require("../../assets/icons/lock.png")}
              Placeholder="Password"
            />
          </Stack>

          <LinearButton
            Title="Sign Up"
            onPress={handleRegister}
            loader={loader}
          />

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
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text
              className="mt-10 text-base"
              style={{
                fontFamily: "Poppins-Medium",
                textAlign: "center",
              }}
            >
              Already Have an account?{" "}
              <Text style={{ color: Colors.PrimaryColor }}>Sign in</Text>{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
