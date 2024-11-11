import React from 'react'
import { View, Text } from 'react-native'
import { Stack, useRouter } from "expo-router"
import tw from "@/tailwind"

import AntDesign from '@expo/vector-icons/AntDesign';

const Layout = () => {
	const router = useRouter()

	// console.log(router)
	return (
		<Stack screenOptions={{ 
			headerTitleStyle: {fontFamily: "Poppins_400Regular", fontSize: 20},
			headerTitleAlign: "center",
			title: "Payment Details",
			headerLeft: ({color}) => (<AntDesign name="left" size={24} color={color} onPress = {()=> router.back()} />)
		 }} >
			<Stack.Screen name="rate_rider" options = {{ 
				headerShown: true, 
				title: "Rate Rider",
			}} 
			/>
			<Stack.Screen name="download_receipt" options = {{ 
				headerShown: true, 
				title: "Download Receipt",
			}} 
			/>
{/*			<Stack.Screen name="withdraw_success" options = {{ 
				headerShown: false, 
				title: "Withdraw",
				headerStyle: {elevation: 0, border: 0},
			}} 
			/>*/}
		</Stack>
	)
}

export default Layout