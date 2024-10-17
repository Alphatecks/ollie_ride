import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Text from 'react-native-ui-lib/text';
import tw from "@/tailwind";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const user = auth.currentUser;
  const chatPartnerId = "1d2oSROhUPgAGizAEnCiSn5G4NL2";
  const currentUserName = user.displayName;
  const conversationId = [user.uid, chatPartnerId].sort().join("_");

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

  // Customizing the bubble
  const renderCustomBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: tw`bg-[#8ED7FF4D] poppins border-[1px] border-ollie-base my-2`,
          left: tw`bg-gray-200 my-2`,
        }}
        textStyle={{
          right: tw`text-gray-700 poppins`,
          left: tw`text-gray-800 poppins`,
        }}
      />
    );
  };

  // Customizing the time
  const renderCustomTime = (props) => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          right: tw`text-sm text-gray-500`,  // Customize sent message time
          left: tw`text-sm text-gray-500`,   // Customize received message time
        }}
      />
    );
  };

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
          renderBubble={renderCustomBubble}
          renderTime={renderCustomTime}  // Use the custom time renderer
          onSend={(messages) => onSend(messages)}
          textInputStyle={tw`poppins border-[0.8px] border-gray-500 px-3 rounded-md`}
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
