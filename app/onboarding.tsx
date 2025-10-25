import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { View, Text, Typography, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import * as Progress from 'react-native-progress'; // For circular progress bar
import tw from "../tailwind"

import Onboarding1 from "../assets/01.svg"
import Onboarding2 from "../assets/02.svg"
import Onboarding3 from "../assets/03.svg"
import AntDesign from 'react-native-vector-icons/AntDesign';

import AsyncStorage from '@react-native-async-storage/async-storage';



const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const [isOnboardingDone, setIsOnboardingDone] = useState(false);


  const handleFinishOnboarding = async () => {
    await AsyncStorage.setItem('onboarding_seen', 'true');
    navigation.navigate('Auth'); // Navigate to auth after finishing onboarding
  };
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const onboardingSeen = await AsyncStorage.getItem('onboarding_seen');
      if (onboardingSeen) {
        navigation.navigate('Auth'); // If already seen, skip onboarding
      }
    };
  
    checkOnboardingStatus();
  }, []);


  const onboardingData = [
    {
      id: '1',
      title: 'Anywhere You Are',
      subtitle: 'We provide you with seamless ride-sharing service regardless of your location. Join and travel hassel free',
      SvgComponent: Onboarding1, // Changed to component reference instead of JSX element
    },
    {
      id: '2',
      title: 'Group Rides',
      subtitle: 'Experience the convinence of group rides anywhere you are, with friends, family, or teammates',
      SvgComponent: Onboarding2, // Changed to component reference instead of JSX element
    },
    {
      id: '3',
      title: 'Schedule A Ride',
      subtitle: 'Simplify your commute, plan your rides effortlessly. Your ride, your way, anytime, anywhere',
      SvgComponent: Onboarding3, // Changed to component reference instead of JSX element
    },
  ];

  const handleScroll = event => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
    if (index == 2) setIsOnboardingDone(true)
  };

  const handleSkip = () => {
    // navigation.navigate('Auth');
    console.log('Clicked!!');
  };

  const renderItem = ({ item }) => {
    const { SvgComponent } = item;
    
    return (
      <View style={[tw`flex-1 justify-center items-center`, styles.slide]}>
        {SvgComponent && <SvgComponent />}
        <View style={tw`w-3/4 my-8`}>
          <Text 
            style={[Typography.h2, Typography.center, Typography.poppinsBold]}
          >
            {item.title}
          </Text>
          <Text style={[styles.subtitle, Typography.poppins]}>
            {item.subtitle}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[tw`flex-1 justify-center items-center`, styles.container]}>
      <TouchableOpacity 
        style={[tw`absolute top-12 right-5 z-10`, styles.skipButton]} 
        onPress={handleFinishOnboarding}
      >
        <Text style={[tw`text-ollie-base poppinsMedium`]}>Skip</Text>
      </TouchableOpacity>
      
      <FlatList
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        ref={flatListRef}
        keyExtractor={item => item.id}
      />
      
      <View style={[tw`absolute bottom-10`, styles.progressContainer]}>
        <View>
          {isOnboardingDone && 
            <TouchableOpacity onPress={handleFinishOnboarding} style={tw`p-6 bg-ollie-base rounded-full flex items-center justify-center`}>
              <Text style={tw`text-center text-white poppinsMedium`}>Go</Text>
            </TouchableOpacity>
          
          }
          {!isOnboardingDone && 
            <Progress.Circle
              size={60}
              progress={(currentIndex + 1) / onboardingData.length}
              showsText={false}
              thickness={4}
              color={Colors.primaryColor}
              borderWidth={2}
            />
          }

        </View>
      </View>
    </View>
  );
}

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    color: 'blue',
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 40,
  },
});