import React, { useRef, useState, useEffect } from 'react'
import { View, Text, Button, TextField, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { SafeAreaView, Platform } from 'react-native';
import tw from '../../tailwind';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native'
import ButtonLoader from "../../components/general/ButtonLoader"
import Toast from 'react-native-toast-message';

import { auth, db } from "../../firebaseConfig"
import { getFirestore, doc, setDoc, collection, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import Loader from '../../components/general/Loader';

// import { db as DB } from "@/firebaseConfig"

const SetPassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [c_password, setCPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation()
  const route = useRoute()


  const submitData = async () => {
    if(password !== c_password){
      Toast.show({
        type: "error",
        text1: "Your password do not match"
      });

      return
    }

    try{
      setLoading(true)

      // Sign up the user
      const userCredential = await createUserWithEmailAndPassword(auth, route.params?.email, password)
      const user = userCredential.user
      console.log("User signed up!!", user)
      // Send email verification

      await sendEmailVerification(user)

      console.log("Email code sent... Updating data")

      Toast.show({
        type: "success",
        text1: "Account created successfully!! Pls check your email for verification code"
      });

      await updateProfile(user, {displayName: route.params?.full_name})

      // Create a doc for other information

      console.log("Done updating... Setting to users doc other paramas")
      console.log({
        gender: route.params?.gender,
        phoneNumber: route.params?.phoneNumber,
        full_name: route.params?.full_name
      })

      // Create user document in Firestore with all collected data
      await setDoc(doc(db, "users", user.uid), {
        email: route.params?.email,
        gender: route.params?.gender,
        phoneNumber: route.params?.phoneNumber,
        full_name: route.params?.full_name,
        isPhoneVerified: route.params?.isPhoneVerified || false,
        role: "rider",
        isApproved: false,
        isEmailVerified: false,
        totalBalance: 0,
        totalTrips: 0,
        totalTimeOnline: 0,
        totalDistanceCovered: 0,
        totalTimeSpentOnTrip: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      console.log("Set up a users collection!!")

      setLoading(false)

      setPassword('');
      setCPassword('');

      console.log(route.params)

      Toast.show({
        type: "success",
        text1: "Account created successfully!"
      });

      navigation.navigate('Profile')
     
    }
    catch(error){
      setLoading(false)
      Toast.show({
        type: "error",
        text1: `Failed to sign up...  Retry.`,
        text2: `${error}`
      });
      return
    //   navigation.navigate('SignUp')
    }
  
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <View style={tw`flex-1 justify-between`}>
        {/* Back Button Header */}
        <View style={tw`px-6 pt-4`}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={tw`flex-row items-center mb-8`}
          >
            <AntDesign name="left" size={20} color="#374151" />
            <Text style={[tw`ml-2 text-gray-700`, {fontFamily: 'Poppins-Regular'}]}>Back</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={[tw`text-center text-2xl font-bold text-gray-800 mb-2`, {fontFamily: 'Poppins-Bold'}]}>
            Set password
          </Text>

          {/* Subtitle */}
          <Text style={[tw`text-center text-base text-gray-600 mb-8`, {fontFamily: 'Poppins-Regular'}]}>
            Set your password
          </Text>

          {/* Password Input Fields */}
          <View style={tw`mb-4`}>
            <View style={tw`relative`}>
              <TextField
                value={password}
                onChangeText={setPassword}
                labelColor="#3C2F3D"
                placeholder="Enter Your Password"
                enableErrors
                validate={['required', (value) => value.length > 6]}
                validationMessage={['Field is required', 'Password is too short']}
                hint="Enter Your Password"
                secureTextEntry={!isPasswordVisible}
                poppins
                style={tw`border border-gray-300 rounded-lg px-4 py-3 mb-4`}
              />
              <TouchableOpacity 
                onPress={togglePasswordVisibility}
                style={tw`absolute right-4 top-3`}
              >
                <Ionicons 
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color="#9CA3AF" 
                />
              </TouchableOpacity>
            </View>

            <View style={tw`relative`}>
              <TextField
                value={c_password}
                onChangeText={setCPassword}
                labelColor="#3C2F3D"
                placeholder="Confirm Password"
                enableErrors
                validate={['required', (value) => value.length > 6]}
                validationMessage={['Field is required', 'Password is too short']}
                hint="Confirm Your Password"
                secureTextEntry={!isPasswordVisible}
                poppins
                style={tw`border border-gray-300 rounded-lg px-4 py-3`}
              />
              <TouchableOpacity 
                onPress={togglePasswordVisibility}
                style={tw`absolute right-4 top-3`}
              >
                <Ionicons 
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color="#9CA3AF" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Password Requirement Text */}
          <Text style={[tw`text-gray-600 text-sm`, {fontFamily: 'Poppins-Regular'}]}>
            Atleast 1 number or a special character
          </Text>
        </View>

        {/* Register Button */}
        <View style={tw`px-6 pb-8`}>
          <TouchableOpacity
            onPress={submitData}
            disabled={!password || !c_password}
            style={[
              tw`rounded-lg py-4 items-center justify-center`,
              { backgroundColor: (!password || !c_password) ? '#D1D5DB' : Colors.primaryColor }
            ]}
          >
            <Text style={[tw`text-white text-base font-bold`, {fontFamily: 'Poppins-Bold'}]}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SetPassword;
