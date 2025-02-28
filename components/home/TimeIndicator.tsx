import { View, Text } from 'react-native'
import React from 'react'
import LeftArrowSVG from "@/assets/ArrowLeft.svg";
import RightArrowSVG from "@/assets/ArrowRight.svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import tw from '@/tailwind';

interface TimeIndicatorProps {
    minutesAway: string;
    fromAddress: string;
    toAddress: string;
}

const TimeIndicator: React.FC<TimeIndicatorProps> = ({minutesAway = "10 mins away", fromAddress, toAddress}) => {
  return (
    <View style={tw`gap-4`}>
      <View style={tw`flex-row items-center justify-center`}>
          <LeftArrowSVG />
          <TouchableOpacity style={tw`p-2 border-[0.5] border-[#8095B2] rounded-lg`}>
              <Text>{minutesAway}</Text>
          </TouchableOpacity>
          <RightArrowSVG />
      </View>
      <View style={tw`flex-row justify-between gap-6`}>
        <Text style={tw`text-sm poppins flex-1 text-center`}>
          {fromAddress || "12, Tavern Street, AB Avenue, Ikoyi"}
        </Text>
        <Text style={tw`text-sm poppins flex-1 text-center`}>
          {toAddress || "12, Tavern Street, AB Avenue, Ikoyi"}
        </Text>
      </View>
    </View>
  )
}

export default TimeIndicator