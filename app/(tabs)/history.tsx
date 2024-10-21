import React, { useEffect, useState } from 'react';
import { View, Text, Avatar } from 'react-native-ui-lib';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/tailwind';
import Ionicons from '@expo/vector-icons/Ionicons';
import TripCard from '@/components/history/TripCard';
import { collection, getDocs } from 'firebase/firestore'; // Firestore methods
import { auth, db } from '@/firebaseConfig'; // Firebase setup

interface TripData {
  id: string;
  rider: string;
  tripTotal: number;
  riderImageUrl: string;
}

const History = () => {
  const [tripData, setTripData] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch trip history from Firestore
  useEffect(() => {
    const fetchTripHistory = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const tripHistoryRef = collection(db, 'users', currentUser.uid, 'tripHistory');
        try {
          const tripHistorySnapshot = await getDocs(tripHistoryRef);
          const trips = tripHistorySnapshot.docs.map(doc => ({
            id: doc.id,
            rider: doc.data().rider,
            tripTotal: doc.data().tripTotal,
            riderImageUrl: doc.data().riderImageUrl,
          }));

          setTripData(trips);
        } catch (error) {
          console.error('Error fetching trip history:', error);
        }
      }
      setLoading(false);
    };

    fetchTripHistory();
  }, []);

  const renderItem = ({ item }: { item: TripData }) => (
    <TripCard
      userName={item.rider}
      tripTotal={item.tripTotal}
      userImageUri={item.riderImageUrl}
      handlePress={() => router.push(`history_aux/${item.id}`)}
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
