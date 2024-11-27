import React from 'react'
import { View, Image, ScrollView } from 'react-native'
import Text from "react-native-ui-lib/text"
import { useLocalSearchParams, useRouter } from "expo-router"

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import tw from "@/tailwind"
import { formatDate } from '@/utils/utils';




const History = () => {
	const trip = useLocalSearchParams()

	console.log(formatDate(Date(trip?.tripStartedTime)))

	// console.log(trip)
	const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd"

	const router = useRouter()
	// console.log(params)
	return (
		<ScrollView 
		showsVerticalScrollIndicator = {false}
		style={tw`bg-white flex-1 p-3`}>
			<View style={tw`h-[213px] bg-gray-300`}></View>
			<View style={tw`flex-1 pt-10 gap-2`}>
		        <View style={tw`flex-row items-center`}>
		          <Image source={{uri: url}} style={tw`w-12 h-12 rounded-full mr-4`} />
		          <Text poppinsMedium style={tw`text-lg`} >{trip?.riderName}</Text>
		        </View>

		        <View style={tw`flex-row gap-2 my-4`}>
					<View style = {tw`items-center`} >
						<MaterialCommunityIcons name="circle" size={18} style={tw`text-gray-300`} />
						<View style={tw`border-dashed border-l-[1.5px] h-[13px] border-blue-600`}></View>
						<MaterialCommunityIcons name="circle" size={18} style={tw`text-ollie-base`}  />
					</View>
			        <View style={tw`flex-1 justify-between`}>
			          <Text poppins style={tw`text-gray-500`} >{trip?.toLocation}</Text>
			          <Text poppins style={tw`text-gray-500`}>{trip?.fromLocation}</Text>
			        </View>
		        </View>

		        <View style={tw`flex-row justify-between mb-2`}>
		          <Text poppins style={tw``}>Trip Id:</Text>
		          <Text poppinsMedium style={tw``}>{trip?.id}</Text>
		        </View>
		        <View style={tw`flex-row justify-between mb-2`}>
		          <Text poppins style={tw``}>Time Started:</Text>
		          <Text poppinsMedium style={tw``}>{formatDate(Date(trip?.tripStartedTime))}</Text>
		        </View>
		        <View style={tw`flex-row justify-between mb-2`}>
		          <Text poppins style={tw``}>Time Completed:</Text>
		          <Text poppinsMedium >{formatDate(Date(trip?.tripEndedTime))}</Text>
		        </View>
		        <View style={tw`flex-row justify-between mb-2`}>
		          <Text poppins >Distance covered:</Text>
		          <Text poppinsMedium >15km</Text>
		        </View>
		        <View style={tw`flex-row justify-between mb-2`}>
		          <Text poppins >Driver ID:</Text>
		          <Text poppinsMedium >{trip?.driverId}</Text>
		        </View>
		        <View style={tw`flex-row justify-between mb-2`}>
		          <Text poppins >Rating:</Text>
		          <Text poppinsMedium >4.0</Text>
		        </View>
		        <View style={tw`gap-5`}>
			        <View style={tw`bg-ollie-base p-3 rounded-md w-1/2`}>
			          <Text poppins style={tw`text-sm text-white`}>Total amount:</Text>
			          <Text poppinsMedium style={tw`text-lg text-white`}>₦{trip?.tripAmount}</Text>
			        </View>
					<View style={tw`flex-row`}>
						<Text poppins style={tw`text-green-500 border-[0.8px] p-2 rounded-full border-green-500`} >{trip?.status}</Text>
					</View>
		        </View>

	      </View>
	      {/* Fix the scrollview to ensure all contents are shown. */}
	      <View style={tw`h-10`}></View>
		</ScrollView>
	)
}

export default History