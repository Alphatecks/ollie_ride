// app/trip_available.tsx

import { View } from "react-native";
import Text from 'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import tw from "@/tailwind";
import { Trip } from "@/types";
import { NotificationCardDriving } from "@/components/notification/NotificationCardBase";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import { generateAccessCode}  from "@/utils/utils";
import { useRouter } from "expo-router";
import TimeIndicator from "@/components/home/TimeIndicator";

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
    <View style={tw`justify-between gap-20`}>
		<NotificationCardDriving
			name={trip?.riderName || "John Doe"}
			phoneNumber={trip?.phoneNumber || "908739432354"}
		
		/>
		<View style={tw`gap-5`}>
			<TimeIndicator />
			
			<Button label="Navigate To Customer Location" 
			poppins style={tw`btn flex-grow`}
			onPress = {()=> router.push("/bottomsheet2/enter_access_code")}
			/>
		</View>

    </View>
  );
}

export default TripAvailable;