import React, { useEffect, useState } from 'react';
import { View, Text, Avatar } from 'react-native-ui-lib';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from "../../tailwind";
import Ionicons from 'react-native-vector-icons/Ionicons';
import TripCard from '../../components/history/TripCard';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Firestore methods
import { auth, db } from '../../firebaseConfig'; // Firebase setup
import { Trip } from '../../types';

interface TripData {
  id: string;
  rider: string;
  tripTotal: number;
  riderImageUrl: string;
}

const History = () => {
  const [tripData, setTripData] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Fetch trip history from Firestore
  useEffect(() => {
    const fetchTripHistory = async () => {
      const currentUser = auth.currentUser;
      
      const tripsCollection = collection(db, 'trips');

      const tripsQuery = query(
        tripsCollection,
        where('status', '==', 'TRIP_ENDED'),
        where('driverId', '==', currentUser?.uid)
      );


      if (currentUser) {

        try {
          const querySnapshot = await getDocs(tripsQuery);
          const endedTrips = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setTripData(endedTrips)
      
          console.log('Ended trips for current user:', endedTrips);
          setLoading(false)

        } catch (error) {
          console.error('Error fetching ended trips:', error);
          throw error;
        }

      }

      setLoading(false);
    };

    fetchTripHistory();
  }, []);

  const renderItem = ({ item }: { item: Trip }) => (
    <TripCard
      userName={item.riderName}
      tripTotal={item.tripAmount}
      userImageUri={item.riderImageUrl}
      rating={item?.rating}
      handlePress={() => navigation.navigate('TripDetails', {
        pathname: `/history_aux/${item.id}`,
        params: item
      })}
    />
  );

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 p-3 bg-white`}>
      {tripData.length > 0 ? (
        <FlatList
          data={tripData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={tw`gap-2`}
        />
      ) : (
        <View style={tw`flex-1 justify-center items-center`}>
          <Ionicons name="car-outline" size={50} color="gray" />
          <Text style={tw`text-gray-500 mt-4 poppins`}>No trip history found</Text>
        </View>
      )}
    </View>
  );
};

export default History;
