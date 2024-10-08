import React, { useState } from 'react'
import Text from 'react-native-ui-lib/text'
import Button from 'react-native-ui-lib/button'
import { TextInput, View } from "react-native"
import tw from "@/tailwind"

import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Withdraw = () => {
	const [amount, setAmount] = useState<number>(0)

	return (
		<View style={tw`flex-1 bg-white dark:bg-gray-800`}>
			<View style={tw`bg-ollie-base p-3 gap-5 py-9`} >
				<Text poppins center style={tw`text-white`}>Enter amount to withdraw</Text>
				<TextInput 
				style={tw`poppins p-4 border rounded-md border-gray-400 text-3xl text-white text-center`} 
				keyboardType = "numeric"
				onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))} // Restricts input to numbers only
		        value={amount} 
				/>
			</View>
			<View style={tw`flex-row items-center justify-between border dark:border-white border-blue-900 p-5`} >
				<View style={tw`flex-row items-center gap-2`}>
					<FontAwesome name="bank" size={22} style={tw`dark:text-white`} />
					<View>
						<Text style={tw`dark:text-white`} poppins>****23456</Text>
						<Text style={tw`dark:text-white`} poppins >Bank Of Nigeria</Text>
					</View>
				</View>
				<AntDesign name="right" size={24} color="grey" />
			</View>
			<View style={tw`p-3 flex-1`} >
				<View style={tw`gap-3 my-4`}>
					<View style={tw`flex-row justify-between`} >
						<Text poppinsMedium>Earnings</Text>
						<Text poppinsMedium>$400.24</Text>
					</View>
					<View style={tw`flex-row justify-between`} >
						<Text poppins>Trip Earnings</Text>
						<Text poppins>$20.24</Text>
					</View>
					<View style={tw`flex-row justify-between`} >
						<Text poppins>Tax</Text>
						<Text poppins style={tw`text-red-500`} >$40.24</Text>
					</View>
				</View>	
				{/* Horizonatal line */}
				<View style={tw`h-[0.5px] bg-gray-500 my-8`}></View>
				<View style={tw`flex-1 justify-between`}>
					<View style={tw`flex-row justify-between`} >
						<Text poppinsBold>Earnings</Text>
						<Text poppinsBold>$400.24</Text>
					</View>
					<Button label = "Withdraw" style={tw`btn`} />
				</View>
				
			</View>

		</View>
	)
}

export default Withdraw