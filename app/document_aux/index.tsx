import React from 'react'
import { View } from 'react-native'
import Text from 'react-native-ui-lib/text'

import DocumentCard from "../../components/document/DocumentCard"

import tw from "../../tailwind";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Index = () => {
	return (
		<View style={tw`bg-white flex-1 p-3 gap-3`}>
			<Text poppins> Please complete all the processes below to set up your account</Text>
			<DocumentCard 
			title = "Drivers License"
			subtitle = "Upload a photo of your driving license"
			status = "empty"
			icon = {<AntDesign name="exclamationcircle" size={24} color="#E4C41D" />}
			/>
			<DocumentCard 
			title = "Uploaded Your NIN"
			subtitle = "Upload a photo of your driving license"
			status = "review"
			icon = {<MaterialIcons name="access-time-filled" size={24} color="black" />}
			/>
			<DocumentCard 
			title = "We approved your driving license"
			status = "done"
			icon = {<AntDesign name="checkcircle" size={24} color="green" />}
			/>
			<DocumentCard 
			title = "Drivers License"
			// subtitle = "Upload a photo of your driving license"
			status = "error"
			icon = {<AntDesign name="exclamationcircle" size={24} color="red" />}
			/>
		</View>
	)
}

export default Index