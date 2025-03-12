import { View, Text } from 'react-native'
import React from 'react'
import CarBigSVG from "@/assets/car-big.svg"
import tw from '@/tailwind'

const Searching = () => {
  return (
    <View>
        <View style={tw`items-center justify-center my-3 gap-3`}>
            <CarBigSVG />
            <Text style={tw`poppins`}>Hold on! We’re searching for a nearby driver for you</Text>
        </View>
    </View>
  )
}

export default Searching