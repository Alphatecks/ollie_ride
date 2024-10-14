import React from 'react'
import { View } from 'react-native'
import Text from "react-native-ui-lib/text"
import tw from "@/tailwind"
import FontAwesome from '@expo/vector-icons/FontAwesome';

import PaymentCard from "@/components/payment/PaymentCard"


const AccountList = () => {
	return (
		<View style={tw`bg-white p-3 flex-1`}>
			<Text poppinsMedium>All Bank Accounts</Text>
			<View>
				<PaymentCard title = "***909902321"
				subtitle = "Access Bank"
				href = "payment/1"
				icon = {<FontAwesome name="amazon" size={24} color="black" />}
				 />	
 				<PaymentCard title = "***677409093"
				subtitle = "GT Bank"
				icon = {<FontAwesome name="amazon" size={24} color="black" />}
				 />	
			</View>
		</View>
	)
}

export default AccountList