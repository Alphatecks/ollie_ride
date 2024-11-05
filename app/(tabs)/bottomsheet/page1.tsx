import React from 'react'
import { View, Text } from 'react-native'

import { Link, Stack } from "expo-router"

const index = () => {
	return (
		<View>
			{/*<Stack.Screen 
			options = {{href: null}}
			/>*/}
			<Text>Inside folder Index</Text>
			<Link href="(tabs)/bottomsheet/page2">Go to page 2</Link>
		</View>
	)
}

export default index