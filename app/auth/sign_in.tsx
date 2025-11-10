import React, { useState, useCallback } from 'react'                                                    
import { View, Text, TextInput, SafeAreaView, TouchableOpacity } from 'react-native'                        
import tw from "../../tailwind"
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "../../firebaseConfig"

import Toast from 'react-native-toast-message'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

                                                                                        
const SignIn = () => {  

	const navigation = useNavigation()

	const [email, setEmail] = useState('')                                                 
    const [loading, setLoading] = useState(false)                                                 
	const [password, setPassword] = useState('')                                           
    const [showPassword, setShowPassword] = useState(false)

    const user = auth.currentUser


    useFocusEffect(
        useCallback(() => {
          const checkEmailVerification = async () => {
            // const user = auth.currentUser;
            if (user) {
              await user.reload(); // Refresh user data
              if (!user.emailVerified) {
                navigation.navigate('AwaitEmailVerification');
              } else {
                navigation.navigate('MainTabs');
              }
            }
          };
      
          checkEmailVerification();
      
          return () => {
            console.log("This route is now unfocused.");
          };
        }, [])
      );
                                         
                                                                                        
	const handleSignIn = async () => {
	    try {
            setLoading(true)
            // const auth = getAuth()

	        const userCredential = await signInWithEmailAndPassword(auth, email, password);
	        const user = userCredential.user;  // Get the registered user object

            const userId = user.uid
            console.log("Signed in: : ", userId)

            setLoading(false)

            router.replace("/(tabs)/bottomsheet2");
	        // Handle successful sign-up (e.g., navigate to home screen)
	    } catch (error) {
            setLoading(false)
            Toast.show({type: "error", text1: `${error}`})
            console.log(error)
	    }
	};

                                                                                        
 return (                                                                               
     <SafeAreaView style={tw`bg-white flex-1`}> 
        {/* Header */}
        <View style={tw`flex-row items-center px-6 py-4`}>
            <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={tw`flex-row items-center`}
            >
                <AntDesign name="left" size={20} color="#000000" />
            </TouchableOpacity>
            <View style={tw`absolute left-0 right-0 items-center`}>
                <Text style={[tw`text-lg font-bold text-black`, {fontFamily: 'Poppins-Bold'}]}>Log in</Text>
            </View>
        </View>

           <View style={tw`flex-1 px-6 pt-8`}>
               {/* Email Input */}
               <TextInput
                   placeholder="Email"
                   value={email}
                   onChangeText={setEmail}
                   keyboardType="email-address"
                   autoCapitalize="none"
                   style={[tw`bg-gray-100 border border-gray-300 rounded-lg px-4 py-4 mb-4 text-base text-gray-900`, {fontFamily: 'Poppins-Regular'}]}
                   placeholderTextColor="#9CA3AF"
               />

            {/* Password Input */}
            <View style={tw`relative`}>
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={[tw`bg-gray-100 border border-gray-300 rounded-lg px-4 py-4 pr-12 text-base text-gray-900`, {fontFamily: 'Poppins-Regular'}]}
                    placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity 
                    style={tw`absolute right-4 top-0 bottom-0 justify-center`}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color="#6B7280" 
                    />
                </TouchableOpacity>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity 
                onPress={() => navigation.navigate('ForgotPassword')}
                style={tw`self-end mt-4 mb-8`}
            >
                <Text style={[tw`text-blue-800 text-sm`, {fontFamily: 'Poppins-Medium'}]}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Continue Button */}
            <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading || !email || !password}
                style={tw`bg-blue-800 rounded-lg py-4 items-center justify-center ${loading || !email || !password ? 'opacity-50' : ''}`}
            >
                {loading ? (
                    <View style={tw`py-2`}>
                        <Text style={[tw`text-white text-base font-bold`, {fontFamily: 'Poppins-Bold'}]}>Loading...</Text>
                    </View>
                ) : (
                    <Text style={[tw`text-white text-base font-bold`, {fontFamily: 'Poppins-Bold'}]}>Continue</Text>
                )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={tw`absolute bottom-6 left-6 right-6 items-center`}>
                <Text style={[tw`text-gray-600 text-sm`, {fontFamily: 'Poppins-Medium'}]}>
                    Don't have an account? 
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={[tw`text-blue-800 text-sm ml-1`, {fontFamily: 'Poppins-Medium'}]}>Sign Up</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        </View>               
     </SafeAreaView>                                                                            
 )                                                                                      
}                                                                                          
                                                                                        
export default SignIn  