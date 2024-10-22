import React, { useState, useEffect } from 'react';
import { View, TextInput, Text } from 'react-native';
import { Button, TextField } from "react-native-ui-lib"
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import Toast from 'react-native-toast-message';
import tw from '@/tailwind'; // Assuming twrnc is used for styling

const UpdateProfileScreen = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  // const [displayName, setDisplayName] = useState<string>(auth.currentUser?.displayName || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const user = auth.currentUser;

  // Fetch user's current data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName || '');
          setLastName(userData.lastName || '');
          setPhoneNumber(userData.phoneNumber || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data.');
      }
    };

    fetchUserData();
  }, [user]);

  // Update displayName in Firebase Auth and user data in Firestore
  const handleUpdateProfile = async () => {
    if (!user) return;

    // Basic validation
    if (!firstName || !lastName || !phoneNumber) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    setError(null); // Reset error

    try {
      // Update displayName in Firebase Authentication
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      // Update Firestore user document
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        firstName,
        lastName,
        phoneNumber,
      });

      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully!',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 p-5 bg-white justify-between`}>
      <View >
        <Text style={tw`text-xl poppins mb-4`}>Update Profile</Text>

        {error && <Text style={tw`text-red-500 mb-4`}>{error}</Text>}

        <TextField
          style={tw`input`}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextField
          style={tw`input poppins`}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextField
          style={tw`input poppins`}
          placeholder="Phone Number"
          value={phoneNumber}
          keyboardType="phone-pad"
          onChangeText={setPhoneNumber}
        />
      </View>

      <Button
        label={loading ? 'Updating...' : 'Update Profile'}
        onPress={handleUpdateProfile}
        disabled={loading}
        style={tw`btn`}
        poppins
      />
    </View>
  );
};

export default UpdateProfileScreen;
