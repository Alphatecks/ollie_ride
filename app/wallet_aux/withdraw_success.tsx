import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Text from "react-native-ui-lib/text"
import tw from 'twrnc'; 
import { useNavigation } from '@react-navigation/native'

import AntDesign from 'react-native-vector-icons/AntDesign';


const WithdrawSuccess = () => {
  const navigation = useNavigation()

  return (
    <View style={tw`flex-1 justify-around items-center bg-white`}>
      <View style={tw`items-center`}>
        <View style={tw`mb-5`}>
          <AntDesign name="checkcircle" size={100} color="green"/>
        </View>
        <Text style={tw`text-2xl font-bold text-black mb-2`} poppinsBold >$513.98 withdrawn successfully</Text>
        <Text style={tw`text-gray-500 mb-10`} poppins >Your money should be available in about 1 hour</Text>
      </View>
      <TouchableOpacity style={tw`p-6`}
        onPress = {() => navigation.navigate('MainTabs')}
      >
        <Text style={tw`text-blue-700 underline`} poppins >Back to home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WithdrawSuccess;
