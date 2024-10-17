import React from 'react'
import { View, Text } from 'react-native'
import { Stack } from "expo-router"
import tw from "@/tailwind"


const Layout = () => {
	return (
		<Stack screenOptions={{ 
			headerTitleStyle: {fontFamily: "Poppins_400Regular", fontSize: 18},
			headerTitleAlign: "center"
		 }} >
			<Stack.Screen name="sign_up" options = {{ 
				headerShown: true, 
				title: "Sign Up",
				headerStyle: {elevation: 0, border: 0},
			}} 
				/>
			<Stack.Screen name="sign_in" options = {{ 
				headerShown: true, 
				title: "Sign In",
				headerStyle: {elevation: 0, border: 0},
			}} 
				/>	
			<Stack.Screen name="await_email_verification" options = {{ 
				headerShown: true, 
				title: "Verify Email",
				headerStyle: {elevation: 0, border: 0},
			}} 
			/>	
			<Stack.Screen name="forgot_password" options = {{ 
				headerShown: true, 
				title: "Forgot Password",
				headerStyle: {elevation: 0, border: 0},
			}} 
			/>			
			<Stack.Screen name="upload_car_details" options = {{ 
				headerShown: true, 
				title: "Upload Car Details",
				headerStyle: {elevation: 0, border: 0},
			}} 
			/>
			<Stack.Screen name="driver_verification" options = {{ 
				headerShown: true, 
				title: "",
				headerStyle: {elevation: 0, border: 0},
			}} 
			/>
		</Stack>
	)
}

export default Layout