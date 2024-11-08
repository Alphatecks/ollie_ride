import React from 'react'
import { View, Text, Button } from 'react-native-ui-lib'
import useTripStore from '@/store/useTripStore';
import { NotificationCardDriving } from '@/components/notification/NotificationCardBase';
import DoubleLocationCard from '@/components/home/DoubleLocationCard';
import tw from '@/tailwind';

const riderCurrentLocation = "FCHP+V5C, Along Ubakala Road, Umuahia"

const Page2 = () => {
	const trip = useTripStore((state) => state.trip);

	console.log(trip)
	
	const handleIsDriverAtRiderLocation = () => {
		console.log("Navigating to driver location...")
	}
	
	const handleOnCancelIconPressed = () => {
		console.log("Navigating to driver location...")
	}

	return (
		<View>
			<Text>This is page 2</Text>
			<View>
              <NotificationCardDriving
                name={trip?.riderName}
                phoneNumber={trip?.phoneNumber}
                time={trip?.time || "5 mins"}
                onCancelIconPressed = {handleOnCancelIconPressed}
              />
              <DoubleLocationCard locationDistance = "10 mins" 
              fromLocation = {trip?.fromLocation}
              toLocation = {trip?.toLocation}
              />
              <Button label = "Navigate To Customer Location" poppins style={tw`btn my-3`}
              onPress = {handleIsDriverAtRiderLocation}
              />
            </View>
		</View>
	)
}

export default Page2