import React from 'react'
import { ScrollView } from 'react-native'
import { View, Text, Button } from 'react-native-ui-lib'
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@/tailwind";

import { useRouter } from "expo-router"

import { BarChart } from "react-native-gifted-charts";


const Wallet = () => {
	const router = useRouter()


	console.log(router)

	const barData = [
        {value: 250, label: 'M'},
        {value: 500, label: 'T', frontColor: '#177AD5'},
        {value: 745, label: 'W', frontColor: '#177AD5'},
        {value: 320, label: 'T'},
        {value: 600, label: 'F', frontColor: '#177AD5'},
        {value: 256, label: 'S'},
        {value: 300, label: 'S'},
    ];

	return (
		<SafeAreaView style={tw`bg-white flex-1 p-3`}>
			<ScrollView showsVerticalScrollIndicator = {false} style = {tw`flex-1`} >
				<View style={tw`flex-row gap-4 border border-[0.8px] p-4 rounded-md border-blue-900 my-3`}>
					<View style={tw`flex-grow`}>
						<Text poppins style={tw`text-gray-500`}>Wallet Balance</Text>
						<Text poppinsMedium h2>$145.43</Text>
						<Text poppins>Today’s earnings: $30.51</Text>
					</View>
					<View style={tw`flex-grow justify-center`}>
						<Button label = "Withdraw" style={tw`btn`} poppins
							onPress={()=> router.push("wallet_aux/withdraw")}  />
					</View>
				</View>
				<View style={tw`items-center my-4`}>
					<Text poppins >Dec 18 - 16</Text>
					<Text poppinsMedium h2>$120.34</Text>
				</View>
				<View style={tw`my-4`}>
					 <BarChart
		                barWidth={22}
		                noOfSections={3}
		                barBorderRadius={4}
		                frontColor="lightgray"
		                // backgroundColor = "green"
		                data={barData}
		                yAxisThickness={0}
		                xAxisThickness={0}
		                labelTextStyle = {tw`poppins`}
		                xAxisLabelTextStyle = {tw`poppins`}
		                yAxisLabelTextStyle = {tw`poppins`}
		                isAnimated
		            />				
				</View>

				<View style={tw`flex-row gap-4 justify-evenly my-3`}>
					<View>
						<Text poppins style={tw`text-gray-500`} >Total Trips</Text>
						<Text poppinsMedium >78</Text>
					</View>
					<View>
						<Text poppins style={tw`text-gray-500`} >Time Online</Text>
						<Text poppinsMedium >78 Days</Text>
					</View>
					<View>
						<Text poppins style={tw`text-gray-500`} >Distance Covered</Text>
						<Text poppinsMedium >700 km</Text>
					</View>
				</View>
				<View style={tw`gap-3 my-3`}>
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
						<Text poppins>$40.24</Text>
					</View>
				</View>				
			</ScrollView>
		</SafeAreaView>
	)
}

export default Wallet