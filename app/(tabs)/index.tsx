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

import * as ImagePicker from 'expo-image-picker';

export default function Index() {
  const [userInfo, setUserInfo] = useState({});
  const [paymentMethods, setPaymentMethods] = useState({});
  const [image, setImage] = useState<string | null>(null);

  const auth = getAuth();


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

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
       <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} />}
    </SafeAreaView>
  );
}
