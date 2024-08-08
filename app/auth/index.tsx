import React from 'react'
import { View, Text, Image } from 'react-native'
import tw from "@/tailwind"
import { Button } from '@rneui/themed';


const Index = () => {
	return (
		<View style={tw`flex-1 bg-white items-center justify-center`} >
			<Image source={require('../../assets/images/onboarding/carpool.png')}
	          style = {tw`h-[200px] w-[200px]`}
	         />
	        <View style={tw`w-full items-center justify-center px-10 space-y-2`}  >
	        	<Text style={tw`text-2xl font-bold`}>Welcome</Text>
				<Text>Have a better riding experience</Text>
			  	<Button title="Are you a rider?"
			  	containerStyle = {tw`w-full rounded-md`}
			  	buttonStyle = {tw`p-3`}
			  	/>
	        </View>
			
		</View>
	)
}

export default Index