import { View, Text } from 'react-native'
import React from 'react'
import CarBigSVG from "@/assets/car-big.svg"
import EmergencySVG from "@/assets/emergency.svg"
import tw from '@/tailwind'
import { Circle, Bar } from 'react-native-progress'
import { baseColor } from '@/constants/Colors'
import { Button, TouchableOpacity } from 'react-native-ui-lib'
import DriverProfile from '@/components/bottomsheet-ui/DriverProfile'
import { useRouter } from 'expo-router'


const Searching = () => {

  const router = useRouter()

  return (
    <View style={tw`gap-12`}>
    
      <View style={tw`items-center justify-center gap-8`}>
        <CarBigSVG />
        <Text style={tw`poppins`}>Hold on! We’re searching for a nearby driver for you...</Text>
      </View>

      <Bar indeterminate={true} width={null} color={baseColor} />
      <Button outline 
        style={tw`outline rounded-md`}
        label= "Cancel Ride"
        onPress = {()=> router.push("/(tabs)/bottomsheet2/driver_arriving")}
      />
    </View>
  )
}

export default Searching