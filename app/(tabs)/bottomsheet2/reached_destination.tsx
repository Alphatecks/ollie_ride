import { View, Text } from 'react-native'
import React from 'react'
import tw from '@/tailwind'


const Index = () => {
  return (
    <View>
      <Text>Index</Text>
        <View style={tw`flex-row justify-between mb-2`}>
            <Text>Rating:</Text>
            <Text>4.0</Text>
        </View>
    </View>
  )
}

export default Index