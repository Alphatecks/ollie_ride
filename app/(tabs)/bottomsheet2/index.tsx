// app/trip_available.tsx

import { View, Image, Alert, Touchable } from "react-native";
import Text from 'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import tw from "@/tailwind";
import { Trip, TripStatus } from "@/types";
import NotificationCardBase from "@/components/notification/NotificationCardBase";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import { generateAccessCode } from "@/utils/utils";
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

interface TripAvailableProps {
  trip: Trip;
  onClose: () => void;
  onTripAccepted: (trip: Trip) => void;
}

const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd";

const Index = () => {
  
  const router = useRouter();

  const { selectedTrip, setSelectedTrip } = useTripStore();

  console.log("Selected Trip: ", selectedTrip)

  const trip = {}
  const onClose = () => {

    router.push("/(tabs)/bottomsheet2/book_ride")
    
  }


  return (
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
          leadingAccessory = {<TargetSVG onPress={()=> console.log("pressed map icon")} />}
          containerStyle={tw`w-full pr-3`}
          />
        </View> 
        <View style={tw`border-[0.5px] border-gray-400 px-3 rounded-md mb-3`}>
          <TextField
          placeholder="To"
          style={tw`p-3`}
          poppins
          leadingAccessory = {<MapSVG onPress={()=> console.log("pressed map icon")} />}
          containerStyle={tw`w-full pr-3`}
          />
        </View> 

        <DoubleLocationCard />

      </View>

      <Button label="Confirm Location" poppins 
      onPress={onClose}
      style={tw`btn`} 
      />
    </View>
  );
}

export default Index;