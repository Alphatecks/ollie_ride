import React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { View, Text, Button, Avatar } from 'react-native-ui-lib'
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@/tailwind";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';


import { useRouter } from "expo-router"

import ProfileOptionsCard from "@/components/profile/ProfileOptionsCard"

const Profile = () => {
	const router = useRouter()

	return (
			<View style = {tw`flex-1 bg-white`} >
				<View style={tw`bg-ollie-base h-[170px] flex-row justify-between p-3`}>
					<View></View>
					<View style={tw`items-center`}>
						<Avatar name = "Peter Creche" />
						<View style={tw`flex-row items-center my-2`}>
							<MaterialIcons name="star" size={16} color="white" />
							<Text style={tw`text-white poppins`}> 4.0 </Text>
						</View>
						<Text style={tw`poppinsMedium text-white`}>Peter Creche</Text>
					</View>
					<Text style={tw`text-white`}>Edit</Text>
				</View>
				<View style={tw`p-4`}>
				<View style={tw`bg-white shadow-md -mt-10 rounded-md p-3 gap-2`}>
					<Text poppins center>Trips Completed</Text>
					<Text poppinsMedium center>233 trips over 2 years</Text>
					<View style={tw`h-[1px] bg-gray-300 my-3`}></View>
					<View style={tw`flex-row gap-2 justify-around`}>
						<View>
							<Text poppins style={tw`text-gray-400`}>Acceptance Rate</Text>
							<Text poppinsMedium center>70%</Text>
						</View>
						<View>
							<Text poppins style={tw`text-gray-400`}>Cancelation Rate</Text>
							<Text poppinsMedium center>70%</Text>
						</View>
					</View>
				</View>
				</View>
				{/* Profile Options */}
				<View style={tw`p-3 gap-7`}>
					<ProfileOptionsCard title = "Payment" icon = {<MaterialCommunityIcons name="file-document-outline" size={24} color="black" />}/>
					<ProfileOptionsCard title = "Documents" icon = {<FontAwesome5 name="coins" size={24} color="black" />} />
					<ProfileOptionsCard title = "Settings" icon={<MaterialCommunityIcons name="cog-outline" size={24} color="black" />} />
					<ProfileOptionsCard title = "Help Center" icon={<MaterialCommunityIcons name="headset" size={24} color="black" />} />
					<ProfileOptionsCard title = "Log Out"  textStyle = "text-red-500" icon = {<AntDesign name="logout" size={24} color="red" />} hasArrowIcon = {false} />
				</View>
			</View>
	)
}

export default Profile