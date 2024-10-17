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
			headerLeft: ({color}) => (<AntDesign name="left" size={24} color={color} onPress = {()=> router.back()} />)
		 }} >
			<Stack.Screen name="index" options = {{ 
				headerShown: true, 
				title: "Chats",
				headerStyle: {elevation: 0, border: 0},
			}} 
			/>	
		</Stack>
	)
}

export default Layout