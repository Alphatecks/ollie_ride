import { View, Text } from 'react-native-ui-lib'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import { ActivityIndicator } from 'react-native'
import tw from '@/tailwind'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig'
import { Trip } from '@/types'
import { useRouter } from 'expo-router'

const trip_completed = () => {

    const router = useRouter()

    const selectedTrip = {}

    const handlePaidWithCash = async (selectedTrip: Trip) => {
        router.push({pathname: "/riding_flow/payment_details", params: selectedTrip})
        
        // console.log("Trip was paid with cash")
        // const currentTime = new Date()
    
        // console.log(currentTime)
        
        // const selectedTripRef = doc(db, "trips", selectedTrip?.id)

        // try{
        //   await updateDoc(selectedTripRef, {
        //     tripPaymentTime: currentTime,
        //     isTripPaid: true,
        //     paidWithCash: true,
        //   })
          
        //   //   router.push({pathname: "/riding_flow/payment_details", params: selectedTrip})
        //   // Push to the Payment verification route
    
    
        // }catch(e){
        //   console.log(e)
        // }
    
      }
  return (
    <View>
        <View style={tw`items-center gap-3`}>
        <AntDesign name="checkcircle" size={100} color="green" />
        <Text poppinsMedium>Arrived at Rider's Destination</Text>
        <Text poppins>{selectedTrip?.fromLocation}</Text>
        </View>
        <View>
        <ActivityIndicator size = "large" style={tw`my-3`} />
        </View>
        <Text poppinsMedium style={tw`my-3`} center p1 >Awaiting Payment from Customer...</Text>

        <Text poppinsMedium 
        center
        style={tw`text-blue-500 my-2`}
        onPress = {()=> handlePaidWithCash(selectedTrip)}
        >Paid with cash?</Text>
    </View>
  )
}

export default trip_completed