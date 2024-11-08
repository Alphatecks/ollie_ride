import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-ui-lib';
import { Link, useRouter } from "expo-router";
import NotificationCardBase from '@/components/notification/NotificationCardBase';
import DoubleLocationCard from '@/components/home/DoubleLocationCard';
import tw from '@/tailwind';
import useTripStore from '@/store/useTripStore';
import { auth, db } from '@/firebaseConfig';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

const AcceptTrip = () => {
  const trip = useTripStore((state) => state.trip);
  const updateTripStatus = useTripStore((state) => state.updateTripStatus);
  const router = useRouter();
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    if (!trip?.id) return;

    const tripRef = doc(db, "trips", trip.id);
    const unsubscribe = onSnapshot(tripRef, (snapshot) => {
      const tripData = snapshot.data();

      if (tripData?.status === "TRIP_ACCEPTED" && tripData.driverId === auth.currentUser?.uid) {
        setIsAccepted(true);
      } else {
        setIsAccepted(false);
      }
    });

    return () => unsubscribe();
  }, [trip?.id]);

  const handleAccept = async () => {
    if (!trip?.id) return;

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const tripRef = doc(db, "trips", trip.id);
      await updateDoc(tripRef, {
        status: "TRIP_ACCEPTED",
        driverId: user.uid,
      });

      // Update Zustand store with new trip status and driverId
      updateTripStatus("TRIP_ACCEPTED", user.uid);

      console.log("Trip accepted successfully!", trip.id, "From Zustand: ", trip);
    } catch (error) {
      console.error("Error accepting trip:", error);
    }
  };

  if (isAccepted) {
    router.push("/(tabs)/bottomsheet/page2")
  }

  return (
    <View>
      <View>
        <NotificationCardBase
          key={trip?.id}
          name={trip?.riderName}
          phoneNumber={trip?.phoneNumber}
          time={trip?.time}
        />
        <DoubleLocationCard
          locationDistance="10 mins"
          fromLocation={trip?.fromLocation}
          toLocation={trip?.toLocation}
        />
        <Text style={tw`my-4`}>Price Range: ₦{trip?.tripAmount}</Text>
        <View style={tw`flex-row gap-2`}>
          <Button
            label="Accept"
            style={tw`btn flex-grow`}
            onPress={handleAccept}
          />
          <Button
            label="Reject"
            style={tw`btn flex-grow bg-[#BFC8D4] text-red-300`}
            color="#0C3569"
          />
        </View>
      </View>
    </View>
  );
};

export default AcceptTrip;
