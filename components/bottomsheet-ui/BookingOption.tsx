import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";

interface BookingOptionProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const BookingOption: React.FC<BookingOptionProps> = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`flex-row items-center justify-between bg-white p-4 rounded-md border-[0.2px] border-gray-500 my-2`}
      activeOpacity={0.7}
    >
      <View style={tw`flex-row items-center gap-3`}>
        {icon}
        <Text style={tw`text-base text-black`}>{title}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="black" />
    </TouchableOpacity>
  );
};

export default BookingOption;
