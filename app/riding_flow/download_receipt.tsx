import React, {useState} from 'react'
import { View } from 'react-native'
import Text from "react-native-ui-lib/text"
import tw from "@/tailwind"

import { Button, TextField } from 'react-native-ui-lib';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Car from "@/assets/car.svg"


const DownloadReceipt = () => {
	const [currentValue, setCurrentValue] = useState<string>('Cash');
    const [reviewText, setReviewText] = useState<string>('');

	return (
		<View style={tw`bg-white p-3 flex-1 justify-between`}>
            <View style={tw`items-center`}>
                <Car />
                <Text poppinsMedium center h2 style={tw`text-ollie-base`} >Congratulations!!!</Text>
                <Text poppins center style={tw`my-2`} >Download your receipt below</Text>
            </View>
            <View style={tw`h-40 border border-[0.2] border-gray-300 rounded-md`}>

            </View>
			
			<Button label="Back To Home" poppins style={tw`btn`} />
		</View>
	)
}

export default DownloadReceipt