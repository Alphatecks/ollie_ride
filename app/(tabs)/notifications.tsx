import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Text from 'react-native-ui-lib/text'
import Avatar from 'react-native-ui-lib/avatar'
import tw from "@/tailwind"
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { NotificationCardMessage } from "@/components/notification/NotificationCardBase"

const Notifications = () => {
	const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd"

	return (
		<View style={tw`bg-white flex-1 p-3`}>
			<View style={tw`border border-[0.9px] border-ollie-base rounded-md p-4 gap-4`}>
				<Text poppinsMedium style={tw`text-gray-500`} >Ongoing trip</Text>
				<TouchableOpacity 
				 style={tw`flex-row justify-between items-center rounded-md`}>
			      <View style={tw`flex-row gap-2 items-center`}>
			        <Avatar name="User Name" source={{ uri: url}} />
			        <View>
			          <Text style={tw`poppins`}>Miracle Geidt</Text>
			          <View style={tw`flex-row items-center gap-2`}>
			            <Text style={tw`poppins`}>08012345987</Text>
			          </View>
			        </View>
			      </View>
			      <View>
			        <Text poppinsMedium style={tw` text-gray-600`}>3:30pm</Text>
			      </View>
			    </TouchableOpacity>
			    {/* Horizontal line */}
			    <View style={tw`h-[0.8px] bg-gray-300`}></View>
			    <View style={tw`flex-row justify-around`}>
			    	<TouchableOpacity style={tw`items-center gap-2`}>
			    		<Ionicons name="call" size={24} style={tw`text-ollie-base`} />
			    		<Text poppinsMedium style={tw`text-ollie-base`} >Call</Text>
			    	</TouchableOpacity>
			    	<TouchableOpacity style={tw`items-center gap-2`}>
				    	<MaterialIcons name="message" size={24} style={tw`text-ollie-base`}/>
			    		<Text poppinsMedium style={tw`text-ollie-base`} >Chat</Text>
			    	</TouchableOpacity>
					<TouchableOpacity style={tw`items-center gap-2`}>
						<MaterialCommunityIcons name="navigation-variant" size={25} style={tw`text-ollie-base`} />
			    		<Text poppinsMedium style={tw`text-ollie-base`} >Navigation</Text>
			    	</TouchableOpacity>
			    </View>
			</View>
			<View style={tw`my-8 gap-4`}>
				<Text poppinsMedium >Notifications</Text>
				<View style={tw`p-3`}>
				{/* Use a flatlist for this when rendering */}
					<NotificationCardMessage title = "James Milner Messaged you" 
					time = "10:30 pm"
					message = "You got a 5 star rating" 
					imageUrl = {url}
					/>
				</View>
			</View>
		</View>
	)
}

export default Notifications