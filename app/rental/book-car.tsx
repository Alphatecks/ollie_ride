import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import tw from '../../tailwind';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { RentalCar } from '../../constants/Data';
import Toast from 'react-native-toast-message';

interface BookCarParams {
  car: RentalCar;
}

const BookCarScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { car } = route.params as BookCarParams;

  const [rentType, setRentType] = useState<'self' | 'driver'>('self');
  const [pickupDate, setPickupDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showPickupDatePicker, setShowPickupDatePicker] = useState(false);
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
  const [showReturnTimePicker, setShowReturnTimePicker] = useState(false);

  const handlePickupDateChange = (event: any, selectedDate?: Date) => {
    setShowPickupDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setPickupDate(selectedDate);
    }
  };

  const handlePickupTimeChange = (event: any, selectedDate?: Date) => {
    setShowPickupTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setPickupDate(selectedDate);
    }
  };

  const handleReturnDateChange = (event: any, selectedDate?: Date) => {
    setShowReturnDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setReturnDate(selectedDate);
    }
  };

  const handleReturnTimeChange = (event: any, selectedDate?: Date) => {
    setShowReturnTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setReturnDate(selectedDate);
    }
  };

  const validateBooking = () => {
    if (returnDate <= pickupDate) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Dates',
        text2: 'Return date/time must be after pickup date/time'
      });
      return false;
    }

    const diffMs = returnDate.getTime() - pickupDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      Toast.show({
        type: 'error',
        text1: 'Minimum Rental',
        text2: 'Minimum rental period is 1 hour'
      });
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (!validateBooking()) return;

    // If Self Drive, navigate to requirement screen
    if (rentType === 'self') {
      navigation.navigate('SelfDriveRequirement', {
        car,
        rentType,
        pickupDate,
        returnDate
      });
      return;
    }

    // With Driver - navigate to booking summary
    navigation.navigate('BookingSummary', {
      car,
      rentType: 'driver',
      pickupDate,
      returnDate
    });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`px-6 py-4 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={tw`absolute left-0 right-0 items-center`}>
          <Text style={[tw`text-lg text-gray-800`, { fontFamily: 'Poppins-Bold' }]}>
            Book Car
          </Text>
        </View>
      </View>

      <ScrollView 
        style={tw`flex-1`}
        contentContainerStyle={tw`pb-6`}
        showsVerticalScrollIndicator={false}
      >
        {/* Car Image */}
        <View style={tw`px-6 mb-4`}>
          <Image 
            source={car.image}
            style={styles.carImage}
            resizeMode="contain"
          />
        </View>

        {/* Car Name */}
        <View style={tw`px-6 mb-4`}>
          <Text style={[tw`text-xl text-gray-800`, { fontFamily: 'Poppins-Bold' }]}>
            {car.name} {car.year}
          </Text>
        </View>

        {/* Separator */}
        <View style={tw`mx-6 mb-6 border-b border-gray-200`} />

        {/* Rent Type Selection */}
        <View style={tw`px-6 mb-6`}>
          <Text style={[tw`text-base text-gray-800 mb-3`, { fontFamily: 'Poppins-Bold' }]}>
            Rent type
          </Text>
          <View style={tw`flex-row`}>
            <TouchableOpacity
              style={[
                styles.rentTypeButton,
                rentType === 'self' ? styles.rentTypeButtonSelected : styles.rentTypeButtonUnselected
              ]}
              onPress={() => setRentType('self')}
            >
              <Text style={[
                tw`text-base`,
                rentType === 'self' ? tw`text-white` : tw`text-blue-800`,
                { fontFamily: 'Poppins-Bold' }
              ]}>
                Self Drive
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.rentTypeButton,
                tw`ml-3`,
                rentType === 'driver' ? styles.rentTypeButtonSelected : styles.rentTypeButtonUnselected
              ]}
              onPress={() => setRentType('driver')}
            >
              <Text style={[
                tw`text-base`,
                rentType === 'driver' ? tw`text-white` : tw`text-blue-800`,
                { fontFamily: 'Poppins-Bold' }
              ]}>
                With Driver
              </Text>
              {rentType === 'driver' && (
                <Ionicons name="person-outline" size={18} color="white" style={tw`ml-2`} />
              )}
              {rentType !== 'driver' && (
                <Ionicons name="person-outline" size={18} color="#1E3A8A" style={tw`ml-2`} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Driver Cost Info Banner */}
        {rentType === 'driver' && (
          <View style={tw`px-6 mb-6`}>
            <View style={[tw`flex-row items-center p-3 rounded-lg`, styles.infoBanner]}>
              <View style={styles.infoIcon}>
                <Ionicons name="information" size={16} color="white" />
              </View>
              <Text style={[tw`flex-1 ml-3 text-sm text-gray-700`, { fontFamily: 'Poppins-Regular' }]}>
                Additional $20/hr Driver cost will be added if you choose with driver option
              </Text>
            </View>
          </View>
        )}

        {/* Pick Up Date & Time */}
        <View style={tw`px-6 mb-6`}>
          <Text style={[tw`text-base text-gray-800 mb-3`, { fontFamily: 'Poppins-Bold' }]}>
            Pick Up Date & Time
          </Text>
          <View style={tw`flex-row`}>
            {/* Date Field */}
            <TouchableOpacity 
              style={[styles.dateTimeField, tw`flex-1 mr-2`]}
              onPress={() => setShowPickupDatePicker(true)}
            >
              <Text style={[tw`text-xs text-gray-600 mb-1`, { fontFamily: 'Poppins-Regular' }]}>
                Date
              </Text>
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={[tw`text-base text-gray-800`, { fontFamily: 'Poppins-Bold' }]}>
                  {format(pickupDate, 'dd MMM')}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>

            {/* Time Field */}
            <TouchableOpacity 
              style={[styles.dateTimeField, tw`flex-1 ml-2`]}
              onPress={() => setShowPickupTimePicker(true)}
            >
              <Text style={[tw`text-xs text-gray-600 mb-1`, { fontFamily: 'Poppins-Regular' }]}>
                Time
              </Text>
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={[tw`text-base text-gray-800`, { fontFamily: 'Poppins-Bold' }]}>
                  {format(pickupDate, 'hh:mma')}
                </Text>
                <Ionicons name="time-outline" size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Return Date & Time */}
        <View style={tw`px-6 mb-6`}>
          <Text style={[tw`text-base text-gray-800 mb-3`, { fontFamily: 'Poppins-Bold' }]}>
            Return Date & Time
          </Text>
          <View style={tw`flex-row`}>
            {/* Date Field */}
            <TouchableOpacity 
              style={[styles.dateTimeField, tw`flex-1 mr-2`]}
              onPress={() => setShowReturnDatePicker(true)}
            >
              <Text style={[tw`text-xs text-gray-600 mb-1`, { fontFamily: 'Poppins-Regular' }]}>
                Date
              </Text>
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={[tw`text-base text-gray-800`, { fontFamily: 'Poppins-Bold' }]}>
                  {format(returnDate, 'dd MMM')}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>

            {/* Time Field */}
            <TouchableOpacity 
              style={[styles.dateTimeField, tw`flex-1 ml-2`]}
              onPress={() => setShowReturnTimePicker(true)}
            >
              <Text style={[tw`text-xs text-gray-600 mb-1`, { fontFamily: 'Poppins-Regular' }]}>
                Time
              </Text>
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={[tw`text-base text-gray-800`, { fontFamily: 'Poppins-Bold' }]}>
                  {format(returnDate, 'hh:mma')}
                </Text>
                <Ionicons name="time-outline" size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue Button */}
        <View style={tw`px-6 mt-4`}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={[tw`text-base text-white`, { fontFamily: 'Poppins-Bold' }]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date/Time Pickers */}
      {showPickupDatePicker && (
        <DateTimePicker
          value={pickupDate}
          mode="date"
          display="default"
          onChange={handlePickupDateChange}
          minimumDate={new Date()}
        />
      )}

      {showPickupTimePicker && (
        <DateTimePicker
          value={pickupDate}
          mode="time"
          display="default"
          onChange={handlePickupTimeChange}
        />
      )}

      {showReturnDatePicker && (
        <DateTimePicker
          value={returnDate}
          mode="date"
          display="default"
          onChange={handleReturnDateChange}
          minimumDate={pickupDate}
        />
      )}

      {showReturnTimePicker && (
        <DateTimePicker
          value={returnDate}
          mode="time"
          display="default"
          onChange={handleReturnTimeChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  carImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  rentTypeButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rentTypeButtonSelected: {
    backgroundColor: '#1E3A8A',
  },
  rentTypeButtonUnselected: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#1E3A8A',
  },
  infoBanner: {
    backgroundColor: '#E0F2FE',
  },
  infoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTimeField: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  continueButton: {
    height: 52,
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BookCarScreen;

