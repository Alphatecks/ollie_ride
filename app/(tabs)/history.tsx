import React from 'react'
import { View, Text, Avatar } from 'react-native-ui-lib'
import {FlatList} from "react-native"
import { useRouter } from "expo-router"

import { SafeAreaView } from "react-native-safe-area-context"
import tw from "@/tailwind"
import Ionicons from '@expo/vector-icons/Ionicons';

import TripCard from "@/components/history/TripCard"


interface TripData {
  id: string;
  userName: string;
  rating: number;
  tripTotal: number;
  userImageUri: string;
}

const tripData: TripData[] = [
  { id: '1', userName: 'Chinaza Mgbeke', rating: 4.5, tripTotal: 300, userImageUri: '' },
  { id: '2', userName: 'Anyalewechi Maduka', rating: 4.8, tripTotal: 250, userImageUri: '' },
  { id: '3', userName: 'Nwammuo Eunince', rating: 4.7, tripTotal: 320, userImageUri: '' },
];

const History = () => {

	const router = useRouter()

	const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd"
	const renderItem = ({ item }: { item: TripData }) => (
	    <TripCard 
	      userName={item.userName}
	      rating={item.rating}
	      tripTotal={item.tripTotal}
	      userImageUri={item.userImageUri}
	      handlePress = {()=> router.push(`history_aux/${item.id}`)}
	    />
  );
	return (
		<View style={tw`flex-1 p-3 bg-white`}>
			<FlatList
			data={tripData}
			keyExtractor={item => item.id}
			renderItem={renderItem}
			contentContainerStyle={tw`gap-2`}
			/>
		</View>
	)
}

export default History