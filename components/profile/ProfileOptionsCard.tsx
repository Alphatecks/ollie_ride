import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native-ui-lib'
import tw from "twrnc"
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProfileOptionsCardProps {
	title: string;
	href: string;
	icon: React.Node;
	hasArrowIcon: boolean;
	textStyle: string;
	disabled: boolean;
}

const ProfileOptionsCard: React.FC<ProfileOptionsCardProps> = ({title, href, icon, disabled = false, hasArrowIcon = true, textStyle }) => {

	const navigation = useNavigation()

	return (
		<TouchableOpacity style={tw`flex-row justify-between items-center`}
		onPress = {disabled ? ()=>{} : ()=> navigation.navigate(href)}
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


interface ProfileOptionsLogoutCardProps {
	title: string;
	icon: React.Node;
	hasArrowIcon: boolean;
	textStyle: string;
	handlePress: () => void;
}

export const ProfileOptionsLogoutCard: React.FC<ProfileOptionsLogoutCardProps> = ({title, icon, handlePress, hasArrowIcon = true, textStyle }) => {

	return (
		<TouchableOpacity style={tw`flex-row justify-between items-center`}
		onPress = {handlePress}
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

