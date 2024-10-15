import React, { useState } from 'react'                                                    
import { View, Text, TextField, Button } from 'react-native-ui-lib'     
import { KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native" 

import tw from "@/tailwind"
import { Link, useRouter } from "expo-router"

import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig"



const SignUp = () => {  

	const router = useRouter()

    const [loading, setLoading] = useState(false)

	const [email, setEmail] = useState('')                                                 
	const [password, setPassword] = useState('')                                           
    const [firstName, setFirstName] = useState('')                                           
    const [lastName, setLastName] = useState('')                                           
    const [phoneNumber, setPhoneNumber] = useState('')                                           
    const [confirmPassword, setConfirmPassword] = useState('')                                           
	const [error, setError] = useState('')  

    if (auth.currentUser) return router.push("(tabs)")   
                                                                                        
	const handleSignUp = async () => {
	    try {
            setLoading(true)
            console.log("Signing up user with details: ", firstName, lastName, email, password, confirmPassword, phoneNumber)

	        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	        const user = userCredential.user;  // Get the registered user object

            const userId = user.uid

            console.log("userID: ", userId, {
                firstName, lastName, phoneNumber,
                role: "driver"
            })

            console.log("Firestore instance:", db);

            await setDoc(doc(db, "users", userId), {
                firstName, lastName, phoneNumber,
                role: "driver"
            });

            console.log("Set the doc of users")

            await sendEmailVerification(user)

            console.log("Email code sent... Updating data")

            await updateProfile(user, {displayName: `${firstName} ${lastName}`})

            setLoading(false)
            router.push("(tabs)");

	        // Handle successful sign-up (e.g., navigate to home screen)
	    } catch (error) {
            setLoading(false)
	        setError(error.message);
            console.log(error.message);
	    }
	};

                                                                                        
 return (                                                                               
     <KeyboardAvoidingView style={tw`bg-white flex-1 p-3`}> 
        <ScrollView showsVerticalScrollIndicator={false} >
            <View style={tw`mb-4`} >
             <Text style={tw`text-2xl mb-6`} poppinsMedium >Create an account</Text>   
             <Text poppins style={tw`text-gray-500`} >Lets guide you throught the steps of creating an account on Ollie Ride</Text>    
        </View> 
        <TextField                                                                     
         placeholder="First Name"                                                        
         value={firstName}                                                              
         onChangeText={setFirstName}                                                    
         rounded
         poppins                                                     
         style={tw`input`}                                                           
         /> 
       <TextField                                                                     
         placeholder="Last Name"                                                        
         value={lastName}                                                              
         onChangeText={setLastName}                                                    
         rounded
         poppins                                                     
         style={tw`input`}                                                    
         /> 
        <TextField                                                                     
         placeholder="Phone Number"                                                        
         value={phoneNumber}                                                              
         onChangeText={setPhoneNumber}   
         keyboardType="numeric"                                                 
         rounded
         poppins                                                     
         style={tw`input`}                                                           
         /> 

         <TextField                                                                     
         placeholder="Email"                                                        
         value={email}                                                              
         onChangeText={setEmail}                                                    
         keyboardType="email-address"                                               
         autoCapitalize="none" 
         style={tw`input`} 
         rounded
         poppins                                                                                                              
         />                                                                             
         <TextField                                                                     
             placeholder="Password"                                                     
             value={password}                                                           
             onChangeText={setPassword}                                                 
             secureTextEntry                                                            
             style={tw`input`}
             poppins  
             rounded                                                         
         />    
       <TextField                                                                     
         placeholder="Confirm Password"                                                     
         value={confirmPassword}                                                           
         onChangeText={setConfirmPassword}                                                 
         secureTextEntry                                                            
         style={tw`mb-6`}
         poppins  
         rounded                                                         
         />  
         {loading &&  
         <View style={tw`bg-gray-300 p-2 rounded-md my-2`} >
              <ActivityIndicator size = "large" color = "red" />
          </View>  
        }  

        {!loading && 
         <Button label="Sign Up" 
         poppins
         onPress={handleSignUp} 
         style={tw`btn`}
         disabled = {!email || !password || !firstName || !lastName || !confirmPassword || !phoneNumber ? true: false}
          />   
        }
        
        
         {error ? <Text style={tw`text-red-500`}>{error}</Text> : null}  

         <Text poppinsMedium style={tw`my-4`} >
                Have an account?
                <Link href="auth/sign_in" asChild >
                    <Text style={tw`text-ollie-base`}> Sign In</Text>
                </Link>
        </Text>               
        </ScrollView>
        
     </KeyboardAvoidingView>                                                                            
 )                                                                                      
}                                                                                          
                                                                                        
export default SignUp  