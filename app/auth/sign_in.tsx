import React, { useState } from 'react'                                                    
import { View, Text, TextField, Button } from 'react-native-ui-lib'                        
import tw from "@/tailwind"
import { Link, useRouter } from "expo-router"

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore";

// const db = getFirestore();

                                                                                        
const SignIn = () => {  

	const router = useRouter()

	const [email, setEmail] = useState('')                                                 
	const [password, setPassword] = useState('')                                           
	const [error, setError] = useState('')                                                 
                                                                                        
	const handleSignIn = async () => {
	    try {
            const auth = getAuth()

	        const userCredential = await signInWithEmailAndPassword(auth, email, password);
	        const user = userCredential.user;  // Get the registered user object

            const userId = user.uid
            console.log("Signed in: : ", userId)

            router.push("(tabs)");
	        // Handle successful sign-up (e.g., navigate to home screen)
	    } catch (error) {
	        setError(error.message);
            console.log(error)
	    }
	};

                                                                                        
 return (                                                                               
     <View style={tw`bg-white flex-1 p-6`}> 
        <View style={tw`mb-4`} >
             <Text style={tw`text-2xl mb-6`} interMedium >Sign In to your account</Text>   
             <Text inter style={tw`text-gray-500`} >Please sign in to continue</Text>    
        </View>                                                            
         <TextField                                                                     
             placeholder="Email"                                                        
             value={email}                                                              
             onChangeText={setEmail}                                                    
             keyboardType="email-address"                                               
             autoCapitalize="none" 
             rounded
             inter                                                     
             style={tw`mb-4`}                                                           
         />                                                                             
         <TextField                                                                     
             placeholder="Password"                                                     
             value={password}                                                           
             onChangeText={setPassword}                                                 
             secureTextEntry                                                            
             style={tw`mb-6`}
             inter  
             rounded                                                         
         />                                                                             
         <Button label="Sign In" 
         inter
         onPress={handleSignIn} 
         style={tw`btn`}
         disabled = {!email || !password ? true: false}
          />             
         {error ? <Text style={tw`text-red-500`}>{error}</Text> : null}  

         <Text interMedium style={tw`text-gateway-base py-4`} >Forgot Password?</Text>

         <Text interMedium style={tw`py-3`}>
                Don't an account?
                <Link href="auth/sign_up" asChild  >
                    <Text style={tw`text-gateway-base`}> Sign Up</Text>
                </Link>
        </Text>               
     </View>                                                                            
 )                                                                                      
}                                                                                          
                                                                                        
export default SignIn  