import React, { useState } from 'react'
import { View, Text, TextField, Button, Colors, Checkbox, TouchableOpacity } from 'react-native-ui-lib'
import { KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Dimensions } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'

import tw from "../../../tailwind"
import { useNavigation } from '@react-navigation/native'

import GenderPicker from '../../components/general/GenderPicker'
import PhoneNumberInput from '../../components/general/PhoneNumberInput'
import Toast from 'react-native-toast-message'
import ButtonLoader from '../../components/general/ButtonLoader'



const SignUp = () => {

    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [error, setError] = useState('')
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [toggle, setToggle] = useState<boolean>(false)


    const [countryCode, setCountryCode] = useState('+880');
    const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
  

    
  

    const handleCountryChange = (country: { code: string }) => {
      setCountryCode(country.code);

      console.log(country)
    };

    const handleSignUp = () => {
        if (!email || !phoneNumber || !selectedGender || !name) {
          Toast.show({
            type: "error",
            text1: "All fields are required!",
          });
          return;
        }
        

        console.log(email, phoneNumber, selectedGender, name )

        navigation.navigate('PaymentDetails', {
          pathname: "/auth/set_password",
          params: {
            email,
            phoneNumber,
            gender: selectedGender,
            full_name: name,
          },
        });
      };
      


    const handleGenderSelect = (gender: string) => {
        setSelectedGender(gender);
        console.log("Selected Gender:", gender);
    };


    return (
        <KeyboardAvoidingView style={tw`bg-white flex-1 p-3`}>
            <ScrollView showsVerticalScrollIndicator={false} >

                <View style={tw`mb-4`} >
                    <Text style={tw`text-2xl mb-6`}
                        onPress={() => navigation.navigate('UploadCarDetails')}
                        poppinsMedium >Sign up with your email or 
                    phone number
                    </Text>
                    <Text poppins style={tw`text-gray-500`} >Lets guide you throught the steps of creating an account on Ollie Ride</Text>
                </View>
                <TextField
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    rounded
                    poppins
                    style={tw`input`}
                />

                <TextField
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={tw`input`}
                    rounded
                    poppins
                />
                
                <PhoneNumberInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onChangeCountry={handleCountryChange}
                defaultCountry="+880"
                errorMessage={error}
                isValid={isValid}
                placeholder="Your mobile number"
                containerStyle={tw`rounded-sm`}
                />
                <GenderPicker onSelectGender={handleGenderSelect} selectedGender={selectedGender} />

                <View style={tw`flex-row gap-x-3 my-4`}>
                    <Checkbox
                    style={tw`border-gray-300`}
                    value={toggle} 
                    onValueChange={() => setToggle(!toggle)}
                    />
                    <Text style={tw`flex-1 text-gray-400`} poppinsMedium>
                    By signing up, you agree to the
                    <Text style={tw`text-[${Colors.primaryColor}]`}> Terms of service </Text>
                    and
                    <Text style={tw`text-[${Colors.primaryColor}]`}> Privacy policy. </Text>
                    </Text>
                </View>
              
                {loading &&
                    <ButtonLoader />
                }

                {!loading &&
                    <Button label="Sign Up"
                        poppins
                        onPress={handleSignUp}
                        style={tw`${!email || !phoneNumber || !name || !selectedGender || !toggle ? 'btn bg-gray-300' : 'btn'}`}
                        disabled={!email || !phoneNumber || !name || !selectedGender || !toggle}
                    />
                }


                {error ? <Text style={tw`text-red-500`}>{error}</Text> : null}

                <Text poppinsMedium style={tw`my-4`} >
                    Have an account?
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <Text style={tw`text-ollie-base`}> Sign In</Text>
                    </TouchableOpacity>
                </Text>
            </ScrollView>

        </KeyboardAvoidingView>
    )
}

export default SignUp  