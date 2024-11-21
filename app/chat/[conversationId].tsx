import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Text from 'react-native-ui-lib/text';
import tw from "@/tailwind";


type Message = {
  _id: string,
  text: string,
  createdAt: Date
}

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const user = auth.currentUser;
  const chatPartnerId = "1d2oSROhUPgAGizAEnCiSn5G4NL2";
  const currentUserName = user?.displayName;
  const conversationId = [user?.uid, chatPartnerId].sort().join("_");

  useEffect(() => {
    setIsLoading(true); // Start loading when fetching messages

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

      const messagesFromFirestore = snapshot.docs.map((doc) => ({
        _id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().createdAt.toDate(),
        user: doc.data().user,
      }));

      setMessages(messagesFromFirestore);
      setIsLoading(false); // Messages fetched, stop loading
    });

    return () => unsubscribe();
  }, [conversationId]);

  const onSend = useCallback(async (messages = []) => {
    const { _id, createdAt, text, user } = messages[0];

    await addDoc(collection(db, `conversations/${conversationId}/messages`), {
      _id,
      createdAt,
      text,
      user,
    });
  }, [conversationId]);



  return (
    <View style={styles.container}>
      <Text>This is the chat ui.</Text>
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
