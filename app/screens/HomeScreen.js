import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../utils/Colors";
import { ToastMessage } from "../components/ToastMessage";
import { useIsFocused } from "@react-navigation/native";
import BorderButton from "../components/BorderButton";
import LinearButton from "../components/LinearButton";
import GlobalApi from "../apis/GlobalApi";

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();

  const [greeting, setGreeting] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [userId, setUserId] = useState("");
  const [loader, setLoader] = useState(false);

  const { signOut } = useAuth();
  const { user } = useClerk();

  useEffect(() => {
    const getGreeting = async () => {
      //Retriving data from local storage
      let getFirstName = await SecureStore.getItemAsync("firstName");
      let getLastName = await SecureStore.getItemAsync("lastName");
      let getMobileNumber = await SecureStore.getItemAsync("mobileNumber");
      let userId = await SecureStore.getItemAsync("userId");
      setUserId(userId);
      setFirstName(getFirstName);
      setLastName(getLastName);
      setMobileNumber(getMobileNumber);

      // Get greeting based on time
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        setGreeting("Good Morning");
      } else if (currentHour < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    getGreeting();
  }, [isFocused]);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("loginStatus");
    await SecureStore.deleteItemAsync("firstName");
    await SecureStore.deleteItemAsync("lastName");
    signOut();
    ToastMessage(
      "error",
      "Logout Successful",
      "You have successfully logged out"
    );
    navigation.navigate("LoginScreen");
  };

  //Confirmation alert for logout
  const SignOutAlert = () =>
    Alert.alert("Confirm Logout", "Are you sure you want to Logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => handleLogout() },
    ]);

  const handleNavigate = () => {
    //Navigate to Update Profile Screen
    navigation.navigate("UpdateProfile");
  };

  const handleDelete = async () => {
    setLoader(true);
    GlobalApi.deleteUser(userId)
      .then(async (response) => {
        if (response) {
          await SecureStore.deleteItemAsync("loginStatus");
          await SecureStore.deleteItemAsync("firstName");
          await SecureStore.deleteItemAsync("lastName");
          await SecureStore.deleteItemAsync("mobileNumber");
          ToastMessage(
            "success",
            "Profile Deleted Successful",
            "You have successfully deleted your profile"
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

  const handleNavigateToUpdateProfile = () => {
    navigation.navigate("UpdateProfile", {
      FirstName: firstName,
      LastName: lastName,
      MobileNumber: mobileNumber,
    });
  };

  return (
    <SafeAreaView className="bg-white flex-1 p-4">
      <View className="flex-row justify-between items-center">
        <Text
          style={{
            fontFamily: "Poppins-SemiBold",
            fontSize: 20,
          }}
        >
          Hello {user ? user?.externalAccounts[0].firstName : firstName},
        </Text>

        <TouchableOpacity onPress={SignOutAlert}>
          <Image
            resizeMode="contain"
            tintColor={Colors.PrimaryColor}
            style={{ width: 20, height: 20 }}
            source={require("../../assets/icons/exit.png")}
          />
        </TouchableOpacity>
      </View>
      <View className="flex-1 justify-center items-center">
        <Text
          style={{
            fontFamily: "Poppins-Regular",
            fontSize: 15,
          }}
        >
          {greeting}
        </Text>
        <Text
          style={{
            fontFamily: "Poppins-Medium",
            fontSize: 17,
          }}
        >
          Mr.{" "}
          {user
            ? user?.externalAccounts[0].firstName +
              " " +
              user?.externalAccounts[0].lastName
            : firstName + " " + lastName}
        </Text>
      </View>

      {firstName && (
        <View>
          <LinearButton
            onPress={handleNavigateToUpdateProfile}
            Title={"Update Profile"}
            loader={false}
          />
          <BorderButton
            Title={"Delete Profile"}
            loader={loader}
            onPress={handleDelete}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
