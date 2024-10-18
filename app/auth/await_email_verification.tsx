import React, { useState, useEffect, useCallback } from 'react';                                                    
import { View, Text, Button, TouchableOpacity } from 'react-native-ui-lib';                        
import tw from "@/tailwind";
import { useRouter, useFocusEffect } from "expo-router";

import { auth } from "@/firebaseConfig";
import { sendEmailVerification } from "firebase/auth";

import Toast from 'react-native-toast-message';


const AwaitEmail = () => {  
    const router = useRouter();
    const [emailTimeout, setEmailTimeout] = useState(false);
    const [emailVerified, setEmailVerified] = useState(auth.currentUser?.emailVerified);

    // Polling function to check email verification status
    useEffect(() => {
        if (!auth.currentUser) {
            Toast.show({
                type: "error",
                text1: "You need to be authenticated to access this screen"
            })
            return
        }

        const interval = setInterval(async () => {
            await auth.currentUser.reload(); // Refresh user data
            if (auth.currentUser.emailVerified) {
                setEmailVerified(true);  // Update the state if the email is verified
                clearInterval(interval); // Stop polling once email is verified
                Toast.show({
                  type: "success",
                  text1: `Your email ${auth.currentUser.email} was verified`,
                  text2: "Click continue to finish setup",
                  textStyle: tw`poppins`,
                  visibilityTime: 5000,
                })
            }
        }, 5000);  // Check every 5 seconds

        return () => clearInterval(interval);  // Clear the interval on unmount
    }, []);

    const handleResendEmail = async () => {
        try {
            await sendEmailVerification(auth.currentUser);
            console.log("Resent email");

            // Disable the resend button for 3 seconds
            setEmailTimeout(true);

            setTimeout(() => {
                setEmailTimeout(false);  // Re-enable the button after 3 seconds
            }, 6000);
        } catch (error) {
            console.log("Error sending verification email: ", error);
        }
    };

    return (                                                                               
        <View style={tw`bg-white flex-1 p-6 justify-between`}> 
            <View style={tw`mb-4`} >
                <Text style={tw`text-2xl mb-6`} poppinsMedium center>Verify your email</Text>   
                {emailVerified ? 

                <Text poppins style={tw`text-gray-500`} center >Please click button below to continue</Text>    
                :

                <Text poppins style={tw`text-gray-500`} center >Please check your email and verify to continue</Text>    
                }
            </View> 
            <View>
                <Button 
                    label="Continue" 
                    poppins
                    onPress={() => router.push("auth/upload_car_details")} 
                    style={tw`btn`}
                    disabled={!emailVerified}  // Disable button if email is not verified
                />     
                {!emailVerified &&
                <View style={tw`flex-row items-center`}>
                    <Text poppins style={tw`py-3 my-3 flex-1`}>
                        Didn't receive the email verification link?
                    </Text>    

                    {!emailTimeout && ( // Only show the button if timeout has expired
                        <TouchableOpacity onPress={handleResendEmail}>
                            <Text poppinsMedium style={tw`text-green-600 py-2`} > Resend Email</Text>
                        </TouchableOpacity>
                    )}
                </View>
                }
            </View>                                                           
        </View>                                                                            
    );                                                                                      
};                                                                                          
                                                                                        
export default AwaitEmail;
