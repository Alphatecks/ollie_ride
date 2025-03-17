import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextField, Colors, Avatar, TouchableOpacity } from 'react-native-ui-lib';
import tw from '@/tailwind';
import { auth, db, storage } from '@/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import Loader from '@/components/general/Loader';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const Profile = () => {
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [userData, setUserData] = useState(null);
    const router = useRouter();
    
    // Get current user
    const currentUser = auth.currentUser;
    
    useEffect(() => {
        if (!currentUser) {
            Toast.show({
                type: 'error',
                text1: 'Authentication Error',
                text2: 'Please log in to access your profile'
            });
            router.replace('/auth/sign_in');
            return;
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
                setState(data.state || '');
                setCity(data.city || '');
                setStreet(data.street || '');
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
        if (!state.trim()) {
            Toast.show({
                type: 'error',
                text1: 'State field is required'
            });
            return false;
        }
        
        if (!city.trim()) {
            Toast.show({
                type: 'error',
                text1: 'City field is required'
            });
            return false;
        }
        
        if (!street.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Street field is required'
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
                state,
                city,
                street,
                profileImage: imageUrl,
                updatedAt: new Date()
            });
            
            setLoading(false);
            Toast.show({
                type: 'success',
                text1: 'Profile Updated Successfully'
            });
            
            // Navigate back or to dashboard
            router.replace("/(tabs)/bottomsheet2");
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
        router.back();
    };
    
    if (loading) {
        return <Loader />;
    }
    
    return (
        <View style={tw`bg-white flex-1 p-4`}>
            <View style={tw`items-center mb-6`}>
                <TouchableOpacity onPress={pickImage}>
                    <Avatar 
                        source={profileImage ? { uri: profileImage } : null}
                        label={!profileImage && userData?.full_name ? userData.full_name.substring(0, 2).toUpperCase() : "IT"} 
                        badgeProps={{
                            backgroundColor: Colors.blue30,
                            // icon: <Feather name='camera' />,
                            size: 24
                        }}
                        badgePosition="BOTTOM_RIGHT" 
                        size={120}
                        // backgroundColor={Colors.primaryColor}
                    />
                    <Text style={tw`text-center mt-2 text-gray-500`} poppins>Tap to change profile photo</Text>
                </TouchableOpacity>
            </View>
            <View style={tw`my-4`}>
                <TextField
                    value={state}
                    onChangeText={setState}
                    labelColor="#3C2F3D"
                    placeholder="State"
                    enableErrors
                    validate={['required']}
                    validationMessage={['State field is required']}
                    hint="Enter State"
                    poppins
                    rounded
                />
                <TextField
                    value={city}
                    onChangeText={setCity}
                    labelColor="#3C2F3D"
                    placeholder="City"
                    enableErrors
                    style={tw`mt-6`}
                    validate={['required']}
                    validationMessage={['City field is required']}
                    hint="Enter City"
                    poppins
                    rounded
                />
                <TextField
                    value={street}
                    onChangeText={setStreet}
                    labelColor="#3C2F3D"
                    placeholder="Street"
                    enableErrors
                    style={tw`mt-6`}
                    validate={['required']}
                    validationMessage={['Street field is required']}
                    hint="Enter Street"
                    poppins
                    rounded
                />
            </View>
            <View style={tw``}>
                {/* <Button
                    label="Cancel"
                    outline
                    style={tw`flex-1 mr-2 btn-outline`}
                    // labelStyle={{color: Colors.primaryColor}}
                    poppins
                    onPress={handleCancel}
                /> */}
                <Button
                    label="Save Changes"
                    style={tw`btn`}
                    poppins
                    onPress={updateProfile}
                    disabled={loading}
                />
            </View>
        </View>
    );
};

export default Profile;