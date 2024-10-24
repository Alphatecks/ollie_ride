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
  const [isRiderMarkerClicked, setIsRiderMarkerClicked] = useState(false);
  const [isRiderAccepted, setIsRiderAccepted] = useState(false);
  const [isDriverAtRiderLocation, setIsDriverAtRiderLocation] = useState(false);
  // const [sendOTP, set] = useState(false);
  const [isOTPSentToRider, setIsOTPSentToRider] = useState(false);
  const [isOTPValid, setIsOTPValid] = useState(false);
  const [isTripStarted, setIsTripStarted] = useState(false);
  const [isTripStartedButtonClicked, setIsTripStartedButtonClicked] = useState(false);
  const [isRiderDestinationReached, setIsRiderDestinationReached] = useState(false);
  const [isTripFinished, setIsTripFinished] = useState(false);



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
      setIsRiderMarkerClicked(false)
      setIsDriverAtRiderLocation(false)
      setIsOTPSentToRider(false)
      setIsTripStarted(false)
      setIsRiderDestinationReached(false)
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
    resetAllTripState()

    bottomSheetRef.current?.snapToIndex(0);  // Open the bottom sheet to the first snap point
    console.log("The clicked rider: ", rider); // Log the clicked rider data
    setSelectedRider(rider)
    setIsRiderMarkerClicked(true)

  };
  const handleRiderAccepted = (selectedRider) => {

    /*
    if rider is accepted set the trip driver field to the currrent driver uid

    */

    console.log("Trip", selectedRider.id)
    // setIsRiderAccepted(true)
    // Remove the Rider acceptance component from view
    // setIsRiderMarkerClicked(false)

    // Toast.show({
    //   type: "success",
    //   text1: "You have started a trip!."
    // })

    // console.log("Trip started")
  }

  const handleIsDriverAtRiderLocation = () => {
    setIsDriverAtRiderLocation(true)
    // Remove from view {Flow 2}
    setIsRiderAccepted(false)

    Toast.show({
      type: "success",
      text1: "Arrived at location. Sending OTP..."
    })

    console.log("Driver At Customer Location, requesting OTP")
  }

  const handleSendOTPToCustomer = () => {
    // Use external API to send OTP to the particular customer number
    console.log("OTP sent to the Customer please enter the OTP to continue...")
    // Rmove Flow 3 from View
    setIsDriverAtRiderLocation(false)
    // Render the OTP component [Flow 4]
    setIsOTPSentToRider(true)
  }

  const handleResendOTP = () => {
    console.log("Resent OTP to the Customer phone number. please renter new OTP")
  }

  const handleVerifyOTP = () => {
    /*
    Check if OTP is valid here, if true remove Flow 4 and render Flow 5
    Else remain on the same flow till OTP is valid
    */
    console.log("Checking if OTP is valid...")
    setIsOTPSentToRider(false) // Remove Previous flow
    setIsTripStarted(true)
  }

  const handleTripStartedButtonClicked = () => {
    /*
    Once the "Start Trip button is clicked, change the button title to be "enroute"
    Then use geo location to check wether the driver has reached customer destination points
    if true, set the button to end trip
    */
    console.log("Trip started button pressed!! The Driver is driving to destination")
    setIsTripStartedButtonClicked(true)
  }

  const handleReachedRiderDestination = () => {
    /*
    On the useEffect check if customer destination has been reached and set this to true
    so user can initiate payment
    */
    setIsRiderDestinationReached(true)
    console.log("You have reached your destination!!")
    // Remove the previous flow from view
    setIsTripStarted(false)
  }

  const handleOnCancelIconPressed = () => {
    console.log("Pressed Icon to cancel Trip...")
    /*
    FUTURE TODO: Show a pop up to ask whether user is show they want to cancel
    then set all other states to false to restart flow.
    */

    Alert.alert(
      'Cancel Trip', // The title of the alert
      'Are you sure you want to cancel this trip?', // The message that will appear inside the alert
      [
        {
          text: 'Cancel', // Button label
          onPress: () => console.log('Cancel Pressed'), // What happens when the button is pressed
          style: 'cancel', // Button style ('default', 'cancel', 'destructive')
        },
        {
          text: 'OK', // Button label
          onPress: resetAllTripState, // What happens when the button is pressed
        },
      ],
      { cancelable: false } // Optionally, whether the user can dismiss the alert by tapping outside
    );

  }

  const handleOnRejectPressed = () => {
    resetAllTripState()
    Toast.show({
      type: "error",
      text1: "Rider request rejected."
    })
    console.log("Rejected")
  }

  const resetAllTripState = () => {
    console.log("Ok button from alert pressed")
    // Close bottomsheet
    handleBottomSheetClose()
    // Reset all states
    setIsRiderAccepted(false)
    setIsRiderMarkerClicked(false)
    setIsDriverAtRiderLocation(false)
    setIsOTPSentToRider(false)
    setIsTripStarted(false)
    setIsRiderDestinationReached(false)
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
          {/* Flow 1 for the ride acceptance for the driver
          
           */}
          {isRiderMarkerClicked && 
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
              onPress = {handleOnRejectPressed}
              style={tw`btn flex-grow bg-[#BFC8D4] text-red-300`} color = "#0C3569"/>
            </View>
          </View>

          }


          {/* Flow 2 for ride acceptance. 
          If Driver has accepted a ride then show this component where driver can call, message or cancel the ride

          */}

          {isRiderAccepted && 

            <View>
              <NotificationCardDriving
                name={selectedRider?.riderName}
                phoneNumber={selectedRider?.phoneNumber}
                time={selectedRider?.time}
                onCancelIconPressed = {handleOnCancelIconPressed}
              />
              <DoubleLocationCard locationDistance = "10 mins" 
              fromLocation = {selectedRider?.fromLocation}
              toLocation = {selectedRider?.toLocation}
              />
              <Button label = "Navigate To Customer Location" poppins style={tw`btn my-3`}
              onPress = {handleIsDriverAtRiderLocation}
              />
            </View>

          }



          {/*Flow 3 Request OTP from Rider*/}
          {isDriverAtRiderLocation && 
            <View>
              <View style={tw`items-center gap-3`}>
                <AntDesign name="checkcircle" size={100} color="green" />
                <Text poppinsMedium>Arrived at Rider's Location</Text>
                <Text poppins>{selectedRider?.fromLocation}</Text>
              </View>
              <Button label = "Request OTP" poppins style={tw`btn my-3`}
              onPress = {handleSendOTPToCustomer}
              />
            </View>
          }

          {/* Flow 4 OTP Flow */}

          {isOTPSentToRider &&

          <View style={tw`gap-4`}>
            <Text poppinsMedium h2 center>Enter OTP</Text>     
            <Text poppins center>We sent a code to the Rider’s phone number</Text>     
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
          <Text poppinsMedium center style={tw`text-blue-500 underline`}
          onPress = {handleResendOTP}
          >Resend Code</Text> 

          <Button label = "Verify OTP" poppins style={tw`btn my-3`}
          onPress = {handleVerifyOTP}
          />

          </View>

          }

          {/* Flow 5 Start Trip */}
          { isTripStarted && 

          <View>
            <NotificationCardDriving
              name={selectedRider?.riderName}
              phoneNumber={selectedRider?.phoneNumber}
              time={selectedRider?.time}
              onCancelIconPressed = {handleOnCancelIconPressed}
            />
            <DoubleLocationCard locationDistance = "10 mins" 
            fromLocation = {selectedRider?.fromLocation}
            toLocation = {selectedRider?.toLocation}
            />
            <Button 

            label = {isTripStartedButtonClicked ? "Enroute" : "Start Trip"}

            poppins style={tw`btn my-3 ${isTripStartedButtonClicked ? "bg-[#D5A419]" : "" }`}

            onPress = {isTripStartedButtonClicked ? () => {} : handleTripStartedButtonClicked }
            />
            {isTripStartedButtonClicked && 
            <Text poppinsMedium 
            style={tw`text-blue-500 my-2`}
            onPress = {handleReachedRiderDestination}
            >Arrived Destination?</Text>}
          </View>

           }

         {/* Flow 6 Await Payment */}
        { isRiderDestinationReached &&

          <View>
              <View style={tw`items-center gap-3`}>
                <AntDesign name="checkcircle" size={100} color="green" />
                <Text poppinsMedium>Arrived at Rider's Destination</Text>
                <Text poppins>{selectedRider?.fromLocation}</Text>
              </View>
              <View>
                <ActivityIndicator size = "large" style={tw`my-3`} />
              </View>
              <Text poppinsMedium style={tw`my-3`} center p1 >Awaiting Payment from Customer...</Text>
          </View>
         }


          {/* if cancled Show this */}
   {/*     <View>
            <View style={tw`items-center gap-3`}>
              <FontAwesome name="times-circle" size={100} color="red" />
              <Text poppinsMedium>Booking cancelled successfully</Text>
              <Text poppins center >Your booking with 
              <Text poppinsMedium> ID: 5467DFY778 </Text>
              has been cancelled successfully.</Text>
            </View>
            <Button label = "Continue" poppins style={tw`btn my-3`}/>
        </View>*/}


        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

