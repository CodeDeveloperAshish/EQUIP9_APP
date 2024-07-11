import { View, Text } from "react-native";
import React from "react";
import Toast from "react-native-toast-message";

export const ToastMessage = (type, text1, text2) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
  });
};
