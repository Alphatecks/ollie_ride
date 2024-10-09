import React from 'react'
import { ScrollView } from 'react-native'
import { View, Text, Button } from 'react-native-ui-lib'
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@/tailwind";

import { useRouter } from "expo-router"

import { BarChart } from "react-native-gifted-charts";


const Profile = () => {
	const router = useRouter()

	return (
			<View style = {tw`flex-1 bg-white p-3`} >
				<Text poppins>Profile Incoming</Text>			
			</View>
	)
}

export default Profile