import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
import { ridersData as riders } from "@/constants/Data"

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'; // Importing Gorhom Bottom Sheet for the drawer

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // MapView and Marker from react-native-maps for showing the map and rider markers
import * as Location from 'expo-location'; // Importing expo-location for handling location permissions and fetching user location
import tw from "@/tailwind"; // TailwindCSS for styling

// Rider avatar URL
const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd";

// Sample rider data (latitude/longitude)
// const riders = [
//   { id: 1, latitude: 5.4798823, longitude: 7.4309101, fromLocation: "2a School Road", toLocation: "234 Wethey Ave. USA", fullName: "Sixtus Anyanwu", phoneNumber: "090104023", time: "10:30 am" }, // Within 100 meters
//   { id: 2, latitude: 5.4808823, longitude: 7.4319101, fullName: "Gedit Oliver", phoneNumber: "090104023", time: "1:01 am" }, // Outside 100 meters
//   { id: 3, latitude: 5.4785823, longitude: 7.4299101, fullName: "Maclom Xanderi", phoneNumber: "08789892345", time: "10:30" }, // Within 100 meters
// ];

export default function Index() {
  // State to hold the user's current location
  const [location, setLocation] = useState(null);
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

// useEffect to handle location fetching when the component is mounted
useEffect(() => {
  let isMounted = true; // Flag to prevent updates after unmounting

  (async () => {
    // Request location permissions
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    // Fetch current location
    let userLocation = await Location.getCurrentPositionAsync({});

    if (isMounted) {
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
    }
  })();

  return () => {
    isMounted = false; // Clean up after unmounting
  };
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

// Update riderList state only if memoizedRiders changes
useEffect(() => {
  if (memoizedRiders !== riderList) {
    setRiderList(memoizedRiders); // Set the calculated riders to riderList
  }
}, [memoizedRiders, riderList]); // Re-run only when memoizedRiders or riderList changes



  // console.log(riderList);

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
    console.log("The clicked rider: "); // Log the clicked rider data
    setSelectedRider(rider)
  };

  const handleInputChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    console.log(newOtp)
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
                style={tw`poppins`}
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
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        initialSnapIndex={-1}
        index={-1} 
      >
        <BottomSheetView style={tw`p-4`}>
          {/* Flow 1 for the ride acceptance for the driver
          
           */}
          <View>    
            <NotificationCardBase
              key={selectedRider?.id}
              name={selectedRider?.fullName}
              phoneNumber={selectedRider?.phoneNumber}
              time={selectedRider?.time}
            />
            <DoubleLocationCard locationDistance = "10 mins" 
            fromLocation = {selectedRider?.fromLocation}
            toLocation = {selectedRider?.toLocation}
            />
            <Text poppins style={tw`my-4`} >Price Range: N4000 - N5000 </Text>
            <View style={tw`flex-row gap-2`}>
              <Button label = "Accept" poppins style={tw`btn flex-grow`}/>
              <Button label = "Reject" poppins style={tw`btn flex-grow bg-[#BFC8D4] text-red-300`} color = "#0C3569"/>
            </View>
          </View>


          {/* Flow 2 for ride acceptance */}

     {/*     <View>
             <NotificationCardDriving
              name={selectedRider?.fullName}
              phoneNumber={selectedRider?.phoneNumber}
              time={selectedRider?.time}
            />
            <DoubleLocationCard locationDistance = "10 mins" 
            fromLocation = {selectedRider?.fromLocation}
            toLocation = {selectedRider?.toLocation}
            />
            <Button label = "Navigate To Customer Location" poppins style={tw`btn my-3`}/>
          </View>*/}

          {/*Flow 3 Request OTP from Customer*/}

         {/* <View>
            <View style={tw`items-center gap-3`}>
              <AntDesign name="checkcircle" size={100} color="green" />
              <Text poppinsMedium>Arrived at Customer's Location</Text>
              <Text poppins>{selectedRider?.fromLocation}</Text>
            </View>
            <Button label = "Request OTP" poppins style={tw`btn my-3`}/>
          </View>*/}

          {/* Flow 4 OTP Flow */}
     {/*     <View style={tw`gap-4`}>
            <Text poppinsMedium h2 center>Enter OTP</Text>     
            <Text poppins center>We sent a code to the customer’s phone number</Text>     
            <View style={tw`flex flex-row gap-2 justify-center`} center>
            {otp.map((value, index) => (
              <TextField
                key={index}
                style={tw`border-[1px] border-gray-400 py-4 rounded w-12 text-2xl text-center`}
                poppins
                labelColor="#3C2F3D"
                enableErrors
                keyboardType="numeric"
                maxLength={1}
                value={value}
                onChangeText={(text) => handleInputChange(text, index)}
              />
            ))}
          </View>
          <Text poppinsMedium center p1>Didn't get OTP?</Text>     
          <Text poppinsMedium center style={tw`text-blue-500 underline`}>Resend Code</Text>     
          </View>*/}

          {/* Flow 5 Start Trip */}
        {/*  <View>
             <NotificationCardDriving
              name={selectedRider?.fullName}
              phoneNumber={selectedRider?.phoneNumber}
              time={selectedRider?.time}
            />
            <DoubleLocationCard locationDistance = "10 mins" 
            fromLocation = {selectedRider?.fromLocation}
            toLocation = {selectedRider?.toLocation}
            />
            <Button label = "Start Trip" poppins style={tw`btn my-3`}/>
         </View>*/}

         {/* Flow 6 Await Payment */}

       {/* <View>
            <View style={tw`items-center gap-3`}>
              <AntDesign name="checkcircle" size={100} color="green" />
              <Text poppinsMedium>Arrived at Customer's Destination</Text>
              <Text poppins>{selectedRider?.fromLocation}</Text>
            </View>
            <Button label = "Initiate Payment" poppins style={tw`btn my-3`}/>
        </View>*/}

        <View>
            <View style={tw`items-center gap-3`}>
              <FontAwesome name="times-circle" size={100} color="red" />
              <Text poppinsMedium>Booking cancelled successfully</Text>
              <Text poppins center >Your booking with 
              <Text poppinsMedium> ID: 5467DFY778 </Text>
              has been cancelled successfully.</Text>
            </View>
            <Button label = "Continue" poppins style={tw`btn my-3`}/>
        </View>


        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
