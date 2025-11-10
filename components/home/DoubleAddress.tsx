import React from 'react';
import { View, Text } from 'react-native';
import LocationArrowSVG from "../../assets/locationArrow.svg";
import tw from '../../tailwind';

interface DoubleAddressProps {
  fromLocation?: string;
  toLocation?: string;
}

const DoubleAddress: React.FC<DoubleAddressProps> = ({ fromLocation, toLocation }) => {
  return (
    <View style={tw`gap-2`}>
      <View style={tw`flex items-center`}>
        <LocationArrowSVG />
      </View>
      <View style={tw`flex-row justify-between`}>
        <Text style={tw`text-sm poppins flex-1 text-center`}>
          {fromLocation || "12, Tavern Street, AB Avenue, Ikoyi"}
        </Text>
        <Text style={tw`text-sm poppins flex-1 text-center`}>
          {toLocation || "12, Tavern Street, AB Avenue, Ikoyi"}
        </Text>
      </View>
    </View>
  );
};

export default DoubleAddress;