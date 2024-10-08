import React from 'react'
import { View } from 'react-native'
import Text from 'react-native-ui-lib/text'
import tw from "@/tailwind"

const Notifications = () => {
	return (
		<View style={tw`bg-white flex-1`}>
			<Text center poppins>Notifications Incoming</Text>
		</View>
	)
}

export default Notifications