// import React, { useState, useEffect } from 'react';
// import { View, Text, Button } from 'react-native-ui-lib';
// import useTripStore from '@/store/useTripStore';
// import { NotificationCardDriving } from '@/components/notification/NotificationCardBase';
// import DoubleLocationCard from '@/components/home/DoubleLocationCard';
// import tw from '@/tailwind';
// import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
// import { db } from '@/firebaseConfig';

// const riderCurrentLocation = "FCHP+V5C, Along Ubakala Road, Umuahia";

// const NavigateToCustomerLocation = () => {
//   const trip = useTripStore((state) => state.trip);
//   const [isTripCancelled, setIsTripCancelled] = useState(false);

//   console.log(trip.id)

//   useEffect(() => {
//     if (trip?.id) {
//       const tripRef = doc(db, "trips", trip.id);

//       // Listen for changes to the trip document
//       const unsubscribe = onSnapshot(tripRef, (snapshot) => {
//         const tripData = snapshot.data();

//         if (tripData?.driverId === null && tripData?.status === "TRIP_AVAILABLE") {
//           setIsTripCancelled(true);
//         }
//       });

//       // Cleanup the listener on component unmount
//       return () => unsubscribe();
//     }
//   }, [trip?.id]);

//   const handleIsDriverAtRiderLocation = () => {
//     console.log("Driver is at location...");
//   };

//   const handleOnCancelIconPressed = async () => {
//     console.log("Navigating to driver location...");

//     const tripRef = doc(db, "trips", trip.id);

//     console.log(trip?.id);
//     // await updateDoc(tripRef, {
//     //   status: "TRIP_AVAILABLE",
//     //   driverId: null,
//     //   tripAccessCode: null,
//     // });
//     console.log("Canceled trip and set the driver, status and access code to null");

//     setIsTripCancelled(true);
//   };

//   return (
//     <View>
//       {isTripCancelled ? (
//         <View>
//           <Text poppins center>You Canceled this trip!!</Text>  
//         </View>
//       ) : (
//         <View>
//           <NotificationCardDriving
//             name={trip?.riderName}
//             phoneNumber={trip?.phoneNumber}
//             time={trip?.time || "5 mins"}
//             onCancelIconPressed={handleOnCancelIconPressed}
//           />
//           <DoubleLocationCard
//             locationDistance="10 mins" 
//             fromLocation={trip?.fromLocation}
//             toLocation={trip?.toLocation}
//           />
//           <Button
//             label="Navigate To Customer Location"
//             poppins
//             style={tw`btn my-3`}
//             onPress={handleIsDriverAtRiderLocation}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// export default NavigateToCustomerLocation;
