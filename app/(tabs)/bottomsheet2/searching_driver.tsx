import { View, Text } from 'react-native'
import React from 'react'
import CarBigSVG from "@/assets/car-big.svg"
import EmergencySVG from "@/assets/emergency.svg"
import tw from '@/tailwind'
import { Circle, Bar } from 'react-native-progress'
import { baseColor } from '@/constants/Colors'
import { Button, TouchableOpacity } from 'react-native-ui-lib'
import DriverProfile from '@/components/bottomsheet-ui/DriverProfile'



const Searching = () => {
  return (
    <View style={tw`gap-12`}>
      <Text style={tw`border-b-[0.8px] border-gray-300 py-3 poppins text-center`}>Your ride is arriving in 3 minutes</Text>
      
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
       <DriverProfile
          name="Fabrizio Romano"
          phoneNumber="09087764374"
          rating={4.4}
          accessCode="33829"
          carBrand="Toyota Corolla"
          carColor="Blue"
          licenseNumber="HH567FFA"
        />
        <View style={tw`items-center justify-center gap-8`}>
            <CarBigSVG />
            <Text style={tw`poppins`}>Hold on! We’re searching for a nearby driver for you...</Text>
            
        </View>

        <Bar indeterminate={true} width={null} color={baseColor} />
        
       


        <Button outline 
          style={tw`outline rounded-md`}
          label= "Cancel Ride"
        />
    </View>
  )
}

export default Searching