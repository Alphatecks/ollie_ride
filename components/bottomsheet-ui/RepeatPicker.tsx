import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "../../../tailwind";


type RepeatOptionGroupProps = {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

const RepeatOptionGroup: React.FC<RepeatOptionGroupProps> = ({ options, selectedValue, onSelect }) => {
  return (
    <View style={tw`flex-row flex-wrap gap-2 p-2`}> 
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => onSelect(option)}
          style={tw`px-4 py-2 border rounded-full ${selectedValue === option ? "border-ollie-base" : "border-gray-400"}`}
        >
          <Text style={tw`${selectedValue === option ? "text-ollie-base poppinsMedium" : "text-gray-500"}`}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// const RepeatSelector = () => {
//   const [selected, setSelected] = useState("Every Tuesday");
  
//   return <RepeatOptionGroup options={options} selectedValue={selected} onSelect={setSelected} />;
// };

export { RepeatOptionGroup };
