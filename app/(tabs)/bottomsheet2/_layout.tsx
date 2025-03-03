import React, { useRef, useCallback, useState, useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { Stack, useRouter, Slot, usePathname } from "expo-router"
import tw from "@/tailwind"

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'; // Importing Gorhom Bottom Sheet for the drawer
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { getNearbyPlaces, getNearbyPlaces2 } from "@/utils/googleAPI";
import { Trip } from '@/types';
import { Image } from 'react-native-ui-lib';
import { getDistanceFromLatLonInMeters } from '@/utils/calculations';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useTripStore } from '@/store/tripStore';


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
	//   ------ UNCOMMENT THIS TO FILL UP THE FIREBASE STORE WITH DUMMY DATA ----
	//   getNearbyPlaces2(userLocation.coords.latitude, userLocation.coords.longitude)
	  setLocation(userLocation);
	  setRegion({
		latitude: userLocation.coords.latitude,
		longitude: userLocation.coords.longitude,
		latitudeDelta: 0.005,
		longitudeDelta: 0.005,
	  });
  
	  try {
		// Reference the "trips" collection where driverId is null
		const tripsCollection = collection(db, "trips");
		const q = query(tripsCollection, where("driverId", "==", null));
  
		// Real-time listener
		const unsubscribe = onSnapshot(q, (snapshot) => {
		  const trips: Trip[] = snapshot.docs.map(doc => ({
			tripId: doc.id,
			...doc.data(),
		  })) as Trip[];
  
		  // Filter trips within 3 km
		  const nearbyTrips = trips.filter(trip =>
			getDistanceFromLatLonInMeters(
			  userLocation.coords.latitude,
			  userLocation.coords.longitude,
			  trip.latitude,
			  trip.longitude
			) <= 3000
		  );

		  console.log(nearbyTrips)
  
		  setAvailableTrips(nearbyTrips);
		});
  
		// Clean up listener on unmount
		return () => unsubscribe();
	  } catch (error) {
		console.error("Failed to fetch trips:", error);
	  }
	};
  
	fetchLocationAndSubscribeToTrips();
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

	const handleTripMarkerClicked = (trip: Trip) => {
		setSelectedTrip(trip);

		handleBottomSheetOpen()
		// router.push({pathname: "/b", })
		console.log("Trip clicked: ", trip.tripId)
	}

	return (
		<>	
			{/* Check if availbale trips has been fetched! */}
			{availableTrips.length < 0 &&
				<View style={tw`bg-green-300 px-2 py-1 items-center justify-center`}>
					<Text style={tw`poppins`} >Checking Available Trips in your location...</Text>
					<ActivityIndicator />
				</View>
			}
			{tripAccessCode &&
				<View style={tw`bg-green-300 px-2 py-1 items-center justify-center`}>
					<Text style={tw`poppins`} >Your trip access code: {tripAccessCode} </Text>
				</View>
			}
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
				onPress={() => handleTripMarkerClicked(trip)}
			>
				<Image
					source={{ uri: url, cache: 'only-if-cached' }} 
					style={tw`h-12 w-12 rounded-full border-2 border-white`} 
					resizeMode="cover"
					/>
				{/* <Image source={{ uri: url }} style={tw`h-12 w-12 rounded-full border-2 border-white`} /> */}
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