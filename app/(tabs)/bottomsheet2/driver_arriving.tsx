import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import CarBigSVG from "../../../assets/car-big.svg"
import EmergencySVG from "../../../assets/emergency.svg"
import tw from '../../../tailwind'
import { Button, TouchableOpacity } from 'react-native-ui-lib'
import DriverProfile from '../../../components/bottomsheet-ui/DriverProfile'
import { useNavigation, useRoute } from '@react-navigation/native'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebaseConfig'
import Toast from 'react-native-toast-message'


// Handle both driver arriving and also ride in progress.

const Index = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const [inProgress, setInProgress] = useState<boolean>(false)
    
    // Get trip data from route params
    const tripData = route.params || {}
    const {
      tripId,
      driverId,
      driverDisplayName = 'Driver',
      driverPhoneNumber = '',
      tripAccessCode = '',
      carBrand = 'N/A',
      carColor = 'N/A',
      licenseNumber = 'N/A',
    } = tripData

  const handleCancelRide = async () => {
    if (!tripId) return;

    try {
      const tripRef = doc(db, "trips", tripId);
      
      // Update trip status
      await updateDoc(tripRef, {
        status: 'TRIP_CANCELED',
        isCanceled: true,
      });

      // Free the driver if one was assigned
      if (driverId) {
        const driverRef = doc(db, "drivers", driverId);
        await updateDoc(driverRef, {
          isAvailable: true,
          status: 'AVAILABLE',
          currentTripId: null,
        });
        console.log(`Freed driver ${driverId} from canceled trip`);
      }

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
        <ScrollView 
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!inProgress && (
            <Text style={tw`border-b-[0.8px] border-gray-300 py-3 poppins text-center mb-4`}>
              Your ride is arriving in 3 minutes
            </Text>
          )}

          {inProgress && (
            <View style={tw`flex-row justify-between border-b-[0.8px] border-gray-300 py-3 mb-4`}>
              <TouchableOpacity style={tw`flex-row gap-3 p-2 items-center`}>
                <View style={tw`h-2 w-2 rounded-full bg-green-500`}></View>
                <Text style={tw`poppins`}>In Progress</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tw`flex-row gap-1 p-2`}>
                <EmergencySVG />
                <Text style={tw`poppins text-red-500`}>Emergency</Text>
              </TouchableOpacity>
            </View>
          )}

          <DriverProfile
            name={driverDisplayName}
            phoneNumber={driverPhoneNumber}
            rating={4.4}
            accessCode={String(tripAccessCode)}
            carBrand={carBrand}
            carColor={carColor}
            licenseNumber={licenseNumber}
            profileImage={tripData.driverProfileImage}
          />

          <Button 
            outline 
            style={tw`outline rounded-md mt-6`}
            label="Cancel Ride"
            onPress={handleCancelRide}
            poppins
          />
        </ScrollView>
      </View>
    </View>
  )
}

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
    maxHeight: '85%',
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
  scrollContent: {
    flexGrow: 0,
  },
});

export default Index