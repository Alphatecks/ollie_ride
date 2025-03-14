import React from "react";
import { View, Text } from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import tw from "@/tailwind";
import MasterCardSVG from "@/assets/mastercard.svg"
import { Image } from "react-native-ui-lib";
import { TouchableOpacity } from "react-native-gesture-handler";

type CardInfoProps = {
  cardNumber: string;
  expiry: string;
  hasRightIcon?: boolean;
};

const maskCardNumber = (cardNumber: string): string => {
  return `****${cardNumber.slice(-4)}`;
};

const CardInfo: React.FC<CardInfoProps> = ({ cardNumber, expiry, hasRightIcon = true }) => {
  return (
    <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`bg-white flex-row items-center gap-4`}>      
            <MasterCardSVG />      
            <View>
                <Text style={tw`text-lg font-semibold`}>{maskCardNumber(cardNumber)}</Text>
                <Text style={tw`text-gray-500 text-sm`}>Expires {expiry}</Text>
            </View>
        </View>
        {hasRightIcon && 
          <TouchableOpacity style={tw`p-2`}>
              <Feather name="chevron-right" size={24} color="gray"  />
          </TouchableOpacity>
        }
        
    </View>
  );
};

export default CardInfo;
