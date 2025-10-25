import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from 'react-native-ui-lib/text';
import Avatar from 'react-native-ui-lib/avatar';
import tw from "../../../tailwind";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query, where, doc, addDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig"; // Adjust the import based on your setup
import { NotificationCardMessage } from "../../components/notification/NotificationCardBase";
import { Trip } from '../../types';
import { ChatBubble } from '../../components/chat/Chat';
import { getNotifications } from '../../utils/booking';

const Notifications = () => {
  const [ongoingTrip, setOngoingTrip] = useState<Trip | []>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigation = useNavigation();
  const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd";
  const driver = auth?.currentUser


  // getNotifications(auth?.currentUser?.uid)

  // createNotification(auth?.currentUser?.uid)

  useEffect(() => {
    const currentUserId = auth?.currentUser?.uid; // Replace with the actual logic to get the current user's ID
  
    if (!currentUserId) return;
  
    // Subscribe to trips
    const tripQuery = query(
      collection(db, "trips"),
      where("status", "in", ["TRIP_ACCEPTED", "TRIP_STARTED", "TRIP_COMPLETED"]),
      where("driverId", "==", currentUserId)
    );
  
    const tripUnsubscribe = onSnapshot(tripQuery, (snapshot) => {
      const trips = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOngoingTrip(trips?.length > 0 ? trips[0] : []); // Assuming one ongoing trip at a time
    });
  
    // Subscribe to notifications
    const notificationsQuery = collection(db, "notifications", currentUserId, "notification");
    const notificationsUnsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const fetchedNotifications = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(fetchedNotifications);
    });
  
    // Cleanup both subscriptions
    return () => {
      tripUnsubscribe();
      notificationsUnsubscribe();
    };
  }, []);
  

  return (
    <View style={tw`bg-white flex-1 p-3`}>
      {/* Ongoing Trip */}
      {ongoingTrip && (
        <View style={tw`border border-[0.9px] border-ollie-base rounded-md p-4 gap-4`}>
          <Text poppinsMedium style={tw`text-gray-500`}>{ongoingTrip?.status}</Text>
          <Text poppinsMedium style={tw`text-gray-500`}>{ongoingTrip?.id}</Text>
          <TouchableOpacity style={tw`flex-row justify-between items-center rounded-md`}>
            <View style={tw`flex-row gap-2 items-center`}>
              <Avatar name="User Name" source={{ uri: url }} />
              <View>
                <Text style={tw`poppins`}>{ongoingTrip?.riderName}</Text>
                <View style={tw`flex-row items-center gap-2`}>
                  <Text style={tw`poppins`}>{ongoingTrip?.riderPhoneNumber}</Text>
                </View>
              </View>
            </View>
            <View>
              <Text poppinsMedium style={tw`text-gray-600`}>{ongoingTrip.tripStartedTime?.toDate().toLocaleTimeString([], {hour12: true, hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          </TouchableOpacity>
          <View style={tw`h-[0.8px] bg-gray-300`}></View>
          <View style={tw`flex-row justify-around`}>
            <TouchableOpacity style={tw`items-center gap-2`}>
              <Ionicons name="call" size={24} style={tw`text-ollie-base`} />
              <Text poppinsMedium style={tw`text-ollie-base`}
			  >Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`items-center gap-2`} 
			  	onPress = {()=> navigation.navigate('Chat', { tripId: ongoingTrip?.id })}
				  >
              <MaterialIcons name="message" size={24} style={tw`text-ollie-base`} />
              <Text poppinsMedium style={tw`text-ollie-base`}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`items-center gap-2`}>
              <MaterialCommunityIcons name="navigation-variant" size={25} style={tw`text-ollie-base`} />
              <Text poppinsMedium style={tw`text-ollie-base`}>Navigation</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Notifications */}
      <View style={tw`my-8 gap-4`}>
        <Text poppinsMedium>Notifications</Text>
        <View style={tw`p-3 gap-2`}>
          {notifications.map((notification) => (
            <NotificationCardMessage
              key={notification.id}
              title={notification.message}
              message={notification.subtitle}
              time={notification.time}
              imageUrl={notification.imageUrl || url}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default Notifications;
