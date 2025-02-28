// app/trip_available.tsx

import { View, Image, Alert } from "react-native";
import Text from 'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import tw from "@/tailwind";
import { Trip } from "@/types";
import NotificationCardBase from "@/components/notification/NotificationCardBase";
import DoubleLocationCard from "@/components/home/DoubleLocationCard";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import { generateAccessCode } from "@/utils/utils";
import { useRouter } from "expo-router";

interface TripAvailableProps {
  trip: Trip;
  onClose: () => void;
  onTripAccepted: (trip: Trip) => void;
}

const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd";

const TripAvailable = ({ trip, onClose, onTripAccepted }: TripAvailableProps) => {
  const router = useRouter();

  // const handleTripAccepted = async (selectedTrip: Trip) => {
  //   const tripAccessCode = generateAccessCode();
  //   const selectedTripRef = doc(db, "trips", selectedTrip?.id);

  //   try {
  //     await updateDoc(selectedTripRef, {
  //       status: "TRIP_ACCEPTED",
  //       driverId: auth?.currentUser?.uid,
  //       tripAccessCode,
  //       isTripPaid: false,
  //       paidWithCash: false,
  //       isPaymentVerified: false,
  //       showAccessCode: true,
  //     });
  //     console.log(`Trip ${selectedTrip.id} was set.`);
  //     onTripAccepted(selectedTrip);
  //   //   router.push("/bottomsheet2/trip_accepted");
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  return (
    <View>
      <Text>{trip?.id}</Text>
      <NotificationCardBase
        key={trip?.id || "1"}
        name={trip?.riderName || "John Doe"}
        imageUrl={trip?.riderProfileImage || url}
        phoneNumber={trip?.phoneNumber || "908739432354"}
        time={trip?.time || "12:00 PM"}
      />
      <DoubleLocationCard
        locationDistance="10 mins"
        fromLocation={trip?.fromLocation || "Lagos"}
        toLocation={trip?.toLocation || "Abuja"}
      />
      <Text poppins style={tw`my-4`}>Price Range: N4000 - N5000 </Text>
      <View style={tw`flex-row gap-2`}>
        <Button label="Accept" poppins style={tw`btn flex-grow`} />
        <Button label="Reject" poppins onPress={onClose} style={tw`btn flex-grow bg-[#BFC8D4] text-red-300`} color="#0C3569" />
      </View>
    </View>
  );
}

export default TripAvailable;