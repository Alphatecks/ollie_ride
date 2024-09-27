import React from 'react'
import { View, Text, Image, Colors, Button } from 'react-native-ui-lib'
// import tw from "twrnc"
import tw from "@/tailwind"
import { Link } from "expo-router"

import {SafeAreaView} from "react-native-safe-area-context"
import Gateway from "@/assets/images/gateway.svg"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const Home = () => {

	return (
		<SafeAreaView style={tw`bg-white dark:bg-dark flex-1 p-3 justify-center gap-y-10`}>
			<View style={tw`justify-center items-center`} >
				<View style={tw` bg-yellow-300 bg-opacity-10 h-[300px] w-[300px] rounded-full items-center justify-center border-[0.5px] border-yellow-400`} >
					<Gateway />
				</View>
			</View>
			<View>
				<View style={tw`flex-row justify-between bg-purple-500 p-6 rounded-md`}>
					<Text interMedium p1 style={tw`text-white`} >Quick Sell</Text>
					<MaterialIcons name="point-of-sale" size={24} color="white" />
				</View>
				<Link asChild href="auth/sign_up">
					<Button label="Create Acccount" inter style={tw`btn bg-purple-900 `} />
				</Link> 
			</View>
			<Text interMedium style={tw`py-4`}>
			    Have an account?
				<Link href="auth/sign_in" asChild >
					<Text style={tw`text-gateway-base`}> Sign In</Text>
				</Link>
			</Text>
		</SafeAreaView>
	)
}

export default Home