import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import tw from '../../tailwind';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';
import { RentalCar } from '../../constants/Data';
import Toast from 'react-native-toast-message';
import { auth, db } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import MasterCardIcon from '../../assets/mastercard.svg';

interface BookingSummaryParams {
  car: RentalCar;
  rentType: 'self' | 'driver';
  pickupDate: Date;
  returnDate: Date;
  documentUrl?: string;
  idType?: string;
}

const BookingSummaryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { car, rentType, pickupDate, returnDate, documentUrl, idType } = route.params as BookingSummaryParams;

  const [isProcessing, setIsProcessing] = useState(false);

  // Mock payment data
  const mockCard = {
    type: 'mastercard',
    last4: '23456',
    expiry: '03/08'
  };

  // Calculate booking details
  const diffMs = returnDate.getTime() - pickupDate.getTime();
  const totalHours = Math.ceil(diffMs / (1000 * 60 * 60));
  const basePrice = parseFloat(car.pricePerHour.replace(/,/g, ''));
  const driverCost = rentType === 'driver' ? 20 : 0;
  const hourlyRate = basePrice + driverCost;
  const totalCost = hourlyRate * totalHours;

  // Format dates
  const formatBookingDate = (date: Date) => {
    return format(date, 'dd MMMM, yyyy | hh:mma');
  };

  // Get class badge colors
  const getClassBadge = (carClass: string) => {
    const badges: any = {
      'Premium': { bg: '#DBEAFE', text: '#1E3A8A' },
      'Economy': { bg: '#D1FAE5', text: '#059669' },
      'Luxury': { bg: '#FEF3C7', text: '#D97706' }
    };
    return badges[carClass] || badges['Premium'];
  };

  const classBadge = getClassBadge(car.carClass);

  const handleChangePayment = () => {
    navigation.navigate('ChoosePaymentMethod');
  };

  const handleContinue = async () => {
    try {
      setIsProcessing(true);
      const user = auth.currentUser;

      if (!user) {
        Toast.show({
          type: 'error',
          text1: 'Not Authenticated',
          text2: 'Please log in to continue'
        });
        setIsProcessing(false);
        return;
      }

      // Create booking in Firestore
      const bookingData: any = {
        userId: user.uid,
        carId: car.id,
        carName: car.name,
        carYear: car.year,
        carClass: car.carClass,
        rentType: rentType,
        pickupDate: pickupDate.toISOString(),
        returnDate: returnDate.toISOString(),
        totalHours: totalHours,
        pricePerHour: basePrice,
        driverCostPerHour: driverCost,
        totalCost: totalCost,
        paymentMethod: {
          type: mockCard.type,
          last4: mockCard.last4
        },
        status: 'confirmed',
        createdAt: serverTimestamp()
      };

      // Add document URL and ID type for self-drive bookings
      if (rentType === 'self' && documentUrl && idType) {
        bookingData.documentUrl = documentUrl;
        bookingData.idType = idType;
      }

      await addDoc(collection(db, 'rentalBookings'), bookingData);

      setIsProcessing(false);

      Toast.show({
        type: 'success',
        text1: 'Booking Confirmed!',
        text2: `Your ${car.name} is reserved for ${totalHours} hours`
      });

      // Navigate back to rental listing
      setTimeout(() => {
        navigation.navigate('MainTabs', { screen: 'Rental' });
      }, 1500);

    } catch (error) {
      console.error('Error creating booking:', error);
      setIsProcessing(false);
      Toast.show({
        type: 'error',
        text1: 'Booking Failed',
        text2: 'Failed to create booking. Please try again.'
      });
    }
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
            Booking Summary
          </Text>
        </View>
      </View>

      <ScrollView 
        style={tw`flex-1`}
        contentContainerStyle={tw`px-6 pb-6`}
        showsVerticalScrollIndicator={false}
      >
        {/* Car Information Card */}
        <View style={tw`flex-row mb-6`}>
          {/* Car Image */}
          <Image 
            source={car.image}
            style={styles.carImage}
            resizeMode="contain"
          />
          
          {/* Car Details */}
          <View style={tw`flex-1 ml-4 justify-center`}>
            {/* Class Badge */}
            <View style={[styles.badge, { backgroundColor: classBadge.bg }]}>
              <Text style={[tw`text-xs font-bold uppercase`, { color: classBadge.text, fontFamily: 'Poppins-Bold' }]}>
                {car.carClass}
              </Text>
            </View>
            
            {/* Car Name */}
            <Text style={[tw`text-lg text-gray-800 mt-2`, { fontFamily: 'Poppins-Bold' }]}>
              {car.name} {car.year}
            </Text>
            
            {/* Price */}
            <Text style={[tw`text-sm text-gray-600 mt-1`, { fontFamily: 'Poppins-Regular' }]}>
              N{car.pricePerHour}/hr
            </Text>
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Booking Details */}
        <View style={tw`mb-4`}>
          {/* Pick Up Date & Time */}
          <View style={styles.detailRow}>
            <Text style={[tw`text-sm text-gray-800`, { fontFamily: 'Poppins-Regular' }]}>
              Pick Up Date & Time
            </Text>
            <Text style={[tw`text-sm text-gray-800 text-right flex-1 ml-4`, { fontFamily: 'Poppins-Regular' }]}>
              {formatBookingDate(pickupDate)}
            </Text>
          </View>

          {/* Return Date & Time */}
          <View style={styles.detailRow}>
            <Text style={[tw`text-sm text-gray-800`, { fontFamily: 'Poppins-Regular' }]}>
              Return Date & Time
            </Text>
            <Text style={[tw`text-sm text-gray-800 text-right flex-1 ml-4`, { fontFamily: 'Poppins-Regular' }]}>
              {formatBookingDate(returnDate)}
            </Text>
          </View>

          {/* Rent Type */}
          <View style={styles.detailRow}>
            <Text style={[tw`text-sm text-gray-800`, { fontFamily: 'Poppins-Regular' }]}>
              Rent Type
            </Text>
            <Text style={[tw`text-sm text-gray-800`, { fontFamily: 'Poppins-Regular' }]}>
              {rentType === 'self' ? 'Self Drive' : 'With Driver'}
            </Text>
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Cost Summary */}
        <View style={tw`mb-4`}>
          {/* Amount */}
          <View style={styles.detailRow}>
            <Text style={[tw`text-sm text-gray-800`, { fontFamily: 'Poppins-Regular' }]}>
              Amount
            </Text>
            <Text style={[tw`text-sm text-gray-800`, { fontFamily: 'Poppins-Regular' }]}>
              N{hourlyRate.toLocaleString()}/hr
            </Text>
          </View>

          {/* Total Hours */}
          <View style={styles.detailRow}>
            <Text style={[tw`text-sm text-gray-800`, { fontFamily: 'Poppins-Regular' }]}>
              Total Hours
            </Text>
            <Text style={[tw`text-sm text-gray-800`, { fontFamily: 'Poppins-Regular' }]}>
              {totalHours}
            </Text>
          </View>

          {/* Total */}
          <View style={styles.detailRow}>
            <Text style={[tw`text-sm text-gray-800`, { fontFamily: 'Poppins-Bold' }]}>
              Total
            </Text>
            <Text style={[tw`text-base text-gray-800`, { fontFamily: 'Poppins-Bold' }]}>
              N{totalCost.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Payment Method */}
        <View style={tw`mb-6`}>
          <View style={tw`flex-row items-center`}>
            {/* MasterCard Logo */}
            <MasterCardIcon width={32} height={24} />
            
            {/* Card Details */}
            <View style={tw`flex-1 ml-3`}>
              <Text style={[tw`text-base text-gray-800`, { fontFamily: 'Poppins-Bold' }]}>
                ****{mockCard.last4}
              </Text>
              <Text style={[tw`text-xs text-gray-600 mt-1`, { fontFamily: 'Poppins-Regular' }]}>
                Expires {mockCard.expiry}
              </Text>
            </View>
            
            {/* Change Button */}
            <TouchableOpacity onPress={handleChangePayment}>
              <Text style={[tw`text-sm text-blue-600`, { fontFamily: 'Poppins-Bold' }]}>
                Change
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue Button */}
        <View style={tw`mt-4`}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              isProcessing && tw`opacity-50`
            ]}
            onPress={handleContinue}
            disabled={isProcessing}
          >
            <Text style={[tw`text-base text-white`, { fontFamily: 'Poppins-Bold' }]}>
              {isProcessing ? 'Processing...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  carImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  continueButton: {
    height: 52,
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BookingSummaryScreen;

