import { View, Text, Button } from 'react-native-ui-lib';
import { useEffect, useCallback } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { useAuthStore, initAuthListener } from "../store/authStore";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Welcome from "../assets/welcome.svg";
import tw from "../tailwind";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

const Index = () => {
  const navigation = useNavigation();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    initAuthListener(); // Initialize Firebase auth listener
  }, []);

  useEffect(() => {
    const checkOnboardingAndAuth = async () => {
      try {
        const onboardingSeen = await AsyncStorage.getItem('onboarding_seen');
        
        console.log('🔍 Navigation Check:', {
          user: user ? 'Logged in' : 'Not logged in',
          onboardingSeen: onboardingSeen ? 'Yes' : 'No',
          loading
        });

        // If user is logged in (Firebase auth persists automatically)
        if (user) {
          console.log('✅ User is logged in, checking location permission...');
          // Check location permission before navigating to main app
          const permission = Platform.OS === 'ios' 
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
          
          const result = await check(permission);
          const locationPermissionAsked = await AsyncStorage.getItem('location_permission_asked');
          
          console.log('📍 Location permission status:', result, 'Asked before:', locationPermissionAsked);
          
          if (result === RESULTS.GRANTED) {
            // Location permission granted, go to main app
            console.log('➡️  Navigating to MainTabs (permission granted)');
            navigation.navigate('MainTabs');
          } else if (!locationPermissionAsked) {
            // Never asked for permission, show location permission screen
            console.log('➡️  Navigating to LocationPermission (never asked)');
            navigation.navigate('LocationPermission');
          } else {
            // Permission was asked but denied/blocked, go to main app anyway
            console.log('➡️  Navigating to MainTabs (permission denied/blocked)');
            navigation.navigate('MainTabs');
          }
          return;
        }

        // User is NOT logged in
        if (!onboardingSeen) {
          // User hasn't seen onboarding, navigate to it
          console.log('➡️  Navigating to Onboarding (first time)');
          navigation.navigate('Onboarding');
          return;
        }

        // User has seen onboarding but not logged in, stay on Index (login buttons)
        console.log('➡️  Staying on Index (login screen)');
        return;
      } catch (error) {
        console.error("Error checking onboarding/auth:", error);
        // On error, stay on Index screen
        return;
      }
    };

    if (!loading) {
      checkOnboardingAndAuth();
    }
  }, [user, loading]);

  useFocusEffect(
    useCallback(() => {
      async function requestLocationPermission() {
        // Location permission will be handled by react-native-permissions
        console.log('Location permission request - implement with react-native-permissions');
      }
      requestLocationPermission();
    }, [])
  );

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white px-6 py-10 justify-between`}>
      <View style={tw`gap-y-8`}>
        <Welcome width={356} />
        <View>
          <Text h2 poppinsMedium center>Welcome</Text>
          <Text poppinsLight center>Have a better riding experience</Text>
        </View>
      </View>
      <View style={tw`gap-y-3`}>
        <Button 
          label="Create An Account" 
          style={tw`btn`} 
          poppins 
          onPress={() => navigation.navigate('Auth', { screen: 'SignUp' })}
        />
        <Button 
          label="Sign In" 
          style={tw`outline rounded-md`} 
          labelStyle={tw`text-blue-800`} 
          poppins 
          outline 
          onPress={() => navigation.navigate('Auth', { screen: 'SignIn' })}
        />
      </View>
    </SafeAreaView>
  );
};

export default Index;
