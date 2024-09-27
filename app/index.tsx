import React, { useState, useRef } from 'react'
import { FlatList, Dimensions } from 'react-native'
import { View, Text, PageControl } from 'react-native-ui-lib'
import tw from "twrnc"
import {SafeAreaView} from "react-native-safe-area-context"
import { Link } from "expo-router"

import OnboardingOne from "@/assets/images/o1.svg"
import OnboardingTwo from "@/assets/images/o4.svg"
import OnboardingThree from "@/assets/images/o3.svg"
import AntDesign from '@expo/vector-icons/AntDesign';


const Index = () => {

	const [currentIndex, setCurrentIndex] = useState(0)
	const [onboardingDone, setOnboardingDone] = useState(false)

	const flatListRef = useRef(null);

	const Data = [
		{
			title: "Direct Bank Transfer",
			subtitle: "Payments are made to your direct bank account once the money gets to us",
			svg: OnboardingOne
		},
		{
			title: "Instant Notification Every Offer",
			subtitle: "You get notified instantly anytime we update our rate and offer",
			svg: OnboardingTwo
		},
		{
			title: "Sell your USDT at Ease",
			subtitle: "We buy any amount of USDT in a seamless, fast and secure way.",
			svg: OnboardingThree
		},
	]
	const width = Dimensions.get('window').width;

	const handleScroll = (e) => {
		const index = Math.round(e.nativeEvent.contentOffset.x / width);

		if (index === 2) setOnboardingDone(true)

		setCurrentIndex(index)
		console.log("currentIndex: ", index)
	}

	const handleRenderItem = (data) => {
		return (
			<View style={tw.style("w-100 items-center justify-evenly gap-y-14")}>
				<data.item.svg width={300} height={300} />
				<View style={tw`gap-y-3`}>
					<Text interBold h2>{data.item.title}</Text>
					<Text inter p1>{data.item.subtitle}</Text>
				</View>
			</View>
		)
	}

	return (
		<SafeAreaView style={tw`flex-1 justify-around`}>
			<View style={tw`flex-grow`}>
				<FlatList 
					data={Data}
					renderItem={handleRenderItem}
					horizontal={true}
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					style={tw`w-100`}
					onMomentumScrollEnd={handleScroll}
					keyExtractor={(item, index) => index.toString()}
					ref={flatListRef}
				/>
			</View>
			<View style={tw`flex-row justify-between px-3 my-8`}>
				<PageControl numOfPages={3} currentPage={currentIndex} color = "gray" />
				{onboardingDone && 
					<Link asChild href="/home"> 
						<AntDesign name="rightcircle" size={40} color="gray" />
					</Link>
				}
			</View>
		</SafeAreaView>
	)
}

export default Index
