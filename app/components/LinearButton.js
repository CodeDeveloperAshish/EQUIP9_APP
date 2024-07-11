import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "native-base";

const LinearButton = ({ Title, onPress, loader }) => {
  return (
    <LinearGradient
      colors={["#FED201", "#F7A000"]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      className="rounded-md mt-10"
    >
      {/* <TouchableOpacity
        // style={{ backgroundColor: "red" }}
        className=" justify-center  items-center h-12  text-white overflow-hidden"
        onPress={onPress}
      >
        <Text
          style={{
            color: "#fff",
            fontFamily: "Poppins-SemiBold",
            fontSize: 15,
          }}
        >
          {Title}
        </Text>
      </TouchableOpacity> */}

      <Button
        onPress={onPress}
        bg={"transparent"}
        style={{ height: 50, opacity: 10, backgroundColor: "tranparent" }}
        _text={{
          color: "#fff",
          fontFamily: "Poppins-SemiBold",
          fontSize: 17,
        }}
        isLoading={loader}
        _loading={{
          _text: {
            color: "#fff",
          },
        }}
        _spinner={{
          color: "white",
        }}
        isLoadingText="Please wait"
      >
        {Title}
      </Button>
    </LinearGradient>
  );
};

export default LinearButton;
