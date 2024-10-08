import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Avatar } from 'react-native-ui-lib';
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from '@/tailwind';

interface TripCardProps {
  userName: string;
  rating: number;
  tripTotal: number;
  userImage: string;
  handlePress: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ userName, rating, tripTotal, userImageUri, handlePress }) => {
  const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd"
  
  return (
    <TouchableOpacity 
    onPress = {handlePress}
    style={tw`flex-row justify-between p-4 py-5 border border-[0.8px] border-blue-800 rounded-md`}>
      <View style={tw`flex-row gap-2`}>
        <Avatar name={userName} source={{ uri: userImageUri ? userImageUri : url}} />
        <View>
          <Text style={tw`poppins`}>{userName}</Text>
          <View style={tw`flex-row items-center gap-2`}>
            <Ionicons name="star" size={20} color="gold" />
            <Text style={tw`poppins`}>{rating}</Text>
          </View>
        </View>
      </View>
      <View>
        <Text poppinsMedium style={tw` text-gray-600`}>Trip Total</Text>
        <Text style={tw`poppins`}>${tripTotal}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default TripCard;
