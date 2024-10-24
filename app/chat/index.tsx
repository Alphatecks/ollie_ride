import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import tw from '@/tailwind';
import Ionicons from '@expo/vector-icons/Ionicons';


const ChatListScreen = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = auth.currentUser;  // Get the current logged-in user
  const router = useRouter();     // Use Expo Router for navigation

  useEffect(() => {
    // Fetch all conversations where the current user is a participant
    const q = query(
      collection(db, 'conversations'),
      where('drivers', 'array-contains', user.uid)
    );


    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedConversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversations(fetchedConversations);

      console.log(conversations)
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  console.log(conversations)

  // Handle navigation to a chat 
  const openChat = (conversationId, otherUserId) => {
    router.push({
      pathname: '/chat',
      params: { conversationId, otherUserId }, // Pass conversationId and other user's ID as params
    });
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {
        isLoading && <ActivityIndicator size="large" color="#0000ff" />
      }

      {conversations.length === 0 ?
        <View style={tw`flex-1 justify-center items-center`}>
          <Ionicons name="car-outline" size={50} color="gray" />
          <Text style={tw`text-gray-500 mt-4 poppins`}>No Chats found</Text>
        </View>
        :
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            // Find the other user in the conversation
            const otherUserId = item.users.find(uid => uid !== user.uid);
            return (
              <TouchableOpacity
                style={tw`p-4 border-b border-gray-200`}
                onPress={() => openChat(item.id, otherUserId)}
              >
                <Text style={tw`text-lg font-semibold`}>
                  Chat with {otherUserId}
                </Text>
                <Text style={tw`text-gray-500`}>
                  Last message: {item.lastMessage}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      }
    </View>
  );
};

export default ChatListScreen;

