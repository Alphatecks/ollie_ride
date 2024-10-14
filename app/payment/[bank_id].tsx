import React from 'react'
import { View, TextInput } from 'react-native'
import Text from "react-native-ui-lib/text"
import Button from "react-native-ui-lib/button"
import tw from "@/tailwind"
import FontAwesome from '@expo/vector-icons/FontAwesome';

import PaymentCard from "@/components/payment/PaymentCard"


const AccountList = () => {
	return (
		<View style={tw`bg-white p-3 flex-1 justify-between`}>
			<View style={tw`gap-9`}>
				<View>
					<Text poppins center>Account holder’s name</Text>
					<Text poppinsMedium center p1>Sixtus Anyanwu</Text>
				</View>
				<View>
					<Text poppins center>Bank Name</Text>
					<Text poppinsMedium center p1>Access Bank</Text>
				</View>
				<View>
					<Text poppins center>Account Number</Text>
					<Text poppinsMedium center p1>9898972634</Text>
				</View>
				<View style={tw`items-center`}>
					<Text poppins center>Account Number</Text>
					<TextInput style={tw`poppinsMedium text-center text-lg`}
					placeholder = "9898972634"
					placeholderTextColor = "black"
					onChangeValue = {(e)=> console.log(e)}
					 />
				</View>
			</View>
			<View style={tw`gap-4`}>
				<Button label = "Update Bank" poppins style={tw`btn`} />
				<Button label = "Delete Bank" poppins style={tw`btn`} outline />
			</View>
		</View>
	)
}

export default AccountList