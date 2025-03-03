import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { View, TextInput, Image, ActivityIndicator, Alert } from "react-native";
import Text from 'react-native-ui-lib/text';
import { TextField } from 'react-native-ui-lib';
import Button from 'react-native-ui-lib/button';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import tw from "@/tailwind";
import { getNearbyPlaces } from "@/utils/googleAPI";
import { createTrip, fetchAvailableTrips } from "@/utils/booking";
import { getDirections } from "@/utils/getDirections"

import Toast, { InfoToast } from "react-native-toast-message";
import { Slot, useRouter } from "expo-router";
import useTripStore from '@/store/useTripStore';
import { Trip } from '@/types';
import AntDesign from '@expo/vector-icons/AntDesign';

import polyline from '@mapbox/polyline'; // Import the polyline library

import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import NotificationCardBase, { NotificationCardDriving } from "@/components/notification/NotificationCardBase";
import DoubleLocationCard from "@/components/home/DoubleLocationCard";
import { generateAccessCode } from "@/utils/utils";

import FontAwesome from '@expo/vector-icons/FontAwesome';
import AnimatedIcon from "@/components/general/AnimatedIcon";
import PulsingCarIcon from "@/components/general/PulseIcon";



const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd";

// type Coordinates = { latitude: number; longitude: number };


