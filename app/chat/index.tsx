import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { useSearchParams } from 'expo-router'; // Use Expo Router hook
import { View, ActivityIndicator, StyleSheet } from 'react-native'; // Import ActivityIndicator for loading spinner
import Text from 'react-native-ui-lib/text'; // Import ActivityIndicator for loading spinner
import tw from "@/tailwind"

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const user = auth.currentUser;

  // Use Expo Router to get params
  const chatPartnerId = "1d2oSROhUPgAGizAEnCiSn5G4NL2";
  const currentUserName = user.displayName;

  // Generate a unique conversation ID by ordering user IDs alphabetically
  const conversationId = [user.uid, chatPartnerId].sort().join("_");

  useEffect(() => {
    setIsLoading(true); // Start loading when fetching messages

    // Query to check if conversation exists
    const q = query(
      collection(db, `conversations/${conversationId}/messages`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        console.log('No conversation yet between these users.');
        setIsLoading(false); // No conversation, stop loading
        return;
      }

      // Map snapshot data to GiftedChat format
      const messagesFromFirestore = snapshot.docs.map((doc) => ({
        _id: doc.id, // use doc.id for _id
        text: doc.data().text,
        createdAt: doc.data().createdAt.toDate(),
        user: doc.data().user,
      }));

      // Set messages from Firestore
      setMessages(messagesFromFirestore);
      setIsLoading(false); // Messages fetched, stop loading
    });

    return () => unsubscribe();
  }, [conversationId]);

  const onSend = useCallback(async (messages = []) => {
    const { _id, createdAt, text, user } = messages[0];

    // Add new message to Firestore, but do NOT manually append to state
    await addDoc(collection(db, `conversations/${conversationId}/messages`), {
      _id,
      createdAt,
      text,
      user,
    });
  }, [conversationId]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        // Show loading spinner while messages are being fetched
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text poppinsMedium style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : (
        // Show chat once messages are loaded
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: user.uid, // Current user's ID
            name: currentUserName, // Current user's name
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default ChatScreen;
