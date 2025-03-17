// app/trip_available.tsx

import { View, TouchableWithoutFeedback } from "react-native";
import Text from 'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import tw from "@/tailwind";
import { Keyboard } from 'react-native';

import { useRouter } from "expo-router";
import DoubleAddress from "@/components/home/DoubleAddress";
import { useTripStore } from "@/store/tripStore";
import Toast from "react-native-toast-message";
import { TextField } from "react-native-ui-lib";
import { Feather } from "@expo/vector-icons";
import TargetSVG from "@/assets/target.svg"
import MapSVG from "@/assets/Map.svg"
import RecentPlaces from "@/components/bottomsheet-ui/RecentPlaces";
import DoubleLocationCard from "@/components/home/DoubleLocationCard";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import * as Location from 'expo-location';

import { googleSearch, googleDistanceMatrix } from "@/utils/useSearch"


const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd";

const Index = () => {
  
  const router = useRouter();

  const { selectedTrip, setSelectedTrip } = useTripStore();
  const [locationDistance, setLocationDistance] = useState({})
  const [location, setLocation] = useState(null);
  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState(''); 
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const [isFromTyping, setIsFromTyping] = useState(false);
  const [isToTyping, setIsToTyping] = useState(false);


  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});


      console.log("location: ", location)

      setLocation(location);
    })();
  }, []);


  useEffect(() => {
    const getFromAndToDistance = async () => {
      if (!isFromTyping && !isToTyping && fromText.trim() && toText.trim()) {
        const timer = setTimeout(async () => {
          console.log("User has finished typing:", { fromText, toText });
          const res = await googleDistanceMatrix(fromText, toText);
  
          console.log("Total distance: ", res.data)
          setLocationDistance(res.data)
  
        }, 2000);
    
        return () => clearTimeout(timer);
      }
    }
    getFromAndToDistance()

  }, [isFromTyping, isToTyping, fromText, toText]);

  

  const onClose = () => {

    router.push("/(tabs)/bottomsheet2/book_ride")
    
  }

  const handleFromTextChange = async (text: string) => {
    setIsFromTyping(true);
    setFromText(text);
    const suggestions = await googleSearch(text);
    setFromSuggestions(suggestions?.data || []);
  };
  
  const handleToTextChange = async (text: string) => {
    setIsToTyping(true);
    setToText(text);
    const suggestions = await googleSearch(text);
    setToSuggestions(suggestions?.data || []);
  };
  

const handleSuggestionClick = (suggestion) => {
// Set the selected suggestion as the new text value
  setFromText(suggestion);
  // Clear the suggestions list
  setFromSuggestions([]);
};

const handleSuggestionClickTo = (suggestion) => {
  // Set the selected suggestion as the new text value
  setToText(suggestion);
  // Clear the suggestions list
  setToSuggestions([]);
};

const handlePress = () => {

  router.push({pathname: "/(tabs)/bottomsheet2/book_ride", 
    params: {...locationDistance, fromLocation: fromText, 
      toLocation: toText
    }
  })

}

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={tw`gap-10`}>

      {/* This shit works when i import scrollview from react-native-gesture-handler but doesnt scroll on other
        scrollviews!!!
      */}

      {/* <ScrollView 
					contentContainerStyle={tw`p-2 bg-red-400 flex-grow`} 
					keyboardShouldPersistTaps="handled"

				>
					<Text style={tw`bg-red-100 p-4 my-4`} onPress = {()=> console.log("pressed me")}>Hello there...</Text>
					<Text style={tw`bg-red-200 p-4 my-4`}>Hello there...</Text>
					<Text style={tw`bg-red-200 p-4 my-4`}>Hello there...</Text>
					<Text style={tw`bg-red-200 p-4 my-4`}>Hello there...</Text>
				</ScrollView> */}
        
      <View style={tw`gap-2`}>
        <Text poppinsMedium h2 center style={tw`border-b-[0.5px] border-gray-400`}>
          Select Address
        </Text>
        <View style={tw`border-[0.5px] border-gray-400 px-3 rounded-md mb-3`}>
        <TextField
          placeholder="From"
          style={tw`p-3`}
          poppins
          leadingAccessory={<TargetSVG onPress={() => console.log("pressed map icon")} />}
          containerStyle={tw`w-full pr-3`}
          onChangeText={handleFromTextChange}
          onBlur={() => {
            setIsFromTyping(false);
            setFromSuggestions([]);
          }}
          value={fromText}
        />
        </View> 

        {fromSuggestions.length > 0 && fromText && (
						  <View style={tw`my-2 gap-y-2`}>
						    {fromSuggestions.map((suggestion, index) => (
						      <Text key={index} poppins onPress={() => handleSuggestionClick(suggestion)}>{suggestion}</Text>
						    ))}
						  </View>
						)}

        <View style={tw`border-[0.5px] border-gray-400 px-3 rounded-md mb-3`}>
          <TextField
          placeholder="To"
          style={tw`p-3`}
          poppins
          leadingAccessory={<MapSVG onPress={() => console.log("pressed map icon")} />}
          containerStyle={tw`w-full pr-3`}
          onChangeText={handleToTextChange}
          onBlur={() => {
            setIsToTyping(false);
            setToSuggestions([]);
          }}
          value={toText}
          />
        </View> 

        {toSuggestions.length > 0 && toText && (
          <View style={tw`my-2 gap-y-2`}>
            {toSuggestions.map((suggestion, index) => (
              <Text key={index} poppins onPress={() => handleSuggestionClickTo(suggestion)}>{suggestion}</Text>
            ))}
          </View>
        )}


        <DoubleLocationCard fromLocation={fromText} toLocation={toText} 
          locationDistance={locationDistance.distance}          
        />

      </View>

      <Button label="Confirm Location" poppins 
      onPress={handlePress}
      style={tw`${!fromText || !toText || !locationDistance.distance ? "btn bg-gray-400": "btn"}`}
      disabled = {!fromText || !toText || !locationDistance.distance}
      />
    </View>
  </ TouchableWithoutFeedback>

  );
}

export default Index;