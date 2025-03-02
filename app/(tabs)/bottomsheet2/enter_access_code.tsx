import { View, Text } from 'react-native-ui-lib'
import React, { useState } from 'react'
import { Button, TextField } from 'react-native-ui-lib'
import tw from '@/tailwind'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig'
import { Trip } from '@/types'

const Index = () => {
    const [otp, setOtp] = useState(["", "", "", "", ""]);
    const [showAccessCodeUI, setShowAccessCodeUI] = useState(false)
    const router = useRouter()

    const selectedTrip = {tripAccessCode: 20932}

    const handleInputChange = async (value: string, index: number, selectedTrip: Trip) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
      
        if (newOtp.length === 5) {
          // Convert OTP array to a single number
          const otpAsNumber = Number(newOtp.join(""));
          console.log("OTP as number:", otpAsNumber);
    
          if (otpAsNumber === selectedTrip?.tripAccessCode){
            console.log("OTP is correct!!")
            // try{
            //   const selectedTripRef = doc(db, "trips", selectedTrip?.id)
      
            //   await updateDoc(selectedTripRef, {
            //     status: "TRIP_CODE_VALID",
            //     showAccessCode: false
            //   })
            //   console.log("Updated Status of status to: TRIP_CODE_VALID")
    
            // }
            // catch(e){
            //   console.log(e)
            // }
          }
          
        }
      };
  return (
    <View>
       <View>
              <Text>You are at the customer location!! {selectedTrip?.id} </Text>
              <View style={tw`gap-4`}>
            <Text poppinsMedium h2 center>Enter Access Code</Text>     
            <Text poppins center>We sent a code to the Rider </Text>     
            <View style={tw`flex flex-row gap-2 justify-center`}>
            {otp.map((value, index) => (
              <TextField
                key={index}
                style={tw`border-[1px] border-gray-400 py-4 rounded w-12 text-2xl text-center`}
                poppins
                labelColor="#3C2F3D"
                enableErrors
                keyboardType="numeric"
                maxLength={1}
                value={value}
                onChangeText={(text) => handleInputChange(text, index, selectedTrip)}
              />
            ))}
          </View>
          <Text poppinsMedium center p1>Didn't get Access Code?</Text>     
          <Text poppinsMedium center style={tw`text-blue-500 underline`}
          // onPress = {handleResendOTP}
          >Resend Code</Text> 

          <Button label = "Verify Code" poppins style={tw`btn my-3`}
          onPress = {()=> router.push("/bottomsheet2/start_trip")}
          />

          </View>
          </View>
    </View>
  )
}

export default Index