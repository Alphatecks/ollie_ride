import React from 'react'
import { View, Text } from 'react-native-ui-lib'
import tw from "@/tailwind"
import * as Progress from 'react-native-progress';


const Loader = () => {
	return (
        <View style={tw`bg-white flex-1 p-4 pb-20 items-center justify-center`}>
          <Progress.Circle size={30} indeterminate={true} borderWidth={3} />
        </View>
	)
}

export default Loader