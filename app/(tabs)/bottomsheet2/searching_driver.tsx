import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import CarBigSVG from "../../../assets/car-big.svg";
import tw from '../../../tailwind';
import { Bar } from 'react-native-progress';
import { baseColor } from '../../../constants/Colors';
import { Button } from 'react-native-ui-lib';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
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
    if (!tripId) return;

    const tripRef = doc(db, "trips", tripId);

    // Listen for real-time updates to the trip
    const unsubscribe = onSnapshot(
      tripRef,
      (tripSnap) => {
        if (!tripSnap.exists()) {
          console.log("Trip not found.");
          Toast.show({
            type: "error",
            text1: "Trip not found."
          });
          return;
        }

        const data = tripSnap.data();
        setTripData(data);

        // Navigate to driver arriving screen when driver is assigned
        if (data.driverId && data.status === 'TRIP_ACCEPTED') {
          console.log('Driver assigned! Navigating to DriverArriving screen');
          navigation.navigate('DriverArriving', {
            tripId,
            ...params,
            ...data,
          });
        }
      },
      (error) => {
        console.error("Error listening to trip:", error);
        Toast.show({
          type: "error",
          text1: "Error fetching trip"
        });
      }
    );

    return () => unsubscribe();
  }, [tripId, navigation, params]);

  useEffect(() => {
    const timer = setTimeout(() => setShowProgress(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleCancelRide = async () => {
    if (!tripId) return;

    try {
      const tripRef = doc(db, "trips", tripId);
      
      // Get trip data first to check if driver was assigned
      const tripSnap = await getDoc(tripRef);
      const tripData = tripSnap.data();
      
      // Update trip status
      await updateDoc(tripRef, {
        status: 'TRIP_CANCELED',
        isCanceled: true,
      });

      // Free the driver if one was assigned
      if (tripData?.driverId) {
        const driverRef = doc(db, "drivers", tripData.driverId);
        await updateDoc(driverRef, {
          isAvailable: true,
          status: 'AVAILABLE',
          currentTripId: null,
        });
        console.log(`Freed driver ${tripData.driverId} from canceled trip`);
      }

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
