import React from 'react'
import { View } from 'react-native'
import { Text, Button } from 'react-native-ui-lib'
import useTripStore from '@/store/useTripStore';


import { Link, useLocalSearchParams } from "expo-router"
import NotificationCardBase from '@/components/notification/NotificationCardBase'
import DoubleLocationCard from '@/components/home/DoubleLocationCard'
import tw from '@/tailwind'

const AcceptTrip = () => {

	const trip = useTripStore((state) => state.trip);

	return (
		<View>
			<Link href="(tabs)/bottomsheet/page2">Go to page 2</Link>

			<View>    
            <NotificationCardBase
              key={trip?.id}
              name={trip?.riderName}
              phoneNumber={trip?.phoneNumber}
              time={trip?.time}
            />
            <DoubleLocationCard locationDistance = "10 mins" 
            fromLocation = {trip?.fromLocation}
            toLocation = {trip?.toLocation}
            />
            <Text poppins style={tw`my-4`} >Price Range: N4000 - N5000 </Text>
            <View style={tw`flex-row gap-2`}>
              <Button label = "Accept" poppins style={tw`btn flex-grow`} />
              <Button label = "Reject" poppins 
            //   onPress = {handleOnRejectPressed}
              style={tw`btn flex-grow bg-[#BFC8D4] text-red-300`} color = "#0C3569"/>
            </View>
          </View>

		</View>
	)
}

export default AcceptTrip