import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import CarBigSVG from "@/assets/car-big.svg";
import tw from '@/tailwind';
import { Bar } from 'react-native-progress';
import { baseColor } from '@/constants/Colors';
import { Button } from 'react-native-ui-lib';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig'; // Ensure your Firebase config is imported
import Toast from 'react-native-toast-message';

const Searching = () => {
  const router = useRouter();
  const [showProgress, setShowProgress] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [hasCanceledTrip, setHasCanceledTrip] = useState<boolean>(false)

  const params = useLocalSearchParams();
  const { tripId } = params;

  useEffect(() => {
    const fetchTripData = async () => {
      if (!tripId) return;

      try {
        const tripRef = doc(db, "trips", tripId);
        const tripSnap = await getDoc(tripRef);

        if (tripSnap.exists()) {
          setTripData(tripSnap.data());
        } else {
          console.log("Trip not found.");
          Toast.show({
            type: "error",
            text1: "Trip not found."
          });
        }
      } catch (error) {
        console.error("Error fetching trip:", error);
        Toast.show({
          type: "error",
          text1: "Error fetching trip"
        });
      }
    };

    fetchTripData();
  }, [tripId]);

  useEffect(() => {
    const timer = setTimeout(() => setShowProgress(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleCancelRide = async () => {
    if (!tripId) return;

    try {
      const tripRef = doc(db, "trips", tripId);
      await updateDoc(tripRef, {
        riderId: null,
        riderName: null,
        riderPhoneNumber: null,
        riderCurrentLocation: null,
        riderProfileImage: null,
        riderLongitude: null,
        riderLatitude: null,
        isCanceled: true, // Optionally mark the trip as canceled
      });

      setHasCanceledTrip(true)
      console.log("Ride canceled successfully");
      Toast.show({
        type: "success",
        text1: "Ride canceled successfully!!"
      });
      // router.push("/(tabs)/bottomsheet2/driver_arriving");
    } catch (error) {
      setHasCanceledTrip(false)

      console.error("Error canceling ride:", error);
      Toast.show({
        type: "error",
        text1: "Error canceling ride."
      });
    }
  };


  if(hasCanceledTrip){
    return(
      <View>
        <Text>You have canceled this ride... Go back home to start a new ride</Text>
      </View>
    )
  }
  return (
    <View style={tw`gap-12`}>
      <View style={tw`items-center justify-center gap-8`}>
        <CarBigSVG />
        <Text style={tw`poppins`}>Hold on! We’re searching for a nearby driver for you...</Text>
      </View>

      {showProgress && <Bar indeterminate={true} width={null} color={baseColor} />}
      
      <Button outline 
        style={tw`outline rounded-md`}
        label="Cancel Ride"
        onPress={handleCancelRide}
        poppins
      />
    </View>
  );
};

export default Searching;