export default function Index() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [availableTrips, setAvailableTrips] = useState<Trip[]>([]);
  const [acceptedTrips, setAcceptedTrips] = useState<Trip[]>([]);
  const [region, setRegion] = useState<Region>({
    latitude: 5.4788823,
    longitude: 7.4309201,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [showAccessCodeUI, setShowAccessCodeUI] = useState(false)
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]); // For polyline

  const [nearbyPlaces, setNearbyPlaces] = useState()


  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["25%", "50%", "70%", "90%"];

  // const place = getNearbyPlaces(location?.coords.latitude, location?.coords.longitude)
  // console.log(place)

  // const [currentTrip, setCurrentTrip] = useState<Trip>()

  const appLocation = {"coords": {"accuracy": 5, "altitude": 5, "altitudeAccuracy": 0.5, "heading": 0, "latitude": 37.4219983, "longitude": -122.084, "speed": 0}, "mocked": false, "timestamp": 1740827850064}

  useEffect(() => {

    console.log("Inside first useEffect...")
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
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
          const places = await getNearbyPlaces(location?.coords.latitude, location?.coords.longitude)
          setAvailableTrips(places);

          // console.log("AVAILABLE TRIPS:", _availableTrips)
        } catch (error) {
          console.error('Failed to fetch trips:', error);
        }
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (!selectedTrip) return;
  
    const selectedTripRef = doc(db, 'trips', selectedTrip.id);
    const unsubscribe = onSnapshot(selectedTripRef, (doc) => {
      if (doc.exists()) {
        setSelectedTrip({ id: doc.id, ...doc.data() } as Trip);
      }
    });
  
    return () => unsubscribe();
  }, [selectedTrip?.id]);
  

  useEffect(() => {
    // Firestore listener for trips without a driver
    const tripsCollection = collection(db, 'trips');
    const tripsQuery = query(tripsCollection, where('driverId', '==', null), where("status", "==", "TRIP_AVAILABLE"));

    const unsubscribe = onSnapshot(tripsQuery, (querySnapshot) => {
      const updatedAvailableTrips = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Trip[];

      setAvailableTrips(updatedAvailableTrips);
      console.log('Available trips updated:', updatedAvailableTrips);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Firestore listener for trips with specific statuses
    const tripsCollection = collection(db, 'trips');
    const tripsQuery = query(
      tripsCollection,
      where('status', 'in', ['TRIP_STARTED', 'TRIP_ACCEPTED']),
      where("driverId", "==", auth.currentUser?.uid)
    );

    const unsubscribe = onSnapshot(tripsQuery, (querySnapshot) => {
      const matchingTrips = querySnapshot.docs.map((doc) => ({
        tripId: doc.id,
        ...doc.data(),
      })) as Trip[];

      if (matchingTrips.length > 0) {
        console.log('Trips with status TRIP_STARTED or TRIP_ACCEPTED:', matchingTrips);
        setAcceptedTrips(matchingTrips)
      } else {
        console.log('No trips with the specified statuses found.');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {

    if (selectedTrip?.status !== "TRIP_ACCEPTED") {
      console.log("Trip not started yet!!")
    }

    console.log("Inside second useEffect");
  
    const _getDirections = async () => {
  
      if (location && selectedTrip) {
        // Ensure the location and selected trip are valid
        const { latitude, longitude } = location.coords; // Assuming location is a valid object with coords
        const destination = { latitude: selectedTrip.latitude, longitude: selectedTrip.longitude };
  
        console.log("Inside if block", latitude, longitude, destination);
  
        try {
          const directions = await getDirections({ latitude, longitude }, destination);
          // console.log("Directions: ", directions);
  
          if (directions && directions.polyline) {
            // Decode the polyline into an array of coordinates
            const decodedCoordinates = polyline.decode(directions.polyline).map(([lat, lng]) => ({
              latitude: lat,
              longitude: lng,
            }));
  
            // console.log("Decoded coordinates: ", decodedCoordinates);
  
            setRouteCoordinates(decodedCoordinates); // Update the state with the decoded coordinates
            // console.log("Decoded Route Coordinates: ", decodedCoordinates); // Log the decoded coordinates
          }
        } catch (error) {
          console.error("Failed to fetch directions:", error);
        }
      } else {
        // console.log("Location or selectedTrip is missing:", location, selectedTrip);
      }
    };
  
    _getDirections();
  }, [location?.coords.latitude, location?.coords.longitude]); // Dependencies are location and selectedTrip
  

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if (index === -1) {
      // Reset flow state logic if needed
    }
  }, []);

  const handleBottomSheetClose = () => {
    bottomSheetRef.current?.close();
  };

  const handleInputChange = async (value: string, index: number, selectedTrip: Trip) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  
    if (newOtp.length === 5) {
      // Convert OTP array to a single number
      const otpAsNumber = Number(newOtp.join(""));
      console.log("OTP as number:", otpAsNumber);

      if (otpAsNumber === selectedTrip?.tripAccessCode){

        try{
          const selectedTripRef = doc(db, "trips", selectedTrip?.id)
  
          await updateDoc(selectedTripRef, {
            status: "TRIP_CODE_VALID",
            showAccessCode: false
          })
          console.log("Updated Status of status to: TRIP_CODE_VALID")

          setShowAccessCodeUI(false)
        }
        catch(e){
          console.log(e)
        }
      }
      
    }
  };
  

  const handleTripMarkerClicked = (trip: Trip) => {
    // If clicked get the trip id and set it to sellectedTrip
    console.log(acceptedTrips.length, " is already accepted.")
    if (acceptedTrips?.length > 1) {
      Alert.alert("Too many trips.", `Please finish the accepted trip with ID:  ${acceptedTrips?.[0].id} before starting a fresh one.`)
      return
    }
    if(selectedTrip?.status === "TRIP_ACCEPTED" || "TRIP_CODE_VALID"){
      console.log("Trip accepted already.")
    }
    setSelectedTrip(trip);
    console.log("Selected Trip:", trip)
    bottomSheetRef.current?.snapToIndex(0);  // Open the bottom sheet to the first snap point

  };

  const handleTripAccepted = async(selectedTrip: Trip) => {
    // IF trip is accepted then generate trip access code that will be sent to the rider

    console.log("Trips was accepted")
    const tripAccessCode = generateAccessCode()

    const selectedTripRef = doc(db, "trips", selectedTrip?.id)

    try{
      await updateDoc(selectedTripRef, {
        status: "TRIP_ACCEPTED",
        driverId: auth?.currentUser?.uid,
        tripAccessCode,
        isTripPaid: false,
        paidWithCash: false,
        isPaymentVerified: false,
        showAccessCode: true,
      })
      console.log(`Trip ${selectedTrip.id} was set.`)

      setShowAccessCodeUI(true)
    }
    catch(e){
      console.log(e)
    }
  }

  const handleIsDriverAtRiderLocation = async (selectedTrip: Trip) => {
    const selectedTripRef = doc(db, "trips", selectedTrip?.id)
    
    try{
      await updateDoc(selectedTripRef, {
        status: "TRIP_DRIVER_AT_CUSTOMER_LOCATION"
      })
      
      console.log("Driver is at location.")
    }catch(e){
      console.log(e)
    }


  }

  const handleTripStarted = async (selectedTrip: Trip) => {
    console.log("Trip started button pressed")
    // On click set the status to "TRIP_STARTED", get the current time and set it to tripStartedTime
    const currentTime = new Date()

    console.log(currentTime)

    const selectedTripRef = doc(db, "trips", selectedTrip?.id)
    
    try{
      await updateDoc(selectedTripRef, {
        status: "TRIP_STARTED",
        tripStartedTime: currentTime,
        tripEndedTime: null,
        isTripEnroute: true,
      })
      console.log("Trip status updated to started.")

    }catch(e){
      console.log(e)
    }

  }
  
  const handleReachedRiderDestination = async (selectedTrip: Trip) => {
    console.log("Trip has ended")
    const currentTime = new Date()

    console.log(currentTime)

    const selectedTripRef = doc(db, "trips", selectedTrip?.id)
    
    try{
      await updateDoc(selectedTripRef, {
        status: "TRIP_ENDED",
        tripEndedTime: currentTime,
        isTripEnroute: false,
      })
      console.log("Trip status updated to started.")

    }catch(e){
      console.log(e)
    }

  }
  const handlePaidWithCash = async (selectedTrip: Trip) => {
    console.log("Trip was paid with cash")
    const currentTime = new Date()

    console.log(currentTime)

    const selectedTripRef = doc(db, "trips", selectedTrip?.id)
    
    try{
      await updateDoc(selectedTripRef, {
        tripPaymentTime: currentTime,
        isTripPaid: true,
        paidWithCash: true,
      })

      // Push to the Payment verification route

      router.push({pathname: "/riding_flow/payment_details", params: selectedTrip})

    }catch(e){
      console.log(e)
    }

  }

  const handleOnCancelIconPressed = async (selectedTrip: Trip) => {
    // If tips is cancled reset back the status and remove driverId, then close bottom sheet

    console.log("Cancel pressed!!")

    const selectedTripRef = doc(db, "trips", selectedTrip?.id)

    try{
      await updateDoc(selectedTripRef, {
        status: "TRIP_AVAILABLE",
        driverId: null,
        isTripPaid: false,
        tripAccessCode: null,
        showAccessCode: false,
      })
      console.log("Trip status updated to started.")
      
      handleBottomSheetClose()

    }catch(e){
      console.log(e)
    }

  }

  const handleOpenOngoingTrip = (selectedTrip: Trip) => {
    bottomSheetRef.current?.snapToIndex(0);  // Open the bottom sheet to the first snap point
  }

  const handleCarIconPress = () => {
    // If the pulsing car icon is clicked get the accepted trips of a driver and set it to the selected trip
    // Then open up the bottomsheet
    if (acceptedTrips){
      console.log(acceptedTrips)
      setSelectedTrip(acceptedTrips[0])
      bottomSheetRef.current?.expand()
    }

  };
  

  return (
    <View style={tw`bg-white flex-1`}>
      
      {selectedTrip?.status === "TRIP_STARTED" &&
      <View style={tw`bg-green-600 flex-row items-center gap-4`}>
        <View style={tw`gap-2 bg-green-500 p-3 items-center`}
        >
          <AntDesign name="arrowup" size={24} color="white" />
          <Text poppinsMedium style={tw`text-white`}>200m</Text>
        </View>
        <Text poppins style={tw`text-white text-2xl flex-1`}
        onPress = {()=> router.push("/riding_flow/payment_details")}

        >Turn to the left TB Square. {selectedTrip?.tripAccessCode} </Text>
      </View>
      }

      {showAccessCodeUI &&
        <View style={tw`py-3 bg-green-500`}>
          <Text poppinsMedium center style={tw`text-white`}>Access code: {selectedTrip?.tripAccessCode}</Text>
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
      
        {Array.isArray(availableTrips) && availableTrips.map((trip) => (
          <Marker
            key={trip.id}
            coordinate={{ latitude: trip.latitude, longitude: trip.longitude }}
            title={`Trip ${trip.id}`}
            onPress={() => handleTripMarkerClicked(trip)}
          >
            <Image source={{ uri: url }} style={tw`h-12 w-12 rounded-full border-2 border-white`} />
          </Marker>
        ))}

        {selectedTrip?.status === "TRIP_ACCEPTED" && 
         <Marker
         key={selectedTrip.id}
         coordinate={{ latitude: location?.coords?.latitude, longitude: location?.coords?.longitude }}
         title={`Open Ongoing Trip: ${selectedTrip.id}`}
         description="Click to open up the trip"
         onPress={() => handleOpenOngoingTrip(selectedTrip)}
        />
        }
        
        {/* Render the polyline for the directions */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#007AFF" // Polyline color
            strokeWidth={4}       // Polyline width
          />
        )}
      </MapView>

      <View style={tw`py-3 absolute top-20 left-3`}>
          <PulsingCarIcon handlePress={handleCarIconPress} />
      </View>
      <View style={tw`py-3 absolute top-50 left-3`}>
          <Button label="Go to bottomsheet" onPress={() => {router.push("/bottomsheet2")}} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        initialSnapIndex={-1}
        index={-1}
      >
        <BottomSheetView style={tw`p-4`}>

          {/* If trip status is available show the below */}

          {selectedTrip?.status === "TRIP_AVAILABLE" &&
           <View>   
            <Text>{selectedTrip?.id}</Text> 
           <NotificationCardBase
             key={selectedTrip?.id}
             name={selectedTrip?.riderName}
             phoneNumber={selectedTrip?.phoneNumber || "908739432354"}
             time={selectedTrip?.time}
           />
           <DoubleLocationCard locationDistance = "10 mins" 
           fromLocation = {selectedTrip?.fromLocation}
           toLocation = {selectedTrip?.toLocation}
           />
           <Text poppins style={tw`my-4`} >Price Range: N4000 - N5000 </Text>
           <View style={tw`flex-row gap-2`}>
             <Button label = "Accept" poppins style={tw`btn flex-grow`} 
             onPress = {()=> handleTripAccepted(selectedTrip)}

             />
             <Button label = "Reject" poppins 
             onPress = {handleBottomSheetClose}
             style={tw`btn flex-grow bg-[#BFC8D4] text-red-300`} color = "#0C3569"/>
           </View>
         </View>
          }

          {selectedTrip?.status === "TRIP_ACCEPTED" &&
            <View>
              {/* <Text>This trip has been accepted {selectedTrip?.id}</Text> */}
              <View>
              <NotificationCardDriving
                name={selectedTrip?.riderName}
                phoneNumber={selectedTrip?.phoneNumber}
                time={selectedTrip?.time}
                onCancelIconPressed = { ()=> handleOnCancelIconPressed(selectedTrip)}
                onMessageIconPressed={()=> router.push(`/chat/${selectedTrip?.id}`)}
              />
              <DoubleLocationCard locationDistance = "10 mins" 
              fromLocation = {selectedTrip?.fromLocation}
              toLocation = {selectedTrip?.toLocation}
              />
              <Button label = "Navigate To Customer Location" poppins style={tw`btn my-3`}
              onPress = {()=> handleIsDriverAtRiderLocation(selectedTrip)}
              />
            </View>
            </View>
          }

          {selectedTrip?.status === "TRIP_DRIVER_AT_CUSTOMER_LOCATION" &&
            <View>
              <Text>You are at the customer location!! {selectedTrip?.id} </Text>
              <View style={tw`gap-4`}>
            <Text poppinsMedium h2 center>Enter Access Code</Text>     
            <Text poppins center>We sent a code to the Rider </Text>     
            <View style={tw`flex flex-row gap-2 justify-center`}>
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
                onChangeText={(text) => handleInputChange(text, index, selectedTrip)}
              />
            ))}
          </View>
          <Text poppinsMedium center p1>Didn't get Access Code?</Text>     
          <Text poppinsMedium center style={tw`text-blue-500 underline`}
          // onPress = {handleResendOTP}
          >Resend Code</Text> 

          <Button label = "Verify Code" poppins style={tw`btn my-3`}
          // onPress = {handleVerifyOTP}
          />

          </View>
          </View>
          }
          {selectedTrip?.status === "TRIP_CODE_VALID" &&
              <View>
              <NotificationCardDriving
                name={selectedTrip?.riderName}
                phoneNumber={selectedTrip?.phoneNumber}
                time={selectedTrip?.time}
                onMessageIconPressed={()=> router.push(`/chat/${selectedTrip?.id}`)}
                // onCancelIconPressed = {handleOnCancelIconPressed}
              />
              <DoubleLocationCard locationDistance = "10 mins" 
              fromLocation = {selectedTrip?.fromLocation}
              toLocation = {selectedTrip?.toLocation}
              />
              <Button 
              label = "Start Trip"
              poppins style={tw`btn my-3 ${selectedTrip?.isTripEnroute ? "bg-[#D5A419]" : ""}`}
              onPress = {()=> handleTripStarted(selectedTrip)}
              />
             
              {selectedTrip?.isTripEnroute &&
                <Text poppinsMedium 
                style={tw`text-blue-500 my-2`}
                // onPress = {handleReachedRiderDestination}
                >Arrived Destination?</Text>
              }
              
            </View>
          }

          {selectedTrip?.status === "TRIP_STARTED" &&
              <View>
              <NotificationCardDriving
                name={selectedTrip?.riderName}
                phoneNumber={selectedTrip?.phoneNumber}
                time={selectedTrip?.time}
                onMessageIconPressed = {()=> router.push(`/chat/${selectedTrip.id}`)}
                // onCancelIconPressed = {handleOnCancelIconPressed}
              />
              <DoubleLocationCard locationDistance = "10 mins" 
              fromLocation = {selectedTrip?.fromLocation}
              toLocation = {selectedTrip?.toLocation}
              />
              <Button 
              label = "Enroute"
              poppins style={tw`btn my-3 ${selectedTrip?.isTripEnroute && "bg-[#D5A419]"}`}
              />
             
              <Text>{selectedTrip?.id}</Text>
              {selectedTrip?.isTripEnroute &&
                <Text poppinsMedium 
                style={tw`text-blue-500 my-2`}
                onPress = {()=> handleReachedRiderDestination(selectedTrip)}
                >Arrived Destination?</Text>
              }
              
            </View>
          }

          {
            selectedTrip?.status === "TRIP_ENDED" &&
            <View>
              <View style={tw`items-center gap-3`}>
                <AntDesign name="checkcircle" size={100} color="green" />
                <Text poppinsMedium>Arrived at Rider's Destination</Text>
                <Text poppins>{selectedTrip?.fromLocation}</Text>
              </View>
              <View>
                <ActivityIndicator size = "large" style={tw`my-3`} />
              </View>
              <Text poppinsMedium style={tw`my-3`} center p1 >Awaiting Payment from Customer...</Text>

              <Text poppinsMedium 
                center
                style={tw`text-blue-500 my-2`}
                onPress = {()=> handlePaidWithCash(selectedTrip)}
                >Paid with cash?</Text>
          </View>
          }
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
