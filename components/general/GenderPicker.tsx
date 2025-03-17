import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Picker, Colors } from "react-native-ui-lib";
import { AntDesign } from "@expo/vector-icons";
import tw from "@/tailwind";

type GenderPickerProps = {
  selectedGender: string | null;
  onSelectGender: (gender: string) => void;
};

const GenderPicker: React.FC<GenderPickerProps> = ({ selectedGender, onSelectGender }) => {
  return (
    <View>
      <Picker
        value={selectedGender || ""}  // Set the selected value
        placeholder="Select Gender"
        onChange={(value) => onSelectGender(value as string)}
        topBarProps={{ title: "Select Gender" }}
        items={[
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
        ]}
        renderInput={() => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: Colors.grey40,
              borderRadius: 8,
              paddingVertical: 18,
              paddingHorizontal: 16,
              marginVertical: 10
            }}
          >
            <Text style={tw.style("poppins", { color: selectedGender ? Colors.black : Colors.grey30 })}>
              {selectedGender || "Select Gender"}
            </Text>
            <AntDesign name="down" size={18} color={Colors.grey30} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default GenderPicker;
