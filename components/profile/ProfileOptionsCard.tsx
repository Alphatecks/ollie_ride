import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native-ui-lib'
import tw from "twrnc"
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router"

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface ProfileOptionsCardProps {
	title: string;
	href: string;
	icon: React.Node;
	hasArrowIcon: boolean;
	textStyle: string;
}

const ProfileOptionsCard: React.FC<ProfileOptionsCardProps> = ({title, href, icon, hasArrowIcon = true, textStyle }) => {

	const router = useRouter()

	return (
		<TouchableOpacity style={tw`flex-row justify-between items-center`}
		onPress = {()=> router.push(href)}
		>	
			<View style={tw`flex-row items-center gap-3`}>
				{/*<MaterialCommunityIcons name="file-document-outline" size={24} color="black" />*/}
				{icon}
				<Text poppins style = {tw`${textStyle}`} >{ title ? title : "Change Password" } </Text>
			</View>
			{ hasArrowIcon && <Feather name="chevron-right" size={24} style={tw`text-gray-600`} />  }

		</TouchableOpacity>
	)
}

export default ProfileOptionsCard