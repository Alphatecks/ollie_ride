import React, { useRef, useState, useEffect } from 'react'
import { View, Text, Button, TextField, Colors, TouchableOpacity } from 'react-native-ui-lib';
import tw from '@/tailwind';
import { Ionicons } from '@expo/vector-icons'; // Importing icons from expo-vector-icons
import { Link, useLocalSearchParams, useRouter } from "expo-router"
import ButtonLoader from "@/components/general/ButtonLoader"
import Toast from 'react-native-toast-message';

import { auth, db } from "@/firebaseConfig"
import { getFirestore, doc, setDoc, collection, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import Loader from '@/components/general/Loader';

// import { db as DB } from "@/firebaseConfig"

const SetPassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [c_password, setCPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const params = useLocalSearchParams();
  const router = useRouter();


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
      const userCredential = await createUserWithEmailAndPassword(auth, params.email, password)
      const user = userCredential.user
      console.log("User signed up!!", user)
      // Send email verification

      await sendEmailVerification(user)

      console.log("Email code sent... Updating data")

      Toast.show({
        type: "success",
        text1: "Account created successfully!! Pls check your email for verification code"
      });

      await updateProfile(user, {displayName: params?.full_name})

      // Create a doc for other information

      console.log("Done updating... Setting to users doc other paramas")
      console.log({
        gender: params.gender,
        phoneNumber: params.phoneNumber,
        full_name: params.full_name
      })

      await setDoc(doc(db, "users", user.uid), {
        gender: params.gender,
        phoneNumber: params.phoneNumber,
        full_name: params.full_name,
        role: "rider",
        isApproved: false,
        totalBalance: 0,
        totalTrips: 0,
        totalTimeOnline: 0,
        totalDistanceCovered: 0,
        totalTimeSpentOnTrip: 0
      })
      console.log("Set up a users collection!!")

      setLoading(false)

      setPassword('');
      setCPassword('');

      console.log(params)

      router.replace("/(tabs)/bottomsheet2")
     
    }
    catch(error){
      setLoading(false)
      Toast.show({
        type: "error",
        text1: `Failed to sign up...  Retry.`,
        text2: `${error}`
      });
      return
    //   router.push("/auth/signup")
    }
  
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={tw`bg-white flex-1 p-4 pb-20 justify-between`}>
      <View>
        {/* <Text center style={tw`mb-6`} poppinsMedium h2  >
          Set Password
        </Text> */}
        <Text center style={tw`mb-6`} poppins>
          Set your password
        </Text>
        <View style={tw``}>
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
            rounded
  
          />
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
            rounded
          />
        </View>
        <Text poppinsMedium style={tw`text-gray-400`}>
          At least 1 number or a special character
        </Text>
      </View>
      <Button
        label="Register"
        backgroundColor={Colors.primaryColor}
        style={tw`btn p-4 mt-4`}
        
        poppins
        onPress={submitData}
        disabled={!password || !c_password}
      />
    </View>
  );
};

export default SetPassword;
