import React, { useRef, useCallback, useState, useEffect } from 'react'
import { View, Text, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { Stack, useRouter, Slot, usePathname } from "expo-router"
import tw from "@/tailwind"

import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'; // Importing Gorhom Bottom Sheet for the drawer
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { getNearbyPlaces, getNearbyPlaces2 } from "@/utils/googleAPI";
import { Trip } from '@/types';
import { Image, TextField, TouchableOpacity } from 'react-native-ui-lib';
import { getDistanceFromLatLonInMeters } from '@/utils/calculations';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useTripStore } from '@/store/tripStore';
import SearchSVG from "@/assets/search.svg"
import ScheduleSVG from "@/assets/schedule.svg"
import { ScrollView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd";

// deleteAllTrips().then((res)=> console.log("Deleted!!"))

const Layout = () => {
	const router = useRouter()
	const pathname = usePathname()
	const [location, setLocation] = useState()
	const [availableTrips, setAvailableTrips] = useState<Trip[]>([]);


	const { setSelectedTrip, selectedTrip } = useTripStore();

	const tripAccessCode = selectedTrip?.tripAccessCode

	console.log("pathname: ", pathname)
	const [region, setRegion] = useState<Region>({
		latitude: 5.4788823,
		longitude: 7.4309201,
		latitudeDelta: 0.015,
		longitudeDelta: 0.0121,
	  });


useEffect(() => {
	// Subscribe to trips on firebase and filter by 3km radius
	const fetchLocationAndSubscribeToTrips = async () => {
	  const { status } = await Location.requestForegroundPermissionsAsync();
	  if (status !== "granted") {
		console.log("Permission to access location was denied");
		return;
	  }
  
	  const userLocation = await Location.getCurrentPositionAsync({});
	  setLocation(userLocation);
	  setRegion({
		latitude: userLocation.coords.latitude,
		longitude: userLocation.coords.longitude,
		latitudeDelta: 0.005,
		longitudeDelta: 0.005,
	  });
  	};
  
	// fetchLocationAndSubscribeToTrips();
  }, []);


	  // Bottom sheet reference
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["25%", "50%", "70%", "100%"]; // Snap points for the bottom sheet

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

	const handleTripMarkerClicked = (trip: Trip) => {
		setSelectedTrip(trip);

		handleBottomSheetOpen()
		// router.push({pathname: "/b", })
		console.log("Trip clicked: ", trip.tripId)
	}

	return (
		<>	

				<TouchableOpacity style={tw`absolute top-10 z-2 bg-white mx-6 rounded-md`}
				onPress={handleBottomSheetOpen}
				>
					<View style={tw`flex-row items-center p-3`}>
						<Feather  name='plus-circle' size={20} />
					</View>
				</TouchableOpacity>
				

				<View style={tw`absolute top-30 z-2 bg-white px-2 mx-6 rounded-md py-1 left-0 right-0`}>
					<TouchableOpacity 
					style={tw`flex-row items-center p-3 flex-1 gap-2`}
					// onPress={handleBottomSheetOpen}
					// onPress={()=> router.push("/auth/profile")}
					>
						<ScheduleSVG />
						<Text style={tw`poppins`}>Ride schedules</Text>
					</TouchableOpacity>
				</View>


			<MapView
			style={tw`flex-1`}
			provider={PROVIDER_GOOGLE}
			loadingEnabled={true}
			showsUserLocation
			region={region}
			mapType="standard"
			>
	
			</MapView>
			
			<BottomSheet
	        ref={bottomSheetRef}
	        onChange={handleSheetChanges}
	        snapPoints={snapPoints}
	        enablePanDownToClose={true}
	        index={-1} 
			containerStyle = {tw`z-3 flex-1`} // Make the bottom sheet show above the absolute contents in the map
			keyboardBehavior="interactive"
			keyboardBlurBehavior="restore"
			android_keyboardInputMode="adjustResize"  // Add this for Android
			enableDynamicSizing={false}
	      >
		
			<BottomSheetView style={tw`px-4 flex-1`}>
				<Slot />
			</BottomSheetView>
				
	      </BottomSheet>
		</>
	)

}

export default Layout