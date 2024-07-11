import { View, Text, Image } from "react-native";
import React from "react";
import { Icon, Input, Stack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

const IconTextInput = ({
  LeftIcon,
  Placeholder,
  setValue,
  value,
  keyboardType,
  maxLength,
}) => {
  return (
    <Input
      InputLeftElement={
        <Icon
          as={
            <Image
              resizeMode="contain"
              tintColor={"gray"}
              style={{ width: 20, height: 20, marginLeft: 10 }}
              source={LeftIcon}
            />
          }
        />
      }
      value={value}
      onChangeText={(val) => setValue(val)}
      keyboardType={keyboardType ? keyboardType : "default"}
      maxLength={maxLength && maxLength}
      variant="filled"
      borderRadius={6}
      borderWidth={0}
      bg="gray.100"
      style={{
        height: 50,
        fontSize: 13,
        fontFamily: "Poppins-Medium",
      }}
      placeholder={Placeholder}
    />
  );
};

export default IconTextInput;
