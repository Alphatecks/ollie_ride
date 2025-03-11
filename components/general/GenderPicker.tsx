import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Picker, Colors } from "react-native-ui-lib";
import { AntDesign } from "@expo/vector-icons";

type GenderPickerProps = {
  onSelectGender: (gender: string) => void;
};

const GenderPicker: React.FC<GenderPickerProps> = ({ onSelectGender }) => {
  return (
    <View>
      <Picker
        placeholder="Select Gender"
        onChange={(value) => onSelectGender(value as string)}
        topBarProps={{ title: "Select Gender" }}
        items={[
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
        ]}
        renderInput={(selectedItem) => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: Colors.grey40,
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
          >
            <Text style={{ color: selectedItem ? Colors.black : Colors.grey30 }}>
              {selectedItem || "Select Gender"}
            </Text>
            <AntDesign name="down" size={18} color={Colors.grey30} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default GenderPicker;
