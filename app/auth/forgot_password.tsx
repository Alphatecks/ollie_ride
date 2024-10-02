import React, {useState} from 'react';
import { View, Text, Button, TextField, Colors } from 'react-native-ui-lib';
import tw from 'twrnc';
import { Link, useRouter } from "expo-router"
import ButtonLoader from "@/components/general/ButtonLoader"

import Toast from 'react-native-toast-message';

import { auth, db } from "@/firebaseConfig"
import { sendPasswordResetEmail } from "firebase/auth";


// This will send the psasword to the api to reset password
// https://api.ollieride.com/src/views/forgot_password.php?action=forgot_password
const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()


    const submitData = () => {  
      setLoading(true)

      console.log("Email: ", email)

      sendPasswordResetEmail(auth, email)

      .then(() => {
        console.log("Password reset email sent!");

        // Notify the user that the email has been sent

        Toast.show({
          type: "success",
          text1: `Check your email ${email} to reset your password!!`
        })

         setTimeout(()=>{
            router.push("auth/sign_in")
         }, 3000)

         setLoading(false)
         setEmail("")

      })
      .catch((error) => {
        setLoading(false)
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error sending password reset email:", errorCode, errorMessage);

        Toast.show({
          type: "error",
          text1: `An error occured: ${errorMessage}`
        })
        // Handle errors (invalid email, no user found, etc.)
      });

      setEmail("")
  
    }

        //     Toast.show({
        //   type: "success",
        //   text1: "We sent you a reset_code!"
        // })
        // router.push({
        //   pathname: "/auth/reset_password",
        //   params: { ...postData },
        // });

    // if (loading){
    //   return <Loader />
    // }

  return (
    <View style={tw`bg-white flex-1 p-4 pb-20 justify-between`}>
      <View>
        <Text style={tw`mb-6`} poppinsMedium h2>
          Enter your email to reset password
        </Text>
        <View>
          <TextField
                value = {email}
                onChangeText = {setEmail}
                labelColor = "#3C2F3D"
                placeholder = "Email"
                enableErrors
                validate={['required', 'email', (value) => value.length > 6]}
                validationMessage={['Field is required', 'Email is invalid', 'Password is too short']}
                hint = "A link will be sent to your email to reset your password"
                poppins
                rounded
              />
        </View>

      </View>
      {loading ? 
        <ButtonLoader />
      :
        <Button
        label="Reset Password"
        backgroundColor={Colors.primaryColor}
        style={tw`p-4 mt-4`}
        rounded
        poppins
        onPress={submitData}
        disabled = {!email ? true : false }
          />  
      }

    </View>
  );
};

export default ForgotPassword;
