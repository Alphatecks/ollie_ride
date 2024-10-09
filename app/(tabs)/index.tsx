import { useState, useEffect } from "react";
import { Text, View, Avatar, Badge, Button, Image } from 'react-native-ui-lib';
import { ScrollView, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


import tw from "@/tailwind";
import { useDeviceContext } from "twrnc"

import { db } from "@/firebaseConfig.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import * as ImagePicker from 'expo-image-picker';
// import * as Permissions from 'expo-permissions' // For iOS (if using Expo)
import * as Location from 'expo-location' // For iOS and Android (if using Expo)



export default function Index() {
  const [userInfo, setUserInfo] = useState({});


  useDeviceContext(tw);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
      (async () => {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }



  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const userDoc = await getDoc(doc(db, "Users", auth.currentUser.uid));
  //       if (userDoc.exists()) {
  //         setUserInfo(userDoc.data());
  //       } else {
  //         console.log("No such document!");
  //       }
  //     } catch (e) {
  //       console.log("Error getting document:", e);
  //     }
  //   };

  //   if (auth.currentUser) {
  //     fetchUserData();
  //   }
  // }, [auth.currentUser]);

  return (
    <View style={tw`bg-white flex-1`}>
      <View style={tw`flex-1 relative`}>
        <MapView
        style = {styles.map}
        provider={PROVIDER_GOOGLE} 
        showsUserLocation
        initailRegion={{
         latitude: 37.78825,
         longitude: -122.4324,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,
       }}
         mapType="standard"
        // initialRegion={{
        //   latitude: 37.78825,
        //   longitude: -122.4324,
        //   latitudeDelta: 0.0922,
        //   longitudeDelta: 0.0421,
        // }}
      />
      <View style={tw`absolute bottom-6 right-2 left-2`}>
        <View style={tw`bg-white dark:bg-black flex-1 flex-row items-center p-4 rounded-3xl gap-2`}>
          <MaterialIcons name="search" size={24} style={tw`text-gray-300`} />
          <TextInput style={tw`flex-1 poppins dark:text-white`} placeholder = "Search" />
        </View>
        <Text>{process.env.GOOGLE_MAPS_API_KEY_OLD}</Text>
      </View>
      </View>

     </View>
  );
}


const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});