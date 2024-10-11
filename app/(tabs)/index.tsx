import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { View, TextInput, Image } from "react-native";
import Avatar from 'react-native-ui-lib/avatar'
import Text from 'react-native-ui-lib/text'

import { getDistanceFromLatLonInMeters } from "@/utils/calculations" // Utility to calculate distance between two lat/lon points

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'; // Importing Gorhom Bottom Sheet for the drawer

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // MapView and Marker from react-native-maps for showing the map and rider markers
import * as Location from 'expo-location'; // Importing expo-location for handling location permissions and fetching user location
import tw from "@/tailwind"; // TailwindCSS for styling

// Rider avatar URL
const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd"

// Sample rider data (latitude/longitude)
const riders = [
  { id: 1, latitude: 5.4798823, longitude: 7.4309101 }, // Within 100 meters
  { id: 2, latitude: 5.4808823, longitude: 7.4319101 }, // Outside 100 meters
  { id: 3, latitude: 5.4785823, longitude: 7.4299101 }, // Within 100 meters
];

export default function Index() {
  // State to hold the user's current location
  const [location, setLocation] = useState(null);
  // Initial region to display on the map
  const [region, setRegion] = useState({
    latitude: 5.4788823,
    longitude: 7.4309201,
    latitudeDelta: 0.015, // Zoom level (latitudinal)
    longitudeDelta: 0.0121, // Zoom level (longitudinal)
  });
  const [errorMsg, setErrorMsg] = useState(null); // Error message for location permission

  // useEffect to handle location fetching when the component is mounted
  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Fetch current location
      let userLocation = await Location.getCurrentPositionAsync({});

      // Only update the location if it's significantly different from the previous one
      if (!location || 
         (location.coords.latitude !== userLocation.coords.latitude || 
          location.coords.longitude !== userLocation.coords.longitude)) {
        setLocation(userLocation); // Set current location

        // Set region for the map to focus on the user's location
        setRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.005,  // Adjust for zoom level
          longitudeDelta: 0.005, // Adjust for zoom level
        });
      }
    })();
}, [location]); // Only re-run if the location changes

  // Memoizing the riders' data to avoid re-calculation on every render
  const memoizedRiders = useMemo(() => {
    if (!location) return riders; // Return the rider data if location is not available yet

    // Calculate the distance between each rider and the user's location
    return riders.map((rider) => {
      const distance = getDistanceFromLatLonInMeters(
        location.coords.latitude,
        location.coords.longitude,
        rider.latitude,
        rider.longitude
      );
      return { ...rider, distance }; // Add the calculated distance to each rider object
    });
}, [location?.coords.latitude, location?.coords.longitude]); // Depend on user's latitude and longitude

  // Bottom sheet reference
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["25%", "50%", "90%"]; // Snap points for the bottom sheet

  // Handle bottom sheet changes (logs the index when the sheet changes position)
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // Function to open the bottom sheet when a rider is clicked
  const handleOpen = (rider) => {
      bottomSheetRef.current?.snapToIndex(0);  // Open the bottom sheet to the first snap point
      console.log("The clicked rider: ", rider); // Log the clicked rider data
    };


  return (
    <View style={tw`bg-white flex-1`}>
      <MapView
        style={tw`flex-1`}
        provider={PROVIDER_GOOGLE}
        loadingEnabled={true}
        showsUserLocation
        region={region}
        mapType="standard"
      >
        {location && (
          <>
            {memoizedRiders.map((rider) => (
              <Marker
                key={rider.id}
                coordinate={{ latitude: rider.latitude, longitude: rider.longitude }}
                title={`Rider ${rider.id}`}
                style = {tw`poppins`}
                onPress={() => handleOpen(rider)}
              >
                <Image source={{ uri: url }} style={tw`h-12 w-12 rounded-full border-2 border-white`} />
              </Marker>
            ))}
          </>
        )}
      </MapView>

      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints = {snapPoints}
        enablePanDownToClose = {true}
      >
        <BottomSheetView>
          <Text>Awesome 🎉</Text>
          <Text>Awesome 🎉</Text>
          <TextInput style={tw`poppins`} placeholder="Search" />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}