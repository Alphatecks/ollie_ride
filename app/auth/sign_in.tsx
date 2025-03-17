import React, { useState, useCallback } from 'react'                                                    
import { View, Text, TextField, Button } from 'react-native-ui-lib'                        
import tw from "@/tailwind"
import { Link, useRouter, useFocusEffect } from "expo-router"

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "@/firebaseConfig"

import ButtonLoader from "@/components/general/ButtonLoader"
import Toast from 'react-native-toast-message'

                                                                                        
const SignIn = () => {  

	const router = useRouter()

	const [email, setEmail] = useState('')                                                 
  const [loading, setLoading] = useState(false)                                                 
	const [password, setPassword] = useState('')                                           

    const user = auth.currentUser


    useFocusEffect(
        useCallback(() => {
          const checkEmailVerification = async () => {
            // const user = auth.currentUser;
            if (user) {
              await user.reload(); // Refresh user data
              if (!user.emailVerified) {
                router.replace("/auth/await_email_verification");
              } else {
                router.replace("/(tabs)/bottomsheet2");
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
     <View style={tw`bg-white flex-1 p-6`}> 
        <View style={tw`mb-4`} >
             <View>
                 <Text style={tw`text-2xl mb-6`} poppinsMedium >Sign In to your account</Text>   
             </View>
             
        </View>                                                            
         <TextField                                                                     
             placeholder="Email"                                                        
             value={email}                                                              
             onChangeText={setEmail}                                                    
             keyboardType="email-address"                                               
             autoCapitalize="none" 
             rounded
             poppins                                                     
             style={tw`mb-4`}                                                           
         />                                                                             
         <TextField                                                                     
             placeholder="Password"                                                     
             value={password}                                                           
             onChangeText={setPassword}                                                 
             secureTextEntry                                                            
             style={tw`mb-6`}
             poppins  
             rounded                                                         
         />  
         {loading ? 
             <ButtonLoader />
            :
            <Button
            label="Sign In"
            poppins
            onPress={handleSignIn}
            style={tw`${!email || !password ? 'btn bg-gray-300' : 'btn'}`}
            disabled={!email || !password}
            />

        }
                
         <Link asChild href="/auth/forgot_password">
             <Text poppinsMedium style={tw`text-ollie-base py-4`} >Forgot Password?</Text>
         </Link>

         <Text poppinsMedium style={tw`py-3`}>
                Don't an account?
                <Link href="/auth/sign_up" asChild  >
                    <Text style={tw`text-ollie-base`}> Sign Up</Text>
                </Link>
        </Text>               
     </View>                                                                            
 )                                                                                      
}                                                                                          
                                                                                        
export default SignIn  