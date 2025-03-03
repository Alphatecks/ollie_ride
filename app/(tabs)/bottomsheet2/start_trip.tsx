import { View, Text } from 'react-native-ui-lib'
import React from 'react'
import { NotificationCardDriving } from '@/components/notification/NotificationCardBase'
import DoubleLocationCard from '@/components/home/DoubleLocationCard'
import { Button } from 'react-native-ui-lib'
import { useRouter } from 'expo-router'
import tw from '@/tailwind'
import DoubleAddress from '@/components/home/DoubleAddress'
import { useTripStore } from '@/store/tripStore'

const Index = () => {
    const router = useRouter()

    const {selectedTrip} = useTripStore()

    const handleTripStarted = () => {

    }

  return (
    <View style={tw`gap-10`}>
        <NotificationCardDriving
        name={selectedTrip?.riderName}
        phoneNumber={selectedTrip?.riderPhoneNumber}
        time={selectedTrip?.time}
        onMessageIconPressed={()=> router.push(`/chat/${selectedTrip?.id}`)}
        // onCancelIconPressed = {handleOnCancelIconPressed}
        />
        <View>
            <DoubleAddress />
            <Button 
            label = "Start Trip"
            poppins style={tw`btn my-3 ${selectedTrip?.isTripEnroute ? "bg-[#D5A419]" : ""}`}
            onPress = {()=> router.push("/bottomsheet2/trip_completed")}
            />
        
            {selectedTrip?.isTripEnroute &&
            <Text poppinsMedium 
            style={tw`text-blue-500 my-2`}
            // onPress = {handleReachedRiderDestination}
            >Arrived Destination?</Text>
            }
        </View>
    
  </View>
  )
}

export default Index