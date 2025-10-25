import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import tw from "../../../tailwind";
import { IMAGE_URL } from "../../constants/Data";
import { baseColor } from "../../constants/Colors";
import CallSVG from "../../assets/call.svg"
import MessageSVG from "../../assets/message.svg"

interface DriverProfileProps {
  name: string;
  phoneNumber: string;
  rating: number;
  accessCode: string;
  carBrand: string;
  carColor: string;
  licenseNumber: string;
  profileImage: string;
}

const DriverProfile: React.FC<DriverProfileProps> = ({
  name,
  phoneNumber,
  rating,
  accessCode,
  carBrand,
  carColor,
  licenseNumber,
  profileImage,
}) => {
  return (
    <View style={tw`bg-white p-5 rounded-lg items-center`}> 
        <View style={tw`flex-row items-center gap-10`}>
            <CallSVG />
            <Image source={{ uri: profileImage ? profileImage : IMAGE_URL }} style={tw`w-24 h-24 rounded-full`} />
            <MessageSVG />
        </View>

        <View style={tw`flex-row items-center mt-1 gap-2`}>
            <Text style={tw`text-ollie-base mt-[0.5] poppins`}>{rating.toFixed(1)}</Text>
            <FontAwesome name="star" size={14} color={baseColor} />
        </View>

        <Text style={tw`poppinsMedium mt-2 text-lg`}>{name}</Text>
        <Text style={tw`text-gray-500 poppins`}>{phoneNumber}</Text>

        <Text style={tw`mt-2 text-lg poppinsMedium`}>Access Code: <Text style={tw`text-ollie-base`}>{accessCode}</Text></Text>
        <Text style={tw`mt-2 poppinsMedium`}>Car brand: <Text style={tw`poppins`}>{carBrand}</Text></Text>
        <Text style={tw`mt-1 poppinsMedium`}>Car colour: <Text style={tw`text-ollie-base poppins`}>{carColor}</Text></Text>
        <Text style={tw`mt-1 poppinsMedium`}>Car license number: <Text style={tw`poppins`}>{licenseNumber}</Text></Text>
    
    </View>
  );
};

export default DriverProfile;
