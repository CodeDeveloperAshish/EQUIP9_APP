import { View, Text } from "react-native";
import React from "react";
import { Button } from "native-base";
import Colors from "../utils/Colors";

const BorderButton = ({ Title, loader, onPress }) => {
  return (
    <Button
      onPress={onPress}
      style={{
        height: 50,
        opacity: 10,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: Colors.PrimaryColor,
        borderRadius: 10,

        marginTop: 20,
      }}
      _text={{
        color: "#000",
        fontFamily: "Poppins-SemiBold",
        fontSize: 17,
      }}
      isLoading={loader}
      _loading={{
        _text: {
          color: "#000",
        },
      }}
      _spinner={{
        color: "#000",
      }}
      isLoadingText="Deleting Profile"
    >
      {Title}
    </Button>
  );
};

export default BorderButton;
