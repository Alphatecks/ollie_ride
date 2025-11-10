import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import tw from '../../tailwind';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RentalCar } from '../../constants/Data';

interface CarDetailParams {
  car: RentalCar;
}

const CarDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { car } = route.params as CarDetailParams;

  const handleCall = () => {
    const phoneNumber = car.rentPartner.phone.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleMessage = () => {
    // Navigate to chat or messaging screen
    console.log('Open messaging for:', car.rentPartner.name);
  };

  const handleBookNow = () => {
    navigation.navigate('BookCar', { car });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`px-6 py-4`}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={tw`mb-3`}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={[tw`text-2xl text-gray-800`, { fontFamily: 'Poppins-Bold' }]}>
          {car.name} {car.year}
        </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={tw`flex-1`}
        contentContainerStyle={tw`pb-24`}
        showsVerticalScrollIndicator={false}
      >
        {/* Car Image */}
        <View style={tw`px-6 mb-6`}>
          <Image 
            source={car.image}
            style={styles.carImage}
            resizeMode="contain"
          />
        </View>

        {/* Key Specifications Card */}
        <View style={tw`px-6 mb-6`}>
          <View style={[tw`rounded-xl p-4`, styles.specsCard]}>
            <View style={tw`flex-row justify-between`}>
              {/* Max Speed */}
              <View style={tw`flex-1 items-center`}>
                <MaterialCommunityIcons name="speedometer" size={24} color="#6B7280" />
                <Text style={[tw`text-xs text-gray-600 mt-2`, { fontFamily: 'Poppins-Regular' }]}>
                  Max speed
                </Text>
                <Text style={[tw`text-base text-gray-800 font-bold mt-1`, { fontFamily: 'Poppins-Bold' }]}>
                  {car.maxSpeed}
                </Text>
              </View>

              {/* Engine Type */}
              <View style={tw`flex-1 items-center border-l border-r border-gray-300`}>
                <MaterialCommunityIcons name="engine" size={24} color="#6B7280" />
                <Text style={[tw`text-xs text-gray-600 mt-2`, { fontFamily: 'Poppins-Regular' }]}>
                  Engine type
                </Text>
                <Text style={[tw`text-base text-gray-800 font-bold mt-1`, { fontFamily: 'Poppins-Bold' }]}>
                  {car.engineType}
                </Text>
              </View>

              {/* Passengers */}
              <View style={tw`flex-1 items-center`}>
                <Ionicons name="people" size={24} color="#6B7280" />
                <Text style={[tw`text-xs text-gray-600 mt-2`, { fontFamily: 'Poppins-Regular' }]}>
                  No. of Passengers
                </Text>
                <Text style={[tw`text-base text-gray-800 font-bold mt-1`, { fontFamily: 'Poppins-Bold' }]}>
                  {car.passengers}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Car Description */}
        <View style={tw`px-6 mb-6`}>
          <Text style={[tw`text-lg text-gray-800 mb-2`, { fontFamily: 'Poppins-Bold' }]}>
            Car Description
          </Text>
          <Text style={[tw`text-sm text-gray-700 leading-6`, { fontFamily: 'Poppins-Regular' }]}>
            {car.description}
          </Text>
        </View>

        {/* Car Class */}
        <View style={tw`px-6 mb-6`}>
          <Text style={[tw`text-lg text-gray-800 mb-2`, { fontFamily: 'Poppins-Bold' }]}>
            Car Class
          </Text>
          <Text style={[tw`text-sm text-gray-700`, { fontFamily: 'Poppins-Regular' }]}>
            {car.carClass}
          </Text>
        </View>

        {/* Location */}
        <View style={tw`px-6 mb-6`}>
          <Text style={[tw`text-lg text-gray-800 mb-2`, { fontFamily: 'Poppins-Bold' }]}>
            Location
          </Text>
          <Text style={[tw`text-sm text-gray-700`, { fontFamily: 'Poppins-Regular' }]}>
            {car.location}
          </Text>
        </View>

        {/* Rent Partner */}
        <View style={tw`px-6 mb-6`}>
          <Text style={[tw`text-lg text-gray-800 mb-3`, { fontFamily: 'Poppins-Bold' }]}>
            Rent Partner
          </Text>
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center flex-1`}>
              {/* Avatar */}
              <Image 
                source={car.rentPartner.avatar}
                style={styles.avatar}
              />
              {/* Name and Role */}
              <View style={tw`ml-3`}>
                <Text style={[tw`text-base text-gray-800`, { fontFamily: 'Poppins-Bold' }]}>
                  {car.rentPartner.name}
                </Text>
                <Text style={[tw`text-sm text-gray-600`, { fontFamily: 'Poppins-Regular' }]}>
                  Owner
                </Text>
              </View>
            </View>
            {/* Action Buttons */}
            <View style={tw`flex-row`}>
              <TouchableOpacity 
                style={[tw`rounded-full items-center justify-center mr-3`, styles.actionButton]}
                onPress={handleCall}
              >
                <Ionicons name="call" size={20} color="#1E3A8A" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[tw`rounded-full items-center justify-center`, styles.actionButton]}
                onPress={handleMessage}
              >
                <Ionicons name="chatbubble" size={20} color="#1E3A8A" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={[tw`px-6 py-4`, styles.bottomBar]}>
        <View style={tw`flex-row items-center justify-between`}>
          {/* Price */}
          <View>
            <Text style={[tw`text-xs text-gray-600`, { fontFamily: 'Poppins-Regular' }]}>
              Price
            </Text>
            <Text style={[tw`text-xl text-gray-800`, { fontFamily: 'Poppins-Bold' }]}>
              {car.pricePerHour}/hr
            </Text>
          </View>
          {/* Book Now Button */}
          <TouchableOpacity 
            style={[tw`rounded-lg px-8 py-3`, styles.bookButton]}
            onPress={handleBookNow}
          >
            <Text style={[tw`text-base text-white`, { fontFamily: 'Poppins-Bold' }]}>
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  carImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  specsCard: {
    backgroundColor: '#E0F2FE',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  actionButton: {
    width: 40,
    height: 40,
    backgroundColor: '#E0F2FE',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  bookButton: {
    backgroundColor: '#1E3A8A',
  },
});

export default CarDetailScreen;

