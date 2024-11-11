import React, {useState} from 'react'
import { View } from 'react-native'
import Text from "react-native-ui-lib/text"
import tw from "@/tailwind"


import { Button, RadioButton, RadioGroup } from 'react-native-ui-lib';
import { useRouter } from 'expo-router';


const PaymentDetails = () => {
	const [currentValue, setCurrentValue] = useState<string>('Cash');
	const router = useRouter()

	return (
		<View style={tw`bg-white p-3 flex-1 justify-between`}>
			<View style={tw`my-6`}>
				<View style={tw`flex-row justify-between`}>
					<Text poppins >Cost Per Kilometer</Text>
					<Text poppinsMedium>₦200</Text>
				</View>
				<View style={tw`flex-row justify-between`}>
					<Text poppins >Estimated Distance</Text>
					<Text poppinsMedium>100km</Text>
				</View>
				<View style={tw`h-10`}></View>
				<View style={tw`h-[0.8px] bg-gray-300 mb-6`}></View>
				<View style={tw`flex-row justify-between`}>
					<Text poppins >Final Price</Text>
					<Text poppinsMedium>₦20,000</Text>
				</View>

				<View style={tw`my-8`}>
				<Text poppinsMedium style={tw`my-4`}>Payment Method</Text>

				<RadioGroup initialValue={currentValue} onValueChange={setCurrentValue}>
					<RadioButton value={'Cash'} label={'Card'}/>
					<RadioButton marginT-10 value={'Debit'} label={'Debit'}/>
				</RadioGroup>
				</View>
			</View>

			<Button label="Verify Payment" poppins style={tw`btn`}
			onPress = {()=> router.push("riding_flow/rate_rider")}
			/>
		</View>
	)
}

export default PaymentDetails