import React, { useRef, useCallback, useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { Stack, useRouter, Slot, usePathname } from "expo-router"
import tw from "@/tailwind"

import AntDesign from '@expo/vector-icons/AntDesign';

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'; // Importing Gorhom Bottom Sheet for the drawer


const Layout = () => {
	const router = useRouter()
	const pathname = usePathname()
	console.log("pathname: ", pathname)
	
	// console.log(router)
	
	useEffect(() => {
		if (pathname === "/bottomsheet2") {
			// Allow the bottomsheet to render and mount before opening
			// This is a workaround for the issue where the bottomsheet opens before it is mounted
			setTimeout(() => {
				handleBottomSheetOpen();
				console.log("opened in setTimeout")
			} , 1000)

			handleBottomSheetOpen();
			console.log("opened in useEffect")
			console.log("pathname from useEffect: ", pathname)
		} else {
		  handleBottomSheetClose();
		}
	  }, []);

	  // Bottom sheet reference
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["25%", "50%", "70%", "90%"]; // Snap points for the bottom sheet

  // Handle bottom sheet changes (logs the index when the sheet changes position)
	const handleSheetChanges = useCallback((index: number) => {
		console.log('handleSheetChanges', index);
		if (index === -1){
		}
	}, []);


	const handleBottomSheetClose = () => {
		bottomSheetRef.current?.close();
	};
	
	const handleBottomSheetOpen = () => {
		bottomSheetRef.current?.snapToIndex(0); // Collapse instead of -1
	};

	return (
		<>	
			<Text style={tw`bg-red-300 p-3 my-3`}
			onPress = {handleBottomSheetOpen}
			>Open</Text>
			
			<Text style={tw`bg-red-300 p-3 my-3`} onPress={handleBottomSheetClose}>Close</Text>

			<BottomSheet
	        ref={bottomSheetRef}
	        onChange={handleSheetChanges}
	        snapPoints={snapPoints}
	        enablePanDownToClose={true}
	        initialSnapIndex={-1}
	        index={-1} 
	      >
	        <BottomSheetView style={tw`p-4`}>
	        	<View>    
		            <Slot />
	           </View>
	        </BottomSheetView>
	      </BottomSheet>
		</>
	)
	// return (
	// 	<Stack screenOptions={{ 
	// 		headerTitleStyle: {fontFamily: "Poppins_400Regular", fontSize: 20},
	// 		headerTitleAlign: "center",
	// 		headerLeft: ({color}) => (<AntDesign name="left" size={24} color={color} onPress = {()=> router.back()} />)
	// 	 }} >
	// 		<Stack.Screen name="index" options = {{ 
	// 			headerShown: false, 
	// 			title: "Chats",
	// 			headerStyle: {elevation: 0, border: 0},
	// 		}} 
	// 		/>	
	// 	</Stack>
	// )
}

export default Layout