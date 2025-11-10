import React, { useState, useRef } from 'react';
import { View, Text, TextField, Button, Colors } from 'react-native-ui-lib';
import { SafeAreaView, TouchableOpacity, Keyboard, Platform } from 'react-native';
import tw from '../../tailwind';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const PhoneVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const inputRefs = useRef([]);

  const allFilled = otp.every(value => value !== "");
  const email = route.params?.email;

  const handleInputChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next field
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Generate and send OTP code to Firestore for verification
  const generateOTP = () => {
    return Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit code
  };

  // Send OTP to Firestore (backend will send email)
  const sendOTP = async () => {
    const otpCode = generateOTP();
    console.log(`OTP Code for ${email}: ${otpCode}`);
    
    try {
      // Store OTP in Firestore with email as key
      const { doc, setDoc } = await import("firebase/firestore");
      const { db } = await import("../../firebaseConfig");
      
      await setDoc(doc(db, "otps", email), {
        code: otpCode,
        email: email,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        verified: false
      });

      // TODO: Trigger Firebase Cloud Function or Extension to send email
      // For now, the OTP is stored in Firestore and logged to console
      // You need to set up a Cloud Function or Extension to actually send the email
      
      console.log(`📧 OTP ${otpCode} stored for ${email}`);
      
      setOtpSent(true);
      Toast.show({
        type: "info",
        text1: "Check your email",
        text2: `OTP sent to ${email}`,
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      Toast.show({
        type: "error",
        text1: "Failed to send OTP",
        text2: "Please try again"
      });
    }
  };

  const handleResend = async () => {
    await sendOTP();
  };

  React.useEffect(() => {
    // Auto-send OTP when screen loads
    if (!otpSent && email) {
      sendOTP();
    }
  }, [email]);

  const handleSubmit = async () => {
    const otpString = otp.join("");
    console.log("Entered OTP:", otpString);
    
    try {
      // Verify OTP against Firestore
      const otpDocRef = doc(db, "otps", email);
      const otpDoc = await getDoc(otpDocRef);
      
      if (otpDoc.exists()) {
        const otpData = otpDoc.data();
        
        // Check if code matches
        if (otpData.code === otpString) {
          // Check if not expired
          const expiresAt = new Date(otpData.expiresAt);
          if (new Date() < expiresAt) {
            // OTP verified
            Toast.show({
              type: "success",
              text1: "Email verified successfully!"
            });
            
            navigation.navigate('SetPassword', {
              ...route.params,
              isEmailVerified: true
            });
          } else {
            Toast.show({
              type: "error",
              text1: "OTP has expired",
              text2: "Please request a new code"
            });
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Invalid OTP code",
            text2: "Please check and try again"
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "No OTP found",
          text2: "Please request a new code"
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Toast.show({
        type: "error",
        text1: "Verification failed",
        text2: "Please try again"
      });
    }
  };


  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <View style={tw`flex-1 justify-between`}>
        {/* Back Button Header */}
        <View style={tw`px-6 pt-4`}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={tw`flex-row items-center mb-8`}
          >
            <AntDesign name="left" size={20} color="#374151" />
            <Text style={[tw`ml-2 text-gray-700`, {fontFamily: 'Poppins-Regular'}]}>Back</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={[tw`text-center text-2xl font-bold text-gray-800 mb-3`, {fontFamily: 'Poppins-Bold'}]}>
            Verify Email
          </Text>

          {/* Subtitle */}
          <Text style={[tw`text-center text-base text-gray-600 mb-12`, {fontFamily: 'Poppins-Regular'}]}>
            Enter your OTP code
          </Text>
          
          {/* OTP Input Fields */}
          <View style={tw`flex-row justify-center gap-3 mb-8`}>
            {otp.map((value, index) => (
              <TextField
                key={index}
                ref={(ref) => inputRefs.current[index] = ref}
                style={tw`border border-gray-300 h-14 w-14 rounded-lg text-2xl text-center`}
                poppins
                labelColor="#3C2F3D"
                keyboardType="numeric"
                maxLength={1}
                value={value}
                onChangeText={(text) => handleInputChange(text, index)}
              />
            ))}
          </View>

          {/* Resend Code */}
          <View style={tw`flex-row justify-center mb-8`}>
            <Text poppins>Didn't receive code? </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text style={tw`text-blue-600`} poppinsMedium>Resend again</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Verify Button */}
        <View style={tw`px-6 pb-8`}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!allFilled}
            style={[
              tw`rounded-lg py-4 items-center justify-center`,
              { backgroundColor: allFilled ? Colors.primaryColor : '#D1D5DB' }
            ]}
          >
            <Text style={[tw`text-white text-base font-bold`, {fontFamily: 'Poppins-Bold'}]}>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PhoneVerify;