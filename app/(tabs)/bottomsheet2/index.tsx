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

interface TripAvailableProps {
  trip: Trip;
  onClose: () => void;
  onTripAccepted: (trip: Trip) => void;
}

const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd";

const TripAvailable = () => {
  
  const router = useRouter();

  const { selectedTrip, setSelectedTrip } = useTripStore();

  console.log("Selected Trip: ", selectedTrip)

  const trip = {}
  const onClose = () => {

    router.push("/(tabs)/bottomsheet2/book_ride")
    
  }

  const handleTripAccepted = async (selectedTrip: Trip | null) => {

    console.log(selectedTrip?.tripId)

    if (!selectedTrip) {
      Toast.show({type: "error", text1: "You didn't select any trip. "})
      return;
    }
    
    const tripAccessCode = generateAccessCode();
    if (tripAccessCode) {
      Toast.show({type: "success", text1: `Access code ${tripAccessCode}`})
    }

    const selectedTripRef = doc(db, "trips", selectedTrip?.tripId);

    
    try {
      // await updateDoc(selectedTripRef, {
      //   status: TripStatus.TRIP_ACCEPTED,
      //   driverId: auth?.currentUser?.uid,
      //   tripAccessCode,
      //   isTripPaid: false,
      //   paidWithCash: false,
      //   isPaymentVerified: false,
      //   showAccessCode: true,
      // });

      setSelectedTrip({...selectedTrip,
        status: TripStatus.TRIP_ACCEPTED,
        driverId: auth?.currentUser?.uid,
        tripAccessCode,
        isTripPaid: false,
        paidWithCash: false,
        isPaymentVerified: false,
        showAccessCode: true,
       })

      console.log(`Trip ${selectedTrip.id} was set.`);
      console;e.log("New selectedTrip: ", selectedTrip)
      router.push("/bottomsheet2/navigate_to_customer");

    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={tw`justify-between`}>

      <View style={tw`gap-2`}>
        <Text poppinsMedium h2 center style={tw`border-b-[0.5px] border-gray-400`}>
          Select Address
        </Text>
        <View style={tw`border-[0.5px] border-gray-400 px-3 rounded-md mb-3`}>
          <TextField
          placeholder="From"
          style={tw`p-3`}
          poppins
          leadingAccessory = {<TargetSVG />}
          containerStyle={tw`w-full pr-3`}
          />
        </View> 
        <View style={tw`border-[0.5px] border-gray-400 px-3 rounded-md mb-3`}>
          <TextField
          placeholder="To"
          style={tw`p-3`}
          poppins
          leadingAccessory = {<MapSVG />}
          containerStyle={tw`w-full pr-3`}
          />
        </View> 

        <Text poppinsMedium p1 >Recent Places</Text>

        <RecentPlaces />

        <DoubleLocationCard />

      </View>

      <Button label="Confirm Location" poppins 
      onPress={onClose}
      style={tw`btn`} 
      />
    </View>
  );
}

export default TripAvailable;