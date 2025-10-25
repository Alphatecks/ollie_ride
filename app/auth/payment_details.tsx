import React, { useState } from 'react';
import { Text as RNText, View as RNView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from '../../tailwind';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const PaymentDetails = () => {
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigation = useNavigation();
  const route = useRoute();

  // Get user data from previous screens
  const email = route.params?.email;
  const phoneNumber = route.params?.phoneNumber;
  const fullName = route.params?.full_name;
  const password = route.params?.password;
  const otp = route.params?.otp;

  const allFilled = bankName && accountName && accountNumber;

  const handleContinue = () => {
    if (!bankName || !accountName || !accountNumber) {
      Toast.show({
        type: "error",
        text1: "All fields are required!"
      });
      return;
    }

    // Validate account number is numeric
    if (!/^\d+$/.test(accountNumber)) {
      Toast.show({
        type: "error",
        text1: "Account number must contain only digits!"
      });
      return;
    }

    console.log("Payment Details:", { bankName, accountName, accountNumber });
    
    Toast.show({
      type: "success",
      text1: "Payment details saved successfully!"
    });

    // Navigate to next screen or complete registration
    navigation.navigate('UploadCarDetails', {
      email,
      phoneNumber,
      full_name: fullName,
      password,
      otp,
      bankName,
      accountName,
      accountNumber
    });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw`flex-1`}
      >
        {/* Header */}
        <RNView style={tw`flex-row items-center px-6 py-4`}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={tw`mr-4`}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <RNView style={tw`flex-1 items-center`}>
            <RNText style={[tw`text-lg text-black`, { fontFamily: "Poppins-Bold" }]}>
              Payment Details
            </RNText>
          </RNView>
        </RNView>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`flex-grow px-6 py-8`}
          style={tw`flex-1`}
        >
          {/* Input Fields Container */}
          <RNView style={tw`flex-1 justify-center`}>
            {/* Bank Name Field */}
            <RNView style={tw`mb-4`}>
              <TextInput
                placeholder="Bank name"
                value={bankName}
                onChangeText={setBankName}
                style={[
                  tw`bg-gray-100 rounded-lg px-4 py-4 text-base text-gray-900`,
                  { fontFamily: "Poppins-Regular" }
                ]}
                placeholderTextColor="#9CA3AF"
              />
            </RNView>

            {/* Bank Account Name Field */}
            <RNView style={tw`mb-4`}>
              <TextInput
                placeholder="Bank account name"
                value={accountName}
                onChangeText={setAccountName}
                style={[
                  tw`bg-gray-100 rounded-lg px-4 py-4 text-base text-gray-900`,
                  { fontFamily: "Poppins-Regular" }
                ]}
                placeholderTextColor="#9CA3AF"
              />
            </RNView>

            {/* Bank Account Number Field */}
            <RNView style={tw`mb-4`}>
              <TextInput
                placeholder="Bank account number"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
                style={[
                  tw`bg-gray-100 rounded-lg px-4 py-4 text-base text-gray-900`,
                  { fontFamily: "Poppins-Regular" }
                ]}
                placeholderTextColor="#9CA3AF"
              />
            </RNView>
          </RNView>
        </ScrollView>

        {/* Continue Button */}
        <RNView style={tw`px-6 pb-6`}>
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!allFilled || loading}
            style={[
              tw`rounded-lg py-4 items-center justify-center`,
              { backgroundColor: !allFilled || loading ? '#D1D5DB' : '#0C3569' }
            ]}
          >
            <RNText style={[tw`text-white text-base`, { fontFamily: "Poppins-Bold" }]}>
              Continue
            </RNText>
          </TouchableOpacity>
        </RNView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PaymentDetails;

