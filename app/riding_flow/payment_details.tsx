import React from 'react'
import { View } from 'react-native'
import Text from "react-native-ui-lib/text"
import tw from "@/tailwind"
import FontAwesome from '@expo/vector-icons/FontAwesome';

import PaymentCard from "@/components/payment/PaymentCard"


const PaymentDetails = () => {
	return (
		<View style={tw`bg-white p-3 flex-1`}>
			<Text poppinsMedium>Payment Details</Text>
		</View>
	)
}

export default PaymentDetails