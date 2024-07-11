import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider, Stack } from "native-base";
import IconTextInput from "../components/IconTextInput";
import Colors from "../utils/Colors";
import { useNavigation } from "@react-navigation/native";
import LinearButton from "../components/LinearButton";
import GlobalApi from "../apis/GlobalApi";
import { ToastMessage } from "../components/ToastMessage";
import * as SecureStore from "expo-secure-store";

const UpdateProfile = ({ route }) => {
  const navigation = useNavigation();

  const { FirstName, LastName, MobileNumber } = route.params;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [userId, setUserId] = useState("");

  const updateProfile = () => {
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
    }

    setLoader(true);
    GlobalApi.updateProfile(userId, firstName, lastName, mobileNumber)
      .then(async (response) => {
        if (response.accessToken && response.user) {
          await SecureStore.setItemAsync("accessToken", response.accessToken);
          await SecureStore.setItemAsync("firstName", response.user.firstName);
          await SecureStore.setItemAsync("lastName", response.user.lastName);
          await SecureStore.setItemAsync(
            "mobileNumber",
            JSON.stringify(response.user.mobileNumber)
          );
          ToastMessage(
            "success",
            "Profile Updated Successful",
            "You have successfully updated your profile"
          );
          navigation.goBack();
        }
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        ToastMessage("error", error.response.data.message);
      });
  };

  const handleUpdateProfile = async () => {
    //Get User Id
    let userId = await SecureStore.getItemAsync("userId");
    setUserId(userId);

    setFirstName(FirstName || "");
    setLastName(LastName || "");
    setMobileNumber(MobileNumber.toString() || "");
  };

  useEffect(() => {
    handleUpdateProfile();
  }, []);

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
            Update Profile
          </Text>
          <Text
            className="text-gray-400"
            style={{
              fontFamily: "Poppins-Medium",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            Update below details
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
              LeftIcon={require("../../assets/icons/phone.png")}
              Placeholder="Mobile Number"
              maxLength={10}
              keyboardType="numeric"
              value={mobileNumber}
            />
            {/* <IconTextInput
              setValue={setPassword}
              value={password}
              LeftIcon={require("../../assets/icons/lock.png")}
              Placeholder="Password"
            /> */}
          </Stack>

          <LinearButton
            Title="Update Profile"
            onPress={updateProfile}
            loader={loader}
          />

          <TouchableOpacity
            className=" justify-center bg-black mt-5 rounded-md  items-center h-[50px]  text-white overflow-hidden"
            onPress={() => navigation.goBack()}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "Poppins-SemiBold",
                fontSize: 15,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProfile;
