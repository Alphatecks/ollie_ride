import React from 'react'
import { View } from 'react-native'
import Text from "react-native-ui-lib/text"
import tw from "@/tailwind"

import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';

import PaymentCard from "@/components/payment/PaymentCard"

const Index = () => {
	return (
		<View style={tw`bg-white flex-1 p-3`}>
			<Text poppinsMedium>Add a payment method to receive payout</Text>
			<View>
				<PaymentCard 
				hasArrowIcon = {false}
				href = "payment/account_list"
				icon = {<FontAwesome name="bank" size={24} style={tw`text-ollie-base`} />}
				title = "Bank account" 
				subtitle = "Enter in your bank account details to receive your payments" />
			</View>
			<Text poppinsMedium>Add new payment method</Text>
			<View>
				<PaymentCard 
				hasArrowIcon = {false}
				icon = {<AntDesign name="creditcard" size={24} style={tw`text-ollie-base`}/>}
				title = "Debit Card" 
				subtitle = "Enter in your debit card details to make payments" />
			</View>
		</View>
	)
}

export default Index