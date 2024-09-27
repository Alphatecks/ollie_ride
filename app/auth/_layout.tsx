import React from 'react'
import { View, Text } from 'react-native'
import { Stack } from "expo-router"
import tw from "@/tailwind"


const Layout = () => {
	return (
		<Stack screenOptions={{ 
			headerTitleStyle: {fontFamily: "Inter400_Regular", fontSize: 16},
		 }} >
			<Stack.Screen name="sign_up" options = {{ 
				headerShown: true, 
				title: "",
				headerStyle: {elevation: 0, border: 0},
			}} 
				/>
			<Stack.Screen name="sign_in" options = {{ 
				headerShown: true, 
				title: "",
				headerStyle: {elevation: 0, border: 0},
			}} 
				/>	
			<Stack.Screen name="await_email_verification" options = {{ 
				headerShown: true, 
				title: "",
				headerStyle: {elevation: 0, border: 0},
			}} 
			/>			
			<Stack.Screen name="upload_car_details" options = {{ 
				headerShown: true, 
				title: "",
				headerStyle: {elevation: 0, border: 0},
			}} 
			/>
		</Stack>
	)
}

export default Layout