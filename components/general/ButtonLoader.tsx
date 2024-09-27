import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

const ButtonLoader = () => {
	return (
         <View style={tw`bg-gray-300 p-2 rounded-md my-2`} >
              <ActivityIndicator size = "large" color = "red" />
          </View>  
	)
}

export default ButtonLoader