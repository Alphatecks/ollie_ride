import React, {useState} from 'react'
import { Alert, View } from 'react-native'
import Text from "react-native-ui-lib/text"
import tw from "@/tailwind"

import { Button, RadioButton, RadioGroup } from 'react-native-ui-lib';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import ButtonLoader from '@/components/general/ButtonLoader';


const PaymentDetails = () => {
	const [currentValue, setCurrentValue] = useState<string>('Cash');
	const router = useRouter()

	const params = useLocalSearchParams()
	const [loading, setLoading] = useState<boolean>(false)

	console.log("From bottomsheet: ", params?.id)

	console.log(currentValue)

	const selectedTripId = params?.id

	const handleVerifyPayment = async () => {
		// If Credit is selected then open paystack to pay via

		
		if (!selectedTripId) {
			Alert.alert("Error", "There is no selected trip object")
			return
		}
		
		const selectedTripRef = doc(db, "trips", selectedTripId)
		
		try{
			setLoading(true)
			await updateDoc(selectedTripRef, {
				isPaymentVerified: true
			})

			console.log("Verified payment_details and updated firebase")

			router.push({
				pathname: "/riding_flow/rate_rider",
				params: params
			})
			setLoading(false)
		}
		catch(e){
			console.log("Error occured: ", e)
			setLoading(false)
		}

	}

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
					<RadioButton value={'Cash'} label={'Cash'}/>
					<RadioButton marginT-10 value={'Debit'} label={'Debit'}/>
				</RadioGroup>
				</View>
			</View>
			{loading ?
			<ButtonLoader />
			:
			<Button label="Verify Payment" poppins style={tw`btn`}
			 onPress = {handleVerifyPayment}
			/>
			
			}
		</View>
	)
}

export default PaymentDetails