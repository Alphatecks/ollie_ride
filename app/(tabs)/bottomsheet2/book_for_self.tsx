import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Avatar, RadioButton, RadioGroup } from 'react-native-ui-lib'
import tw from '@/tailwind'
import UserSVG from "@/assets/profile-blue.svg"
import ContactSVG from "@/assets/contacts.svg"
import { baseColor } from '@/constants/Colors'

const Index = () => {
    const [currentValue, setCurrentValue] = useState("yes")

    console.log(currentValue)
  return (
    <View>
        <View style={tw`mb-4`}>
            <Text style={tw`poppinsMedium text-center text-lg`}>Someone else taking this ride?</Text>
            <Text style={tw`poppins text-center`}>Choose a contact so that they also get driver number, 
                vehicle details and ride access code via SMS
            </Text>

        </View>

        <RadioGroup initialValue={currentValue} onValueChange={setCurrentValue}>

        <View style={tw`flex-row gap-6`}>
            <RadioButton value={'yes'} color={baseColor}  />
            <View style={tw`flex-row gap-2 items-center justify-center`}>
                <UserSVG />
                <Text style={tw`poppinsMedium`}>Self</Text>
            </View>
        </View>

        <View style={tw`flex-row gap-6 mt-4`}>
            <RadioButton value={'no'} color={baseColor}  />
            <View style={tw`flex-row gap-2 items-center justify-center`}>
                <Avatar label={"TI"} backgroundColor={baseColor} labelColor='white' size={28} />                
                <Text style={tw`poppinsMedium`}>John Nweke</Text>
                <View style={tw`w-[1] h-[1] bg-ollie-base rounded-full`}></View>
                <Text style={tw`poppinsMedium text-gray-500`}>0802945900</Text>
            </View>
           
        </View>
      </RadioGroup>

        <View style={tw`flex-row gap-2 my-4 items-center ml-12`}>
            <ContactSVG />
            <Text style={tw`poppinsMedium`}>Choose other contacts</Text>
        </View>

    </View>
  )
}

export default Index