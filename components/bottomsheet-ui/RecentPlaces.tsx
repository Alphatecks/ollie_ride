import React from 'react'
import { View, Text } from 'react-native-ui-lib'
import tw from "twrnc"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MapSVG from "../../assets/map1.svg"


interface RecentPlacesProps {
	isBlue?: boolean
}

const RecentPlaces: React.FC<RecentPlacesProps> = ({isBlue = true}) => {
		return (
		<View style={tw`p-3 flex-row justify-between items-center`}>
			<MapSVG />
			<View style={tw`flex-1`}>
				<Text poppinsMedium p1 >Office</Text>
				<Text poppins>2972 Westheimer Rd. Santa Ana, Illinois 85486 </Text>
			</View>		
			<Text>1.2km</Text>
		</View>
	)
}

export default RecentPlaces