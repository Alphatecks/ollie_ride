import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import CarBigSVG from "../../../assets/car-big.svg"
import EmergencySVG from "../../../assets/emergency.svg"
import tw from '../../../tailwind'
import { Button, TouchableOpacity } from 'react-native-ui-lib'
import DriverProfile from '../../../components/bottomsheet-ui/DriverProfile'
import { useNavigation, useRoute } from '@react-navigation/native'


// Handle both driver arriving and also ride in progress.

const Index = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const [inProgress, setInProgress] = useState<boolean>(false)
    
    // Get trip data from route params
    const tripData = route.params || {}
    const {
      driverDisplayName = 'Driver',
      driverPhoneNumber = '',
      tripAccessCode = '',
      carBrand = 'N/A',
      carColor = 'N/A',
      licenseNumber = 'N/A',
    } = tripData

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
            onPress={() => navigation.navigate('ReachedDestination')}
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