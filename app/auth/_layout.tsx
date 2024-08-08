import { Stack } from "expo-router"
import { View, Text } from 'react-native'

const AuthLayout = () => {
	return (
		<Stack 
		screenOptions = {{
			headerShown: false,
		}}
		>
			<Stack.Screen name = "index" />
		</Stack>
	)
}

export default AuthLayout