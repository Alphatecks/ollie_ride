import React, { useState, useEffect } from 'react'                                                    
import { View, Text, TextField, Button } from 'react-native-ui-lib'    
import { ActivityIndicator } from "react-native"                    
import tw from "@/tailwind"
import { Link, useRouter } from "expo-router"
import Car from "@/assets/car.svg"
import AntDesign from '@expo/vector-icons/AntDesign';

import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig"

import ButtonLoader from "@/components/general/ButtonLoader"
// const db = getFirestore();

                                                                                        
const DriverVerification = () => {  

	const router = useRouter()  
    const [isApproved, setIsApproved] = useState<boolean>(false)

    useEffect(()=>{
        let unsubscribe;

        const checkApproved = async() => {
            try{
                const userDocRef = doc(db, "users", user.uid)

                 unsubscribe = onSnapshot((userDocRef), (docSnapshot)=>{
                    if (docSnapshot.exists()){
                    const userData = docSnapshot.data()
                    console.log(userData, "isApproved: ", userData?.isApproved)
                    setIsApproved(userData?.isApproved ? true: false)
                     }
                    else {
                        console.log("Error, doc does not exists.")
                    }
                })

                }
            catch(e){
                console.log("Error occured: ", e)
            }
        }
        checkApproved()

        return () => {
              if (unsubscribe) unsubscribe(); // Ensure unsubscribe exists before calling
            };
    }, [])

    const user = auth.currentUser                                           
                                                                                        
	const handleDriverVerification = async () => {

	};

                                                                                        
 return (                                                                               
     <View style={tw`bg-white flex-1 p-6 justify-between`}> 
        {
            isApproved ?
            <View style={tw`items-center gap-3`}>
                <AntDesign name="checkcircle" size={100} color="green" />
                <Text poppins h2 center >Approved!!</Text>
                <Text poppins center>You are approved! Please click the button below to sign in.</Text>
            </View>

            :
        <View style={tw`items-center gap-5`}>
            {/*Image here*/}
            <Car/>
            <Text poppins h2 center >Please Wait</Text>
            <Text poppins center>We're reviewing your details, we'll get back to you shortly</Text>
        </View> 
        }

        {!isApproved && 
            <View>
                <ActivityIndicator size = "xlarge" color = "red" />
            </View>
        }
        
        {isApproved && 
         <Button label="Continue" 
         poppins
         outline
         onPress={()=> router.push("(tabs)")} 
         style={tw`btn`}

         // disabled = {!email || !password ? true: false}
          />                 
        }
     </View>                                                                            
 )                                                                                      
}                                                                                          
                                                                                        
export default DriverVerification  