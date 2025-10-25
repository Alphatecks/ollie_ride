import React from 'react';
import { View, TextInput } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import tw from '../../tailwind';

const InputWithIcons = ({ onChangeText, value, placeholder, ...props }) => {
  return (
    <View style={tw`border rounded-md border-gray-300 items-center flex-row px-2`}>
      <Entypo name="plus" size={24} color="black" />
      <TextInput
        style={tw.style("p-3 flex-1", { fontFamily: "Poppins_400Regular" })}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        {...props} // Spread any other props passed from parent
      />
      <Entypo name="plus" size={24} color="black" />
    </View>
  );
};

export default InputWithIcons;
