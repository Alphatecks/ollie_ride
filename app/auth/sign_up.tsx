import React, { useState } from 'react'                                                    
import { View, Text, TextField, Button } from 'react-native-ui-lib'                        
import tw from "@/tailwind"
import { Link, useRouter } from "expo-router"

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {db} from "@/firebaseConfig"

                                                                                        
const SignUp = () => {  

	const router = useRouter()

	const [email, setEmail] = useState('')                                                 
	const [password, setPassword] = useState('')                                           
	const [error, setError] = useState('')                                                 
                                                                                        
	const handleSignUp = async () => {
	    try {
	        const auth = getAuth();
	        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	        const user = userCredential.user;  // Get the registered user object

            const userId = user.uid
            console.log("userID: ", userId)

            await setDoc(doc(db, "Users", userId), {
              total_balance: 0,
              is_admin: true,
              payment_methods: [], // Can be filled in later
              trades: [],          // Can be filled in later
              wallet: null,        // Only for admins, can be filled later
            });

            router.push("(tabs)");
	        // Handle successful sign-up (e.g., navigate to home screen)
	    } catch (error) {
	        setError(error.message);
	    }
	};

                                                                                        
 return (                                                                               
     <View style={tw`bg-white flex-1 p-6`}> 
        <View style={tw`mb-4`} >
             <Text style={tw`text-2xl mb-6`} interMedium >Create an account</Text>   
             <Text inter style={tw`text-gray-500`} >Lets guide you throught the steps of creating an account on gateway</Text>    
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
         <Button label="Sign Up" 
         inter
         onPress={handleSignUp} 
         style={tw`btn`}
         disabled = {!email || !password ? true: false}
          />             
         {error ? <Text style={tw`text-red-500`}>{error}</Text> : null}  

         <Text interMedium>
                Have an account?
                <Link href="auth/sign_in" asChild >
                    <Text style={tw`text-gateway-base`}> Sign In</Text>
                </Link>
        </Text>               
     </View>                                                                            
 )                                                                                      
}                                                                                          
                                                                                        
export default SignUp  