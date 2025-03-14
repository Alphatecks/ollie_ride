import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "@/tailwind";
import { Button } from "react-native-ui-lib";
import { Feather } from "@expo/vector-icons";

type NoCardFoundProps = {
  onAddCard?: () => void;
};

const NoCardFound: React.FC<NoCardFoundProps> = ({ onAddCard }) => {
  return (
    <View style={tw`bg-white items-center gap-6`}>        
        <Feather name="x-circle" size={32} color="red" />
        <Text style={tw`text-lg poppinsMedium text-gray-700`}>No Card Found</Text>
        <Button outline label="Add Card" style={tw`outline rounded-md text-poppinsMedium`} poppins 
        onPress={onAddCard}
        />
    </View>
  );
};

export default NoCardFound;
