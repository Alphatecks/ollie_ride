import React from 'react'
import { View, Text } from 'react-native'

import { Link, Tabs } from "expo-router"

const index = () => {
	return (
		<View>
			<Tabs.Screen 
			options = {{href: null}}
			/>
			<Text>Inside folder Index</Text>
			<Link href="(tabs)/inside/page2">Go to page 2</Link>
		</View>
	)
}

export default index