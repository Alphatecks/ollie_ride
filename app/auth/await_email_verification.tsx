import React, { useState } from 'react';                                                    
import { View, Text, TextField, Button, TouchableOpacity } from 'react-native-ui-lib';                        
import tw from "@/tailwind";
import { Link, useRouter } from "expo-router";

import { auth } from "@/firebaseConfig";
import { sendEmailVerification } from "firebase/auth";

import ButtonLoader from "@/components/general/ButtonLoader";

const SignIn = () => {  
    const router = useRouter();
    const [emailTimeout, setEmailTimeout] = useState(false);
                                                                                
    const handleResendEmail = async () => {
        try {
            await sendEmailVerification(auth.currentUser);
            console.log("Resent email");

            // Disable the resend button for 3 seconds
            setEmailTimeout(true);

            setTimeout(() => {
                setEmailTimeout(false);  // Re-enable the button after 3 seconds
            }, 3000);  // Correct usage of setTimeout
        } catch (error) {
            console.log("Error sending verification email: ", error);
        }
    };

    return (                                                                               
        <View style={tw`bg-white flex-1 p-6 justify-between`}> 
            <View style={tw`mb-4`} >
                <Text style={tw`text-2xl mb-6`} poppinsMedium center>Verify your email</Text>   
                <Text poppins style={tw`text-gray-500`} center >Please check your email and verify to continue</Text>    
            </View> 
            <View>
                <Button 
                    label="Continue" 
                    poppins
                    onPress={()=> router.push("upload_car_details")} 
                    style={tw`btn`}
                    disabled={!auth.currentUser.emailVerified}  // Disable button if email is not verified
                />     

                <View style={tw`flex-row items-center`}>
                    <Text poppins style={tw`py-3 my-3`}>
                        Didn't receive the email verification link? 
                    </Text>    

                    {!emailTimeout && ( // Only show the button if timeout has expired
                        <TouchableOpacity onPress={handleResendEmail}>
                            <Text poppinsMedium style={tw`text-green-600 py-2`} > Resend Email</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>                                                           
        </View>                                                                            
    );                                                                                      
};                                                                                          
                                                                                        
export default SignIn;
