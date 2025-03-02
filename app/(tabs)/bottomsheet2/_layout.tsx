import React, { useRef, useCallback, useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { Stack, useRouter, Slot, usePathname } from "expo-router"
import tw from "@/tailwind"

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'; // Importing Gorhom Bottom Sheet for the drawer
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { getNearbyPlaces, getNearbyPlaces2 } from "@/utils/googleAPI";
import { Trip } from '@/types';
import { Image } from 'react-native-ui-lib';


const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd";



const Layout = () => {
	const router = useRouter()
	const pathname = usePathname()
	const [location, setLocation] = useState()
	const [availableTrips, setAvailableTrips] = useState<Trip[]>([]);

	console.log("pathname: ", pathname)
	const [region, setRegion] = useState<Region>({
		latitude: 5.4788823,
		longitude: 7.4309201,
		latitudeDelta: 0.015,
		longitudeDelta: 0.0121,
	  });

	// console.log(router)
	
useEffect(() => {
	if (pathname === "/bottomsheet2") {
		// Allow the bottomsheet to render and mount before opening
		// This is a workaround for the issue where the bottomsheet opens before it is mounted
		setTimeout(() => {
			handleBottomSheetOpen();
			console.log("opened in setTimeout")
		} , 1000)

		console.log("opened in useEffect")
		console.log("pathname from useEffect: ", pathname)
	} else {
		handleBottomSheetClose();
	}

	}, []);

 useEffect(() => {

	console.log("Inside first useEffect...")

	const fetchLocation = async () => {
	  const { status } = await Location.requestForegroundPermissionsAsync();
	  if (status !== 'granted') {
		console.log('Permission to access location was denied');
	  } else {
		const userLocation = await Location.getCurrentPositionAsync({});

		console.log("User location: ", userLocation)

		setLocation(userLocation);
		setRegion({
		  latitude: userLocation.coords.latitude,
		  longitude: userLocation.coords.longitude,
		  latitudeDelta: 0.005,
		  longitudeDelta: 0.005,
		});
		try {
		  // const _availableTrips = await fetchAvailableTrips();
		  const places = await getNearbyPlaces2(location?.coords.latitude, location?.coords.longitude)
		 
		//   console.log("Places from useEffect: ", places) 
		  setAvailableTrips(places ? places : []);

		  // console.log("AVAILABLE TRIPS:", _availableTrips)
		} catch (error) {
		  console.error('Failed to fetch trips:', error);
		}
	  }
	};

	fetchLocation();
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
			<MapView
			style={tw`flex-1`}
			provider={PROVIDER_GOOGLE}
			loadingEnabled={true}
			showsUserLocation
			region={region}
			mapType="standard"
			>
				 {Array.isArray(availableTrips) && availableTrips.slice(0, 4).map((trip) => (
          <Marker
            key={trip.id}
            coordinate={{ latitude: trip.latitude, longitude: trip.longitude }}
            title={`Trip ${trip.id}`}
            // onPress={() => handleTripMarkerClicked(trip)}
          >
            <Image source={{ uri: url }} style={tw`h-12 w-12 rounded-full border-2 border-white`} />
          </Marker>
        ))}
			</MapView>
			
			<BottomSheet
	        ref={bottomSheetRef}
	        onChange={handleSheetChanges}
	        snapPoints={snapPoints}
	        enablePanDownToClose={true}
	        index={-1} 
	      >
	        <BottomSheetView style={tw`px-4 flex-1`}>

				<Slot />

	        </BottomSheetView>
	      </BottomSheet>
		</>
	)

}

export default Layout