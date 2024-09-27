import { useState, useEffect } from "react";
import { Text, View, Avatar, Badge } from 'react-native-ui-lib';
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import tw from "@/tailwind";
import { db } from "@/firebaseConfig.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";


export default function Index() {
  const [userInfo, setUserInfo] = useState({});
  const [paymentMethods, setPaymentMethods] = useState({});

  const auth = getAuth();

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const userDoc = await getDoc(doc(db, "Users", auth.currentUser.uid));
  //       if (userDoc.exists()) {
  //         setUserInfo(userDoc.data());
  //       } else {
  //         console.log("No such document!");
  //       }
  //     } catch (e) {
  //       console.log("Error getting document:", e);
  //     }
  //   };

  //   if (auth.currentUser) {
  //     fetchUserData();
  //   }
  // }, [auth.currentUser]);

  return (
    <SafeAreaView style={tw`dark:bg-black bg-white flex-1 p-3`}>
      <Text>index</Text>
    </SafeAreaView>
  );
}
