import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Colors } from 'react-native-ui-lib';
import tw from '../../tailwind';
import { auth, db, storage } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import Loader from '../../components/general/Loader';
import { useNavigation, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Profile = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [district, setDistrict] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState('+880');
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [userData, setUserData] = useState(null);
    const [showCityPicker, setShowCityPicker] = useState(false);
    const [showDistrictPicker, setShowDistrictPicker] = useState(false);
    
    const navigation = useNavigation();
    const route = useRoute();
    
    // Get current user
    const currentUser = auth.currentUser;

    // Country codes data
    const countryCodes = [
        { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
        { code: '+1', country: 'United States', flag: '🇺🇸' },
        { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
        { code: '+91', country: 'India', flag: '🇮🇳' },
    ];
    
    useEffect(() => {
        if (!currentUser) {
            Toast.show({
                type: 'error',
                text1: 'Authentication Error',
                text2: 'Please log in to access your profile'
            });
            navigation.navigate('SignIn');
            return;
        }
        
        // Pre-fill data from route params if coming from signup flow
        if (route.params) {
            if (route.params.full_name) setFullName(route.params.full_name);
            if (route.params.email) setEmail(route.params.email);
            if (route.params.phoneNumber) {
                // Extract country code if present
                const phone = route.params.phoneNumber;
                const match = phone.match(/^(\+\d{1,3})(.+)$/);
                if (match) {
                    setSelectedCountryCode(match[1]);
                    setPhoneNumber(match[2]);
                } else {
                    setPhoneNumber(phone);
                }
            }
        }
        
        fetchUserData();
    }, []);
    
    const fetchUserData = async () => {
        try {
            setLoading(true);
            const userRef = doc(db, "users", currentUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const data = userSnap.data();
                setUserData(data);
                
                // Pre-fill all fields
                if (!fullName) setFullName(data.full_name || '');
                if (!email) setEmail(data.email || currentUser.email || '');
                if (!phoneNumber) setPhoneNumber(data.phoneNumber || '');
                setCity(data.city || '');
                setStreet(data.street || '');
                setDistrict(data.district || '');
                setProfileImage(data.profileImage || null);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Error fetching profile',
                text2: error.message
            });
        }
    };
    
    const pickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Toast.show({
                type: 'error',
                text1: 'Permission Denied',
                text2: 'We need camera roll permission to upload images'
            });
            return;
        }
        
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });
            
            if (!result.canceled && result.assets && result.assets.length > 0) {
                setProfileImage(result.assets[0].uri);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Image Selection Failed',
                text2: error.message
            });
        }
    };
    
    const uploadImageToFirebase = async (uri) => {
        if (!uri) return null;
        
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            
            // Create a reference with a unique filename
            const filename = `profile_${currentUser.uid}_${new Date().getTime()}`;
            const storageRef = ref(storage, `profileImages/${filename}`);
            
            // Upload the image
            await uploadBytes(storageRef, blob);
            
            // Get download URL
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    };
    
    const validateInputs = () => {
        if (!fullName.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Full name is required'
            });
            return false;
        }
        
        if (!email.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Email is required'
            });
            return false;
        }
        
        if (!phoneNumber.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Phone number is required'
            });
            return false;
        }
        
        if (!city.trim()) {
            Toast.show({
                type: 'error',
                text1: 'City is required'
            });
            return false;
        }
        
        if (!street.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Street is required'
            });
            return false;
        }
        
        if (!district.trim()) {
            Toast.show({
                type: 'error',
                text1: 'District is required'
            });
            return false;
        }
        
        return true;
    };
    
    const updateProfile = async () => {
        if (!validateInputs()) return;
        
        try {
            setLoading(true);
            
            let imageUrl = userData?.profileImage || null;
            
            // If user selected a new image and it's different from the current one
            if (profileImage && profileImage !== userData?.profileImage) {
                imageUrl = await uploadImageToFirebase(profileImage);
            }
            
            // Update user document in Firestore
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                full_name: fullName,
                email: email,
                phoneNumber: phoneNumber,
                city,
                street,
                district,
                profileImage: imageUrl,
                updatedAt: new Date().toISOString()
            });
            
            setLoading(false);
            Toast.show({
                type: 'success',
                text1: 'Profile Updated Successfully'
            });
            
            // Navigate back or to dashboard
            navigation.navigate('MainTabs');
        } catch (error) {
            setLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: error.message
            });
        }
    };
    
    const handleCancel = () => {
        navigation.goBack();
    };
    
    if (loading && !userData) {
        return <Loader />;
    }

    return (
        <SafeAreaView style={tw`bg-white flex-1`}>
            <ScrollView style={tw`flex-1`}>
                {/* Header */}
                <View style={tw`flex-row items-center px-6 py-4`}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        style={tw`flex-row items-center`}
                    >
                        <AntDesign name="left" size={20} color="#000000" />
                        <Text style={[tw`text-gray-700 ml-2`, {fontFamily: 'Poppins-Regular'}]}>Back</Text>
                    </TouchableOpacity>
                    <View style={tw`absolute left-0 right-0 items-center`}>
                        <Text style={[tw`text-lg font-bold text-black`, {fontFamily: 'Poppins-Bold'}]}>Profile</Text>
                    </View>
                </View>

                <View style={tw`px-6 pb-6`}>
                    {/* Profile Picture */}
                    <View style={tw`items-center mb-8`}>
                        <TouchableOpacity onPress={pickImage} style={tw`relative`}>
                            <View style={tw`w-24 h-24 rounded-full bg-gray-200 items-center justify-center`}>
                                {profileImage ? (
                                    <View style={tw`w-24 h-24 rounded-full overflow-hidden`}>
                                        <Image source={{ uri: profileImage }} style={tw`w-full h-full`} />
                                    </View>
                                ) : (
                                    <Text style={[tw`text-2xl font-bold text-gray-400`, {fontFamily: 'Poppins-Bold'}]}>
                                        {fullName ? fullName.substring(0, 2).toUpperCase() : "?"}
                                    </Text>
                                )}
                            </View>
                            {/* Camera Icon Overlay */}
                            <View style={tw`absolute bottom-0 right-0 bg-blue-800 w-8 h-8 rounded-full items-center justify-center border-2 border-white`}>
                                <Ionicons name="camera" size={16} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Full Name */}
                    <View style={tw`mb-4`}>
                        <TextInput
                            placeholder="Full Name"
                            value={fullName}
                            onChangeText={setFullName}
                            style={[tw`bg-gray-100 rounded-lg px-4 py-4 text-base text-gray-900`, {fontFamily: 'Poppins-Regular'}]}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Mobile Number */}
                    <View style={tw`mb-4`}>
                        <View style={tw`border border-gray-300 rounded-lg px-4 py-3 bg-white flex-row items-center`}>
                            <TouchableOpacity style={tw`flex-row items-center mr-2`}>
                                <Text style={tw`text-lg`}>{countryCodes.find(c => c.code === selectedCountryCode)?.flag || '🇧🇩'}</Text>
                                <AntDesign name="down" size={12} color="#6B7280" style={tw`ml-1`} />
                            </TouchableOpacity>
                            <View style={tw`w-px h-6 bg-gray-300 mr-3`} />
                            <Text style={[tw`font-bold text-gray-800 mr-2`, {fontFamily: 'Poppins-Bold'}]}>{selectedCountryCode}</Text>
                            <TextInput
                                placeholder="Your mobile number"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                                style={[tw`flex-1`, {fontFamily: 'Poppins-Regular'}]}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <View style={tw`mb-4`}>
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={[tw`bg-gray-100 rounded-lg px-4 py-4 text-base text-gray-900`, {fontFamily: 'Poppins-Regular'}]}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Street */}
                    <View style={tw`mb-4`}>
                        <TextInput
                            placeholder="Street"
                            value={street}
                            onChangeText={setStreet}
                            style={[tw`bg-gray-100 rounded-lg px-4 py-4 text-base text-gray-900`, {fontFamily: 'Poppins-Regular'}]}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* City */}
                    <View style={tw`mb-4`}>
                        <TouchableOpacity 
                            style={tw`bg-gray-100 rounded-lg px-4 py-4 flex-row items-center justify-between`}
                            onPress={() => {/* TODO: Implement city picker */}}
                        >
                            <TextInput
                                placeholder="City"
                                value={city}
                                onChangeText={setCity}
                                style={[tw`flex-1 text-base text-gray-900`, {fontFamily: 'Poppins-Regular'}]}
                                placeholderTextColor="#9CA3AF"
                            />
                            <AntDesign name="down" size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* District */}
                    <View style={tw`mb-6`}>
                        <TouchableOpacity 
                            style={tw`bg-gray-100 rounded-lg px-4 py-4 flex-row items-center justify-between`}
                            onPress={() => {/* TODO: Implement district picker */}}
                        >
                            <TextInput
                                placeholder="District"
                                value={district}
                                onChangeText={setDistrict}
                                style={[tw`flex-1 text-base text-gray-900`, {fontFamily: 'Poppins-Regular'}]}
                                placeholderTextColor="#9CA3AF"
                            />
                            <AntDesign name="down" size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Action Buttons */}
                    <View style={tw`flex-row gap-3`}>
                        <TouchableOpacity
                            onPress={handleCancel}
                            style={tw`flex-1 border-2 border-blue-800 rounded-lg py-4 items-center justify-center`}
                        >
                            <Text style={[tw`text-blue-800 text-base font-bold`, {fontFamily: 'Poppins-Bold'}]}>Cancel</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={updateProfile}
                            disabled={loading}
                            style={tw`flex-1 bg-blue-800 rounded-lg py-4 items-center justify-center`}
                        >
                            <Text style={[tw`text-white text-base font-bold`, {fontFamily: 'Poppins-Bold'}]}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;