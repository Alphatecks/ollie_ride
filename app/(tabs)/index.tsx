import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {ActivityIndicator, Alert, TouchableOpacity} from "react-native"

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { View, TextInput, Image } from "react-native";
import Avatar from 'react-native-ui-lib/avatar'
import Text from 'react-native-ui-lib/text'
import {TextField} from 'react-native-ui-lib'
import Button from 'react-native-ui-lib/button'

import { getDistanceFromLatLonInMeters } from "@/utils/calculations"; // Utility to calculate distance between two lat/lon points
import NotificationCardBase from "@/components/notification/NotificationCardBase";
import { NotificationCardDriving } from "@/components/notification/NotificationCardBase";

import DoubleLocationCard from "@/components/home/DoubleLocationCard";
import { ridersData2 as riders } from "@/constants/Data"

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'; // Importing Gorhom Bottom Sheet for the drawer

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // MapView and Marker from react-native-maps for showing the map and rider markers
import * as Location from 'expo-location'; // Importing expo-location for handling location permissions and fetching user location
import tw from "@/tailwind"; // TailwindCSS for styling

import { getNearbyPlaces } from "@/utils/googleAPI"
import {createTrip, fetchAvailableTrips} from "@/utils/booking"

import Toast from "react-native-toast-message"

// Rider avatar URL
const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd";


export default function Index() {
  // State to hold the user's current location
  const [location, setLocation] = useState(null);
  const [riders, setRiders] = useState([]);
  // Rider Acceptance Flow


  /*
    TRIP_AVAILABLE
    TRIP_ACCEPTED
    DRIVER_AT_CUSTOMER_LOCATION
    ACCESSCODE_SENT
    ACCESSCODE_VALID
    TRIP_STARTED
    TRIP_ENROUTE
    TRIP_FINISHED
    TRIP_CANCELED
  */

  const [otp, setOtp] = useState(["", "", "", ""]);


  // Initial region to display on the map
  const [region, setRegion] = useState({
    latitude: 5.4788823,
    longitude: 7.4309201,
    latitudeDelta: 0.015, // Zoom level (latitudinal)
    longitudeDelta: 0.0121, // Zoom level (longitudinal)
  });
  const [errorMsg, setErrorMsg] = useState(null); // Error message for location permission

  const [riderList, setRiderList] = useState([]); // List of riders with distances

  const [selectedRider, setSelectedRider] = useState({}); // List of riders with distances

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      } else {
        let userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
        setRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        // Get nearby Places of the users current location

        console.log("Getting nearby places...")
        // const allNearbyPlaces = await getNearbyPlaces(userLocation.coords.latitude, userLocation.coords.longitude)

        // console.log("From Index: ", allNearbyPlaces)
        // setRiders(allNearbyPlaces.slice(0, 5))
        // Test create a trip
        try {
          const trips = await fetchAvailableTrips();
          console.log('Fetched trips:', trips);
          setRiders(trips)
        } catch (error) {
          console.error('Failed to fetch trips:', error);
        }

      }
    };

    fetchLocation(); // Call the async function inside useEffect
  }, []); // Ensure it's an empty dependency array



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


  const handleInputChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    console.log(newOtp)
  };

  // Function to open the bottom sheet when a rider is clicked
  const handleRiderMarkerClicked = (rider) => {

    bottomSheetRef.current?.snapToIndex(0);  // Open the bottom sheet to the first snap point
    console.log("The clicked rider: ", rider); // Log the clicked rider data
    setSelectedRider(rider)

  };

  const handleRiderAccepted = () => {
    console.log("accepted")
  }

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
       {Array.isArray(riders) && riders.map((rider) => (
          <Marker
            key={rider.id}
            coordinate={{ latitude: rider.latitude, longitude: rider.longitude }}
            title={`Rider ${rider.id}`}
            onPress={() => handleRiderMarkerClicked(rider)}
            
          > 
          <Image source={{ uri: url }}  
          style={tw`h-12 w-12 rounded-full border-2 border-white`} />

          </Marker>
        ))}

      </MapView>

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
            <NotificationCardBase
              key={selectedRider?.id}
              name={selectedRider?.riderName}
              phoneNumber={selectedRider?.phoneNumber}
              time={selectedRider?.time}
            />
            <DoubleLocationCard locationDistance = "10 mins" 
            fromLocation = {selectedRider?.fromLocation}
            toLocation = {selectedRider?.toLocation}
            />
            <Text poppins style={tw`my-4`} >Price Range: N4000 - N5000 </Text>
            <View style={tw`flex-row gap-2`}>
              <Button label = "Accept" poppins style={tw`btn flex-grow`} onPress = {handleRiderAccepted(selectedRider)} />
              <Button label = "Reject" poppins 
              // onPress = {handleOnRejectPressed}
              style={tw`btn flex-grow bg-[#BFC8D4] text-red-300`} color = "#0C3569"/>
            </View>
          </View>

        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

