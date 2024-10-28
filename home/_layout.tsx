import React, { useRef, useCallback, useState } from 'react'
import { View, Text } from 'react-native'
import { Stack, useRouter, Slot } from "expo-router"
import tw from "@/tailwind"

import AntDesign from '@expo/vector-icons/AntDesign';

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'; // Importing Gorhom Bottom Sheet for the drawer


const Layout = () => {
	const router = useRouter()

	// console.log(router)

	  // Bottom sheet reference
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["25%", "50%", "70%", "90%"]; // Snap points for the bottom sheet

  // Handle bottom sheet changes (logs the index when the sheet changes position)
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    /*
    if the index === -1 that means the bottom sheet is closed set all state flows to false to 
    start afresh.
    FUTURE: Save state of the flow so user can restart where they left off
    */

    if (index === -1){

    }
  }, []);

  const handleBottomSheetClose = () => {
    /* This close the bottom sheet is opened. */
      bottomSheetRef.current?.close();
  };

  const handleBottomSheetOpen = () => {
    /* This close the bottom sheet is opened. */
      bottomSheetRef.current?.snapToIndex(1);
  };

	return (
		<>	
			<Text style={tw`bg-red-300 p-3 my-3`}
			onPress = {handleBottomSheetOpen}
			>This the header</Text>
			
			<Text style={tw`bg-red-300 p-3 my-3`}>This the Footer</Text>

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