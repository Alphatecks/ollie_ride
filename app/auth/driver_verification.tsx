import React, { useState } from 'react'                                                    
import { View, Text, TextField, Button } from 'react-native-ui-lib'                        
import tw from "@/tailwind"
import { Link, useRouter } from "expo-router"
import Car from "@/assets/car.svg"

import { doc, getDoc } from "firebase/firestore";

import ButtonLoader from "@/components/general/ButtonLoader"
// const db = getFirestore();

                                                                                        
const DriverVerification = () => {  

	const router = useRouter()                                             
                                                                                        
	const handleDriverVerification = async () => {


	};

                                                                                        
 return (                                                                               
     <View style={tw`bg-white flex-1 p-6 justify-between`}> 
        <View style={tw`items-center gap-5`}>
            {/*Image here*/}
            <Car/>
            <Text poppins h2 center>Please Wait</Text>
            <Text poppins center>We're reviewing your details, we'll get back to you shortly</Text>
        </View>
              
         <Button label="Sign In" 
         poppins
         outline
         onPress={()=> router.push("sign_in")} 
         style={tw`btn`}

         // disabled = {!email || !password ? true: false}
          />                 
     </View>                                                                            
 )                                                                                      
}                                                                                          
                                                                                        
export default DriverVerification  