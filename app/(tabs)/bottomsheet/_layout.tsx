import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { View, TextInput, Image } from "react-native";
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

import Toast from "react-native-toast-message";
import { Slot, useRouter } from "expo-router";
import useTripStore from '@/store/useTripStore';
import { Trip } from '@/types';
import AntDesign from '@expo/vector-icons/AntDesign';

import polyline from '@mapbox/polyline'; // Import the polyline library


const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd";

// type Coordinates = { latitude: number; longitude: number };


// (async () => {
//   const origin: Coordinates = { latitude: 40.712776, longitude: -74.005974 }; // Example: New York City, NY
//   const destination: Coordinates = { latitude: 34.052235, longitude: -118.243683 }; // Example: Los Angeles, CA
  
//   const directions = await getDirections(origin, destination);
  
//   if (directions) {
//     console.log("Distance:", directions.distance);
//     console.log("Duration:", directions.duration);
//     console.log("Steps:", directions.steps);
//     console.log("Polyline:", directions.polyline);
//   } else {
//     console.log("Directions could not be retrieved.");
//   }
// })();


export default function Index() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [availableTrips, setAvailableTrips] = useState<Trip[]>([]);
  const [region, setRegion] = useState<Region>({
    latitude: 5.4788823,
    longitude: 7.4309201,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]); // For polyline
  const setTrip = useTripStore((state) => state.setTrip);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["25%", "50%", "70%", "90%"];

  useEffect(() => {
    console.log("Inside first useEffect...")
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      } else {
        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
        setRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        try {
          const _availableTrips = await fetchAvailableTrips();
          setAvailableTrips(_availableTrips);
        } catch (error) {
          console.error('Failed to fetch trips:', error);
        }
      }
    };

    fetchLocation();
  }, []);

  // Fetch directions whenever selectedTrip or location changes
  useEffect(() => {
    console.log("Inside second useEffect")
    const _getDirections = async () => {
      console.log(location, selectedTrip);
    
      if (location) {
        // Driver location coords

        const { latitude, longitude } = location.coords; 

        const destination = { latitude: selectedTrip.latitude, longitude: selectedTrip.longitude };

        console.log("Inside if block", latitude, longitude, destination)
    
        try {
          const directions = await getDirections({ latitude, longitude }, destination);
          console.log("Directions: ", directions)

          if (directions && directions.polyline && directions.polyline) {
            // Decode the polyline into an array of coordinates
            const decodedCoordinates = polyline.decode(directions.polyline).map(([lat, lng]) => ({
              latitude: lat,
              longitude: lng,
            }));

            console.log("Decoded cordinates: ", decodedCoordinates)
    
            setRouteCoordinates(decodedCoordinates); // Update the state with the decoded coordinates
            console.log("Decoded Route Coordinates: ", decodedCoordinates); // Log the decoded coordinates
          }
        } catch (error) {
          console.error("Failed to fetch directions:", error);
        }
      }
    };

    _getDirections();
  }, [location]);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if (index === -1) {
      // Reset flow state logic if needed
    }
  }, []);

  const handleBottomSheetClose = () => {
    bottomSheetRef.current?.close();
  };

  const handleInputChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    console.log(newOtp);
  };

  const handleTripMarkerClicked = (trip: Trip) => {
    setTrip(trip);
    setSelectedTrip(trip);
    router.push({ pathname: "/(tabs)/bottomsheet/page1" });
    bottomSheetRef.current?.snapToIndex(0);
  };

  return (
    <View style={tw`bg-white flex-1`}>
      <View style={tw`bg-green-600 flex-row items-center gap-4`}>
        <View style={tw`gap-2 bg-green-500 p-3 items-center`}>
          <AntDesign name="arrowup" size={24} color="white" />
          <Text poppinsMedium style={tw`text-white`}>200m</Text>
        </View>
        <Text poppins style={tw`text-white text-2xl flex-1`}>Turn to the left TB Square.</Text>
      </View>

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
        
        {/* Render the polyline for the directions */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#007AFF" // Polyline color
            strokeWidth={4}       // Polyline width
          />
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
          <Slot />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
