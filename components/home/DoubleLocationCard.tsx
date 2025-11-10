import React, {ReactNode} from 'react'
import { View, Text, Button, Colors } from 'react-native-ui-lib'
import tw from "../../tailwind"

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';


interface DoubleLocationCardProps {
	fromLocation: string;
	toLocation: string;
	locationDistance?: number | string;
}

const DoubleLocationCard: React.FC<DoubleLocationCardProps> = ({ fromLocation, toLocation, locationDistance }) => {
		return (
		<View style={tw`w-full p-2 flex-row my-2`}>
			<View style = {tw`items-center w-6`} >
				<MaterialCommunityIcons name="map-marker" size={24} color="#BFC8D4"  />
				<View style={tw`border-dashed border-l-[1.5px] h-[40px] border-blue-600`}></View>
				<MaterialCommunityIcons name="map-marker" size={24} style={tw`text-ollie-base`} />
			</View>
			<View style={tw`flex-1 justify-between`}>
				<View style={tw`min-h-[40px] justify-center`}>
					<Text poppins style={tw`text-gray-400`} >{fromLocation ? fromLocation : "2972 Westheimer Rd. Santa Ana"} </Text>
				</View>				
				<View style={tw`flex-row justify-between`} >
					<View>
						<Text poppins style={tw`text-gray-400`} >{ toLocation? toLocation: "1901 Thornridge Cir. Shiloh, Hawaii 81063" }</Text>	
					</View>
					<Text poppinsMedium>{ locationDistance ? locationDistance : "1.1km" }</Text>
				</View>
			</View>
		</View>
	)
}

export default DoubleLocationCard


export const DoubleLocationCardVariant: React.FC<DoubleLocationCardProps> = ({ fromLocation, toLocation }) => {
		return (
		<View style={tw`w-full p-2 flex-row my-2`}>
			<View style = {tw`items-center w-6`} >
				<MaterialCommunityIcons name="map-marker" size={24} color="#BFC8D4"  />
				<View style={tw`border-dashed border-l-[1.5px] h-[60px] border-blue-600`}></View>
				<MaterialCommunityIcons name="map-marker" size={24} style={tw`text-ollie-base`} />
			</View>
			<View style={tw`flex-1 justify-between`}>
				<View>
					<Text poppins style={tw`text-gray-400`} >{fromLocation ? fromLocation : "2972 Westheimer Rd. Santa Ana"} </Text>
				</View>				
				{/* Divider between addresses */}
				<View style={tw`h-[1px] border-t border-dashed border-gray-300 my-2`} />
				<View style={tw`flex-row justify-between`} >
					<View>
						<Text poppins style={tw`text-gray-400`} >{ toLocation? toLocation: "1901 Thornridge Cir. Shiloh, Hawaii 81063" }</Text>	
					</View>
				</View>
			</View>
		</View>
	)
}
