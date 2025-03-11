import React, { useState } from 'react';
import { View, Text, Button, TextField, Colors } from 'react-native-ui-lib';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

const PhoneVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const router = useRouter();

  const allFilled = otp.every(value => value !== "");

  const handleInputChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = () => {
    const otpString = otp.join("");
    console.log("Entered OTP:", otpString);
    
    Toast.show({
      type: "success",
      text1: "OTP Submitted Successfully!"
    });
    
    router.replace("/home"); // Navigate to home screen or any other route
  };

  return (
    <View style={tw`bg-white flex-1 p-4 pb-20 justify-between`}>
      <View>
        <Text center style={tw`mb-6`} poppinsMedium h2>
          Phone Verification
        </Text>
        <Text center style={tw`mb-6`} poppins>
          Enter your OTP code
        </Text>
        <View style={tw`flex flex-row justify-between`} center>
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
              onChangeText={(text) => handleInputChange(text, index)}
            />
          ))}
        </View>
        <View style={tw`flex flex-row my-3`} center>
          <Text poppinsMedium>Didn’t receive code? </Text>
          <Text style={tw`text-[#008955]`} poppinsMedium>Resend again</Text>
        </View>
      </View>
      <Button
        label="Enter Code"
        backgroundColor={Colors.primaryColor}
        style={tw`p-4 mt-4`}
        rounded
        poppins
        onPress={handleSubmit}
        disabled={!allFilled}
      />
    </View>
  );
};

export default PhoneVerify;