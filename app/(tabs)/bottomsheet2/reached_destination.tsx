import { View, Text } from 'react-native'
import React from 'react'
import tw from '@/tailwind'
import DoubleAddress from '@/components/home/DoubleAddress'
import { DoubleLocationCardVariant } from '@/components/home/DoubleLocationCard'
import CardInfo from '@/components/bottomsheet-ui/CardInfo'
import NoCardFound from '@/components/bottomsheet-ui/NoCardFound'
import { Button } from 'react-native-ui-lib'
import { useRouter } from 'expo-router'


const Index = () => {

    const router = useRouter()
  return (
    <View>
        <Text style={tw`border-b-[0.8px] border-gray-300 py-3 poppins text-center`}>You have arrived at your destination</Text>

        <DoubleLocationCardVariant locationDistance={""} />

        <Text style={tw`poppinsMedium text-lg my-3`}>Fare Breakdown</Text>
        <View style={tw`flex-row justify-between mb-2`}>
            <Text style={tw`poppins`}>Arrival Time</Text>
            <Text style={tw`poppins`}>4.0</Text>
        </View>
        <View style={tw`flex-row justify-between mb-2`}>
            <Text style={tw`poppins`}>Distance Covered</Text>
            <Text style={tw`poppins`}>2km</Text>
        </View>
        <View style={tw`flex-row justify-between mb-2`}>
            <Text style={tw`poppins`}>Rate per km</Text>
            <Text style={tw`poppins`}>4000</Text>
        </View>
        <View style={tw`flex-row justify-between mb-2`}>
            <Text style={tw`poppins`}>Fare Amount</Text>
            <Text style={tw`poppins`}>4.0</Text>
        </View>

        <View style={tw`my-2`}></View>

        <View style={tw`gap-6`}>
            <CardInfo cardNumber='2980948384923' expiry='02/03' />
            <Button label="Make Payment" style={tw`btn`} poppins
            onPress ={router.push("/(tabs)/bottomsheet2/payment_method")}
            />
        </View>

        {/* <NoCardFound /> */}
    </View>
  )
}

export default Index