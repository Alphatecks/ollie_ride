import React, {ReactNode} from 'react'
import { View, Text, Button, Colors, Image } from 'react-native-ui-lib'
import HeadsetSVG from "@/assets/Headset.svg"
import tw from '@/tailwind'

// import CarRedSVG from "@/assets/CarRed.svg"
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// import AntDesign from '@expo/vector-icons/AntDesign';

interface ChatCardSenderProps {
	message: string;
}

type ChatBubbleProps = {
    message: string,
    messageDate: string
}

export const ChatCardReciever: React.FC<ChatCardSenderProps> = ({ message, children }) => {
		return (
		<View style={tw`flex-row gap-x-2 my-2`}>
			<HeadsetSVG style={tw`h-12 w-12 rounded-full`} />
			<View style={tw`flex-1 gap-y-5`}>
				{ children }	
			</View>

		</View>
	)
}
export const ChatCard: React.FC<ChatCardSenderProps> = ({ message, isSender, children }) => {
		return (
		<View style={tw`flex-row gap-x-2 my-2`}>
			{isSender ? 
				<View style={tw`h-12 w-12`}></View>
				:
				<HeadsetSVG style={tw`h-12 w-12 rounded-full`} />
			}
			<View style={tw`flex-1 gap-y-5`}>
				{ children }	
			</View>

		</View>
	)
}

export const ChatBubble = ({ message, messageDate }: ChatBubbleProps) => {
	return(
    <View style={tw`gap-1`}>
        <View style={tw`flex-row justify-end`}>
            <View style={tw`border-[0.8px] bg-[#8ED7FF4D] border-ollie-base p-3 rounded-l-lg rounded-br-lg`}>
            <Text poppins style={tw``}>{message}</Text>
            </View>
        </View>
        <Text poppins style={tw`text-right`}>{messageDate}</Text>
    </View>

	)
}

// export default ChatCardSender