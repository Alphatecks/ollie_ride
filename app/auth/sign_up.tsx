import React, { useState } from 'react'
import { View, Text, TextInput, Button, Colors, Checkbox, TouchableOpacity, Modal } from 'react-native-ui-lib'
import { KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Dimensions, TextInput as RNTextInput } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import tw from "../../tailwind"
import { useNavigation } from '@react-navigation/native'

import Toast from 'react-native-toast-message'
import ButtonLoader from '../../components/general/ButtonLoader'



const SignUp = () => {

    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)

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

    const handleSignUp = () => {
        if (!email || !phoneNumber || !selectedGender || !name) {
          Toast.show({
            type: "error",
            text1: "All fields are required!",
          });
          return;
        }
        

        console.log(email, phoneNumber, selectedGender, name )

        navigation.navigate('PaymentDetails', {
          pathname: "/auth/set_password",
          params: {
            email,
            phoneNumber,
            gender: selectedGender,
            full_name: name,
          },
        });
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
                    <Button 
                        label="Sign Up"
                        onPress={handleSignUp}
                        disabled={!email || !phoneNumber || !name || !selectedGender || !toggle}
                        style={[tw`${!email || !phoneNumber || !name || !selectedGender || !toggle ? 'bg-gray-300' : 'bg-blue-800'} rounded-lg py-4 mb-6`]}
                        labelStyle={[tw`font-bold text-white`, {fontFamily: 'Poppins-Bold'}]}
                    />

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
                        <FontAwesome name="google" size={20} color="#EA4335" style={tw`mr-3`} />
                        <Text style={[tw`text-gray-800 font-medium`, {fontFamily: 'Poppins-Medium'}]}>
                            Sign up with Gmail
                        </Text>
                    </TouchableOpacity>

                    {/* Facebook Sign Up Button */}
                    <TouchableOpacity 
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 bg-white mb-6 flex-row items-center justify-center`}
                        onPress={() => {/* Handle Facebook signup */}}
                    >
                        <FontAwesome name="facebook" size={20} color="#1877F2" style={tw`mr-3`} />
                        <Text style={[tw`text-gray-800 font-medium`, {fontFamily: 'Poppins-Medium'}]}>
                            Sign up with Facebook
                        </Text>
                    </TouchableOpacity>

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