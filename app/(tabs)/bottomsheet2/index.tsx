// app/trip_available.tsx

import { View, Image, Alert, Touchable } from "react-native";
import Text from 'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import tw from "@/tailwind";
import { Trip } from "@/types";
import NotificationCardBase from "@/components/notification/NotificationCardBase";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import { generateAccessCode } from "@/utils/utils";
import { useRouter } from "expo-router";
import DoubleAddress from "@/components/home/DoubleAddress";
import { useTripStore } from "@/store/tripStore";
import Toast from "react-native-toast-message";


interface TripAvailableProps {
  trip: Trip;
  onClose: () => void;
  onTripAccepted: (trip: Trip) => void;
}

const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd";

const TripAvailable = () => {
  
  const router = useRouter();

  const { selectedTrip } = useTripStore();

  console.log("Selected Trip: ", selectedTrip)

  const trip = {}
  const onClose = () => {
    
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



    // try {
    //   await updateDoc(selectedTripRef, {
    //     status: "TRIP_ACCEPTED",
    //     driverId: auth?.currentUser?.uid,
    //     tripAccessCode,
    //     isTripPaid: false,
    //     paidWithCash: false,
    //     isPaymentVerified: false,
    //     showAccessCode: true,
    //   });
    //   console.log(`Trip ${selectedTrip.id} was set.`);
    // //   router.push("/bottomsheet2/trip_accepted");
    // } catch (e) {
    //   console.log(e);
    // }
  };

  return (
    <View style={tw`justify-between gap-10`}>
      <View style={tw`gap-3`}>
        {/* <Text>{trip?.id}</Text> */}
        <NotificationCardBase
          key={selectedTrip?.tripId || "1"}
          name={selectedTrip?.riderName || "John Doe"}
          imageUrl={selectedTrip?.riderProfileImage || url}
          phoneNumber={selectedTrip?.riderPhoneNumber || "908739432354"}
          time={selectedTrip?.createdAt || "12:00 PM"}
        />

        <DoubleAddress fromLocation={selectedTrip?.fromLocation} toLocation={selectedTrip?.toLocation} />
        
        <Text poppins style={tw`my-4`}>Price Range: ₦{selectedTrip?.tripAmount} </Text>
      </View>
      <View style={tw`flex-row gap-2`}>
        <Button label="Accept" poppins style={tw`btn flex-grow`}
        onPress={()=> handleTripAccepted(selectedTrip)}
        />
        <Button label="Reject" poppins onPress={onClose} style={tw`btn flex-grow bg-[#BFC8D4] text-red-300`} color="#0C3569" />
      </View>
    </View>
  );
}

export default TripAvailable;