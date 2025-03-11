import React from 'react'
import { View, Text } from 'react-native'
import { Stack } from "expo-router"
import tw from "@/tailwind"
import { AntDesign } from '@expo/vector-icons'


const Layout = () => {
	return (
		<Stack screenOptions={{ 
			headerTitleStyle: {fontFamily: "Poppins_400Regular", fontSize: 20},
			headerTitleAlign: "center",
			headerLeft: ({tintColor}) => (<AntDesign name="left" size={24} color={tintColor} onPress = {()=> router.back()} />)
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
				title: "Driver Verification",
				headerStyle: {elevation: 0, border: 0},
			}} 
			/>
			<Stack.Screen name="update_profile" options = {{ 
				headerShown: true, 
				title: "Update Profile",
				headerStyle: {elevation: 0, border: 0},
			}} 
			/>
		</Stack>
	)
}

export default Layout