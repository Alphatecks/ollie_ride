import { View, Text } from 'react-native'
import React, { useState } from 'react'
import CarBigSVG from "@/assets/car-big.svg"
import EmergencySVG from "@/assets/emergency.svg"
import tw from '@/tailwind'
import { Button, TouchableOpacity } from 'react-native-ui-lib'
import DriverProfile from '@/components/bottomsheet-ui/DriverProfile'
import { useRouter } from 'expo-router'


// Handle both driver arriving and also ride in progress.

const Index = () => {

    const router = useRouter()
    const [inProgress, setInProgress] = useState<boolean>(false)

  return (
    <View style={tw`gap-2`}>

        {!inProgress && 
        <Text style={tw`border-b-[0.8px] border-gray-300 py-3 poppins text-center`}>Your ride is arriving in 3 minutes</Text>
        
        }

      {inProgress && 
        <View style={tw`flex-row justify-between border-b-[0.8px] border-gray-300 py-3`}>
            <TouchableOpacity style={tw`flex-row gap-3 p-2 items-center`}>
            <View style={tw`h-2 w-2 rounded-full bg-green-500`}></View>
            <Text style={tw`poppins`}>In Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`flex-row gap-1 p-2`}>
            <EmergencySVG />
            <Text style={tw`poppins text-red-500`}>Emergency</Text>
            </TouchableOpacity>
        </View>
      }

      <DriverProfile
          name="Fabrizio Romano"
          phoneNumber="09087764374"
          rating={4.4}
          accessCode="33829"
          carBrand="Toyota Corolla"
          carColor="Blue"
          licenseNumber="HH567FFA"
        />

        <Button outline 
        style={tw`outline rounded-md`}
        label= "Cancel Ride"
        // onPress = {()=> router.push("/(tabs)/bottomsheet2/driver_arriving")}
      />
    </View>
  )
}

export default Index