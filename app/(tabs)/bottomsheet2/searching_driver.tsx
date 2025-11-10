import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import CarBigSVG from "../../../assets/car-big.svg";
import tw from '../../../tailwind';
import { Bar } from 'react-native-progress';
import { baseColor } from '../../../constants/Colors';
import { Button } from 'react-native-ui-lib';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig'; // Ensure your Firebase config is imported
import Toast from 'react-native-toast-message';

const Searching = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [showProgress, setShowProgress] = useState(false);
  const [tripData, setTripData] = useState(null);

  const params = route.params;
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

      console.log("Ride canceled successfully");
      Toast.show({
        type: "success",
        text1: "Ride canceled successfully!!"
      });
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error) {
      console.error("Error canceling ride:", error);
      Toast.show({
        type: "error",
        text1: "Error canceling ride."
      });
    }
  };
  return (
    <View style={styles.overlay}>
      <View style={styles.panel}>
        <View style={styles.handle} />
        <View style={tw`gap-8`}>
          <View style={tw`items-center justify-center gap-6`}>
            <CarBigSVG />
            <Text style={tw`poppins text-center text-lg`}>
              Hold on! We’re searching for a nearby driver for you...
            </Text>
          </View>

          {showProgress && (
            <Bar indeterminate width={null} color={baseColor} />
          )}

          <Button
            outline
            style={tw`outline rounded-md`}
            label="Cancel Ride"
            onPress={handleCancelRide}
            poppins
          />
        </View>
      </View>
    </View>
  );
};

export default Searching;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  panel: {
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
});
