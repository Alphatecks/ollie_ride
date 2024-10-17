import React, { useState } from 'react'                                                    
import { View, Text, TextField, Button } from 'react-native-ui-lib'                        
import tw from "@/tailwind"
import { Link, useRouter } from "expo-router"
import Car from "@/assets/car.svg"

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig"

import ButtonLoader from "@/components/general/ButtonLoader"
// const db = getFirestore();

                                                                                        
const DriverVerification = () => {  

	const router = useRouter()  

    const user = auth.currentUser                                           
                                                                                        
	const handleDriverVerification = async () => {
        try{
            const userDocRef = doc(db, "users", user.uid)
            const docSnapshot = await getDoc(userDocRef)

            if (docSnapshot.exists()){
                const userData = docSnapshot.data()
                console.log(userData, userData?.isApproved)
            }
            else {
                console.log("Error, doc does not exists.")
            }

        }
        catch(e){
            console.log("Error occured: ", e)
        }
	};

                                                                                        
 return (                                                                               
     <View style={tw`bg-white flex-1 p-6 justify-between`}> 
        <View style={tw`items-center gap-5`}>
            {/*Image here*/}
            <Car/>
            <Text poppins h2 center onPress={handleDriverVerification} >Please Wait</Text>
            <Text poppins center>We're reviewing your details, we'll get back to you shortly</Text>
        </View>
              
         <Button label="Sign In" 
         poppins
         outline
         onPress={()=> router.push("auth/sign_in")} 
         style={tw`btn`}

         // disabled = {!email || !password ? true: false}
          />                 
     </View>                                                                            
 )                                                                                      
}                                                                                          
                                                                                        
export default DriverVerification  