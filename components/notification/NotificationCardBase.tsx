import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Avatar } from 'react-native-ui-lib'; // Assuming you're using react-native-elements for Avatar

import tw from "@/tailwind"

/*
  TODO: Add same style  from NotificationCardMessage to NotificationCardBase
  to avoid text from overflowing
*/
interface NotificationCardBaseProps {
  name: string;
  imageUrl: string;
  phoneNumber: string;
  time: string;
}

const NotificationCardBase: React.FC<NotificationCardBaseProps> = ({
  name,
  imageUrl,
  phoneNumber,
  time,
}) => {
  const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd"

  return (
    <TouchableOpacity style={tw`flex-row justify-between items-center rounded-md`}>
      <View style={tw`flex-row gap-2 items-center`}>
        <Avatar name={name} source={{ uri: imageUrl || url }} />
        <View>
          <Text style={tw`poppins`}>{name}</Text>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={tw`poppins text-gray-400`}>{phoneNumber}</Text>
          </View>
        </View>
      </View>
      <View>
        <Text style={[tw`poppinsMedium`, { color: 'gray' }]}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCardBase;


interface NotificationCardMessageProps {
  title: string;
  imageUrl: string;
  message: string;
  time: string;
}

export const NotificationCardMessage: React.FC<NotificationCardMessageProps> = ({
  title,
  imageUrl,
  message,
  time,
}) => {
  return (
    <TouchableOpacity style={tw`flex-row justify-between items-center rounded-md`}>
      <View style={tw`flex-row gap-2 items-center flex-1`}>
        <Avatar name={title} source={{ uri: imageUrl }} />
        <View style={tw`flex-1 gap-1`}>
          <Text style={tw`poppinsMedium`}>{title}</Text>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={tw`poppins text-gray-500`}>{message}</Text>
          </View>
        </View>
      </View>
      <View>
        <Text style={[tw`poppinsMedium`, { color: 'gray' }]}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
};
