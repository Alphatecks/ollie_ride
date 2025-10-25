import { View, Text, Button } from 'react-native-ui-lib';
import { useEffect, useCallback } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { useAuthStore, initAuthListener } from "../store/authStore";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Welcome from "../assets/welcome.svg";
import tw from "../tailwind";
import {ActivityIndicator} from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';

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

        if (!onboardingSeen) {
          navigation.navigate('Onboarding');
          return;
        }

        if (!user) {
          return;
        }

        // If user is authenticated, check Firebase for approval
        const docRef = doc(db, "drivers", user.uid);
        const docSnapShot = await getDoc(docRef);

        if (docSnapShot.exists()) {
          const userData = docSnapShot.data();
          if (userData.isApproved) {
            navigation.navigate('MainTabs');
            return;
          }
        }
      } catch (error) {
        console.error("Error checking onboarding/auth:", error);
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
          <Text poppinsLight center>Have a better driving experience</Text>
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
