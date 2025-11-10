import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Platform } from 'react-native';
import tw from '../tailwind';
import { useNavigation } from '@react-navigation/native';
import { request, PERMISSIONS, RESULTS, check } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocationPermission = () => {
  const navigation = useNavigation();

  const requestLocationPermission = async () => {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const result = await request(permission);

      // Mark that we've asked for permission
      await AsyncStorage.setItem('location_permission_asked', 'true');

      if (result === RESULTS.GRANTED) {
        Toast.show({
          type: 'success',
          text1: 'Location Enabled',
          text2: 'You can now use all features of the app'
        });
        // Navigate to main app
        navigation.navigate('MainTabs');
      } else if (result === RESULTS.DENIED) {
        Toast.show({
          type: 'error',
          text1: 'Location Permission Denied',
          text2: 'Some features may not work properly'
        });
        // Still allow them to continue
        navigation.navigate('MainTabs');
      } else if (result === RESULTS.BLOCKED) {
        Toast.show({
          type: 'info',
          text1: 'Location Blocked',
          text2: 'Please enable location in Settings'
        });
        // Still allow them to continue
        navigation.navigate('MainTabs');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to request location permission'
      });
    }
  };

  const skipForNow = async () => {
    // Mark that we've asked for permission (user chose to skip)
    await AsyncStorage.setItem('location_permission_asked', 'true');
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 justify-between px-6 py-12`}>
        
        {/* Content Container */}
        <View style={tw`flex-1 justify-center items-center`}>
          
          {/* Location Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.outerRing}>
              <View style={styles.middleRing}>
                <View style={styles.innerCircle}>
                  <Ionicons name="location" size={48} color="white" />
                </View>
              </View>
            </View>
          </View>

          {/* Title */}
          <Text style={[tw`text-3xl font-bold text-gray-800 mt-8 mb-4 text-center`, {fontFamily: 'Poppins-Bold'}]}>
            Enable your location
          </Text>

          {/* Description */}
          <Text style={[tw`text-base text-gray-500 text-center px-8`, {fontFamily: 'Poppins-Regular'}]}>
            Choose your location to start find the request around you
          </Text>
        </View>

        {/* Buttons Container */}
        <View style={tw`w-full`}>
          {/* Use My Location Button */}
          <TouchableOpacity
            onPress={requestLocationPermission}
            style={tw`bg-blue-800 rounded-lg py-4 items-center justify-center mb-4`}
          >
            <Text style={[tw`text-white text-base font-bold`, {fontFamily: 'Poppins-Bold'}]}>
              Use my location
            </Text>
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity
            onPress={skipForNow}
            style={tw`items-center py-2`}
          >
            <Text style={[tw`text-gray-500 text-base`, {fontFamily: 'Poppins-Regular'}]}>
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LocationPermission;

