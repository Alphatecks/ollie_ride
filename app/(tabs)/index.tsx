import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, useEffect, useMemo } from "react";
import { View, TextInput, Image } from "react-native";
import Avatar from 'react-native-ui-lib/avatar'
import Text from 'react-native-ui-lib/text'

import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import tw from "@/tailwind";

const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in meters
  return distance;
};

const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd"

const riders = [
  { id: 1, latitude: 5.4798823, longitude: 7.4309101 }, // Within 100 meters
  { id: 2, latitude: 5.4808823, longitude: 7.4319101 }, // Outside 100 meters
  { id: 3, latitude: 5.4785823, longitude: 7.4299101 }, // Within 100 meters
];

export default function Index() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 5.4788823,
    longitude: 7.4309201,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);

      setRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.005,  // Adjust for zoom level
        longitudeDelta: 0.005, // Adjust for zoom level
      });
    })();
  }, []);

  const memoizedRiders = useMemo(() => riders.map((rider) => {
    if (location) {
      const distance = getDistanceFromLatLonInMeters(
        location.coords.latitude,
        location.coords.longitude,
        rider.latitude,
        rider.longitude
      );
      return { ...rider, distance };
    }
    return rider;
  }), [location]);

  return (
    <View style={tw`bg-white flex-1`}>
      <MapView
        style={tw`flex-1`}
        provider={PROVIDER_GOOGLE}
        loadingEnabled={true}
        showsUserLocation
        followsUserLocation={true}
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
                onPress = {()=> console.log(`Pressed: ${rider.id}`)}
              >
                <Image source={{ uri: url }} style={tw`h-12 w-12 rounded-full border-2 border-white`} />
              </Marker>
            ))}
          </>
        )}
      </MapView>

      <View style={tw`absolute bottom-6 right-2 left-2`}>
        <View style={tw`bg-white flex-1 flex-row items-center p-4 rounded-3xl gap-2`}>
          <TextInput style={tw`flex-1 poppins`} placeholder="Search" />
        </View>
      </View>
    </View>
  );
}