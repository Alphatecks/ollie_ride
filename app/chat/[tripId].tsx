import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Text, TextField } from 'react-native-ui-lib';
import tw from '@/tailwind';
import { collection, onSnapshot, addDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import { ChatBubble } from '@/components/chat/Chat';

const ChatScreen = () => {
  const router = useRouter();

  const {tripId} = useLocalSearchParams()


  const driverId = auth?.currentUser?.uid;
  const [riderId, setRiderId] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch the riderId dynamically based on the tripId
  useEffect(() => {
    const fetchRiderId = async () => {
      if (!tripId) return;
      try {
        setLoading(true)
        const tripDoc = await getDoc(doc(db, 'trips', tripId));
        if (tripDoc.exists()) {
          setRiderId(tripDoc.data().riderId);
        } else {
          Alert.alert('Error', 'Trip not found.');
        }
        setLoading(false)
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch rider ID.');
        setLoading(false)
      }
    };
    fetchRiderId();
  }, [tripId]);

  // Subscribe to messages
  useEffect(() => {
    if (!riderId || !driverId) return;
  
    const chatId = `${riderId}_${driverId}`;
    const unsubscribe = onSnapshot(
      collection(db, 'chats', chatId, 'messages'), // Access messages subcollection
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messages.sort((a, b) => b.timestamp - a.timestamp)); // Sort by timestamp
      },
      (error) => {
        Alert.alert('Error', 'Failed to fetch messages.');
        console.error(error);
      }
    );
  
    return () => unsubscribe();
  }, [riderId, driverId]);
  

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Warning', 'Message cannot be empty.');
      return;
    }
    if (!riderId || !driverId) {
      Alert.alert('Error', 'Unable to send message.');
      return;
    }
  
    setLoading(true);
    const chatId = `${riderId}_${driverId}`; // Chat document ID
    try {
      // Reference to the subcollection `messages` under the specific chat document
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: driverId,
        message: message.trim(),
        timestamp: new Date(),
      });
      setMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <View style={tw`flex-1 bg-white`}>
      {loading ?
        <View style={tw`bg-white flex-1 justify-center items-center`}>
          <ActivityIndicator size={90} color={"green"} />
        </View>
        	:
        <View style={tw`flex-1`}>
        
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            inverted // Scroll to the bottom by default
            renderItem={({ item }) => (
              <View style={tw`p-2 items-end`}>
                <ChatBubble message={item?.message} messageDate={new Date(item.timestamp?.toDate()).toLocaleString()} />
              </View>
            )}
          />
          <View style={tw`flex-row items-center p-4 bg-white border-t border-gray-200`}>
            <TextInput
              style={tw`flex-1 mr-2 border border-gray-300 p-2 rounded poppins`}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
            />
            <TouchableOpacity
              style={tw`p-2 rounded-full bg-blue-500`}
              onPress={handleSendMessage}
              disabled={loading}
            >
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
    }
    </View>
  );
};

export default ChatScreen;
