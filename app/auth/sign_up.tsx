import React, { useState } from 'react'
import { View, Text, TextInput, Button, Colors, Checkbox, TouchableOpacity, Modal, Image } from 'react-native-ui-lib'
import { KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Dimensions, TextInput as RNTextInput } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const GmailIcon = require('../../assets/images/gmail.png');
const FacebookIcon = require('../../assets/images/facebook.png');

import tw from "../../tailwind"
import { useNavigation } from '@react-navigation/native'

import Toast from 'react-native-toast-message'
import ButtonLoader from '../../components/general/ButtonLoader'
import { db } from "../../firebaseConfig"
import { collection, query, where, getDocs } from "firebase/firestore"



const SignUp = () => {

    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [skipValidation, setSkipValidation] = useState(false); // Dev mode flag

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [error, setError] = useState('')
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [toggle, setToggle] = useState<boolean>(false)
    
    // Country code and gender picker states
    const [selectedCountryCode, setSelectedCountryCode] = useState('+880')
    const [showCountryPicker, setShowCountryPicker] = useState(false)
    const [showGenderPicker, setShowGenderPicker] = useState(false)

    // Country codes data
    const countryCodes = [
        { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
        { code: '+1', country: 'United States', flag: '🇺🇸' },
        { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
        { code: '+91', country: 'India', flag: '🇮🇳' },
        { code: '+86', country: 'China', flag: '🇨🇳' },
        { code: '+81', country: 'Japan', flag: '🇯🇵' },
        { code: '+49', country: 'Germany', flag: '🇩🇪' },
        { code: '+33', country: 'France', flag: '🇫🇷' },
        { code: '+61', country: 'Australia', flag: '🇦🇺' },
        { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    ]

    // Gender options
    const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say']

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignUp = async () => {
        if (!email || !phoneNumber || !selectedGender || !name) {
          Toast.show({
            type: "error",
            text1: "All fields are required!",
          });
          return;
        }

        // Validate email format
        if (!validateEmail(email)) {
          Toast.show({
            type: "error",
            text1: "Invalid email format!",
          });
          return;
        }

        // Validate phone number (should not be empty and should be digits)
        const fullPhone = selectedCountryCode + phoneNumber;
        if (phoneNumber.length < 8) {
          Toast.show({
            type: "error",
            text1: "Phone number is too short!",
          });
          return;
        }

        if (!toggle) {
          Toast.show({
            type: "error",
            text1: "Please accept the Terms of service and Privacy policy",
          });
          return;
        }

        try {
          setLoading(true);

          // Skip validation if network is too slow (dev mode)
          if (!skipValidation) {
            // Timeout wrapper to prevent hanging
            const checkWithTimeout = Promise.race([
              (async () => {
                // Check if email already exists in Firestore
                const usersRef = collection(db, "users");
                const emailQuery = query(usersRef, where("email", "==", email));
                const emailSnapshot = await getDocs(emailQuery);

                if (!emailSnapshot.empty) {
                  Toast.show({
                    type: "error",
                    text1: "Email already exists!",
                    text2: "Please sign in instead"
                  });
                  setLoading(false);
                  return;
                }

                // Check if phone number already exists
                const phoneQuery = query(usersRef, where("phoneNumber", "==", fullPhone));
                const phoneSnapshot = await getDocs(phoneQuery);

                if (!phoneSnapshot.empty) {
                  Toast.show({
                    type: "error",
                    text1: "Phone number already registered!",
                    text2: "Please sign in instead"
                  });
                  setLoading(false);
                  return;
                }
              })(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Timeout")), 3000)
              )
            ]);

            await checkWithTimeout;
          }

          setLoading(false);

          // If validation passes, navigate to phone verification
          navigation.navigate('PhoneVerify', {
            email,
            phoneNumber: fullPhone,
            gender: selectedGender,
            full_name: name,
          });

        } catch (error: any) {
          setLoading(false);
          console.error("Error checking user:", error);
          
          // Check if it's a network error - allow user to proceed anyway
          if (error.message?.includes("Could not reach Cloud Firestore") || 
              error.message?.includes("Missing or insufficient permissions") ||
              error.message?.includes("Timeout")) {
            
            // Auto-skip validation for future attempts
            setSkipValidation(true);
            
            Toast.show({
              type: "info",
              text1: "Network slow - skipping validation",
              text2: "Continuing to phone verification..."
            });
            
            // Wait a moment then proceed
            setTimeout(() => {
              navigation.navigate('PhoneVerify', {
                email,
                phoneNumber: fullPhone,
                gender: selectedGender,
                full_name: name,
              });
            }, 500);
          } else {
            Toast.show({
              type: "error",
              text1: "Registration failed!",
              text2: error.message || "Please try again"
            });
          }
        }
      };

    // Handler functions for pickers
    const handleCountrySelect = (countryCode: string) => {
        setSelectedCountryCode(countryCode)
        setShowCountryPicker(false)
    }

    const handleGenderSelect = (gender: string) => {
        setSelectedGender(gender)
        setShowGenderPicker(false)
    }

    const getSelectedCountry = () => {
        return countryCodes.find(country => country.code === selectedCountryCode) || countryCodes[0]
    }

    return (
        <SafeAreaView style={tw`bg-white flex-1`}>
            <KeyboardAvoidingView style={tw`flex-1`} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1 px-6 py-4`}>
                    
                    {/* Header with Back Button */}
                    <View style={tw`mb-8`}>
                        <TouchableOpacity 
                            style={tw`flex-row items-center mb-6`}
                            onPress={() => navigation.goBack()}
                        >
                            <AntDesign name="left" size={20} color="#374151" />
                            <Text style={[tw`ml-2 text-gray-700`, {fontFamily: 'Poppins-Regular'}]}>Back</Text>
                        </TouchableOpacity>
                        
                        <Text style={[tw`text-2xl font-bold text-gray-800 leading-8`, {fontFamily: 'Poppins-Bold'}]}>
                            Sign up with your email or phone number
                        </Text>
                    </View>

                    {/* Input Fields */}
                    <View style={tw`mb-6`}>
                        <RNTextInput
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#9CA3AF"
                            style={[tw`border border-gray-300 rounded-lg px-4 py-3 bg-white mb-4`, {fontFamily: 'Poppins-Regular'}]}
                        />

                        <RNTextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#9CA3AF"
                            style={[tw`border border-gray-300 rounded-lg px-4 py-3 bg-white mb-4`, {fontFamily: 'Poppins-Regular'}]}
                        />
                        
                        {/* Mobile Number Field */}
                        <View style={tw`border border-gray-300 rounded-lg px-4 py-3 bg-white mb-4 flex-row items-center`}>
                            <TouchableOpacity 
                                style={tw`flex-row items-center mr-2`}
                                onPress={() => setShowCountryPicker(true)}
                            >
                                <Text style={tw`text-lg`}>{getSelectedCountry().flag}</Text>
                                <AntDesign name="down" size={12} color="#6B7280" style={tw`ml-1`} />
                            </TouchableOpacity>
                            <View style={tw`w-px h-6 bg-gray-300 mr-3`} />
                            <Text style={[tw`font-bold text-gray-800 mr-2`, {fontFamily: 'Poppins-Bold'}]}>{selectedCountryCode}</Text>
                            <RNTextInput
                                placeholder="Your mobile number"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                                placeholderTextColor="#9CA3AF"
                                style={[tw`flex-1`, {fontFamily: 'Poppins-Regular'}]}
                            />
                        </View>

                        {/* Gender Field */}
                        <TouchableOpacity 
                            style={tw`border border-gray-300 rounded-lg px-4 py-3 bg-white flex-row items-center justify-between`}
                            onPress={() => setShowGenderPicker(true)}
                        >
                            <Text style={[tw`text-gray-500`, {fontFamily: 'Poppins-Regular'}]}>
                                {selectedGender || 'Gender'}
                            </Text>
                            <AntDesign name="down" size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Terms and Privacy */}
                    <View style={tw`flex-row items-start mb-6`}>
                        <Checkbox
                            style={tw`mr-3 mt-1`}
                            value={toggle} 
                            onValueChange={() => setToggle(!toggle)}
                            color={Colors.primaryColor}
                        />
                        <Text style={[tw`flex-1 text-gray-600 leading-5`, {fontFamily: 'Poppins-Regular'}]}>
                            By signing up, you agree to the{' '}
                            <Text style={[tw`font-bold underline`, {fontFamily: 'Poppins-Bold'}]}>Terms of service</Text>
                            {' '}and{' '}
                            <Text style={[tw`font-bold underline`, {fontFamily: 'Poppins-Bold'}]}>Privacy policy.</Text>
                        </Text>
                    </View>

                    {/* Sign Up Button */}
                    {loading ? (
                      <View style={tw`bg-blue-800 rounded-lg py-4 mb-6 items-center justify-center`}>
                        <ActivityIndicator size="small" color="white" />
                      </View>
                    ) : (
                      <Button 
                          label="Sign Up"
                          onPress={handleSignUp}
                          disabled={!email || !phoneNumber || !name || !selectedGender || !toggle}
                          style={[tw`${!email || !phoneNumber || !name || !selectedGender || !toggle ? 'bg-gray-300' : 'bg-blue-800'} rounded-lg py-4 mb-6`]}
                          labelStyle={[tw`font-bold text-white`, {fontFamily: 'Poppins-Bold'}]}
                      />
                    )}

                    {/* Or Separator */}
                    <View style={tw`flex-row items-center mb-6`}>
                        <View style={tw`flex-1 h-px bg-gray-300`} />
                        <Text style={[tw`mx-4 text-gray-500`, {fontFamily: 'Poppins-Regular'}]}>or</Text>
                        <View style={tw`flex-1 h-px bg-gray-300`} />
                    </View>

                    {/* Gmail Sign Up Button */}
                    <TouchableOpacity 
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 bg-white mb-4 flex-row items-center justify-center`}
                        onPress={() => {/* Handle Gmail signup */}}
                    >
                        <Image 
                            source={GmailIcon} 
                            style={tw`w-5 h-5 mr-3`} 
                            resizeMode="contain"
                        />
                        <Text style={[tw`text-gray-800 font-medium`, {fontFamily: 'Poppins-Medium'}]}>
                            Sign up with Gmail
                        </Text>
                    </TouchableOpacity>

                    {/* Facebook Sign Up Button */}
                    <TouchableOpacity 
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 bg-white mb-4 flex-row items-center justify-center`}
                        onPress={() => {/* Handle Facebook signup */}}
                    >
                        <Image 
                            source={FacebookIcon} 
                            style={tw`w-5 h-5 mr-3`} 
                            resizeMode="contain"
                        />
                        <Text style={[tw`text-gray-800 font-medium`, {fontFamily: 'Poppins-Medium'}]}>
                            Sign up with Facebook
                        </Text>
                    </TouchableOpacity>

                    {/* Apple Sign Up Button */}
                    <TouchableOpacity 
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 bg-white mb-6 flex-row items-center justify-center`}
                        onPress={() => {/* Handle Apple signup */}}
                    >
                        <AntDesign name="apple1" size={20} color="#000000" style={tw`mr-3`} />
                        <Text style={[tw`text-gray-800 font-medium`, {fontFamily: 'Poppins-Medium'}]}>
                            Sign up with Apple
                        </Text>
                    </TouchableOpacity>

                    {/* Already have account text */}
                    <View style={tw`flex-row justify-center items-center mb-6`}>
                        <Text style={[tw`text-gray-600`, {fontFamily: 'Poppins-Regular'}]}>
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                            <Text style={[tw`text-blue-800`, {fontFamily: 'Poppins-Bold'}]}>
                                Sign in
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* Country Code Picker Modal */}
            <Modal visible={showCountryPicker} transparent animationType="slide">
                <View style={tw`flex-1 bg-black bg-opacity-50 justify-end`}>
                    <View style={tw`bg-white rounded-t-3xl p-6 max-h-96`}>
                        <View style={tw`flex-row justify-between items-center mb-4`}>
                            <Text style={[tw`text-xl font-bold`, {fontFamily: 'Poppins-Bold'}]}>Select Country</Text>
                            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                                <AntDesign name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {countryCodes.map((country, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={tw`flex-row items-center py-3 px-2 border-b border-gray-100`}
                                    onPress={() => handleCountrySelect(country.code)}
                                >
                                    <Text style={tw`text-2xl mr-3`}>{country.flag}</Text>
                                    <Text style={[tw`text-lg flex-1`, {fontFamily: 'Poppins-Regular'}]}>{country.country}</Text>
                                    <Text style={[tw`text-lg font-bold`, {fontFamily: 'Poppins-Bold'}]}>{country.code}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Gender Picker Modal */}
            <Modal visible={showGenderPicker} transparent animationType="slide">
                <View style={tw`flex-1 bg-black bg-opacity-50 justify-end`}>
                    <View style={tw`bg-white rounded-t-3xl p-6`}>
                        <View style={tw`flex-row justify-between items-center mb-4`}>
                            <Text style={[tw`text-xl font-bold`, {fontFamily: 'Poppins-Bold'}]}>Select Gender</Text>
                            <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                                <AntDesign name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        {genderOptions.map((gender, index) => (
                            <TouchableOpacity
                                key={index}
                                style={tw`py-4 px-2 border-b border-gray-100`}
                                onPress={() => handleGenderSelect(gender)}
                            >
                                <Text style={[tw`text-lg`, {fontFamily: 'Poppins-Regular'}]}>{gender}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default SignUp  