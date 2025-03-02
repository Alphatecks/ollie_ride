
import { View, Text, Button, Colors } from 'react-native-ui-lib'
import { Alert } from "react-native"
import { useEffect, useCallback, useState } from "react"

import tw from "@/tailwind"
import Welcome from "@/assets/welcome.svg"
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter, useFocusEffect } from "expo-router"

import * as Location from 'expo-location'; // Importing expo-location for handling location permissions and fetching user location

import { auth, db } from "@/firebaseConfig"
import { addDoc, collection, doc, getDoc } from "firebase/firestore";




const Index = () => {
	 const router = useRouter()
   const [errorMsg, setErrorMsg] = useState(null); // Error message for location permission



   useFocusEffect(
     useCallback(() => {
       async function requestLocationPermission() {
         let { status } = await Location.requestForegroundPermissionsAsync();
         if (status !== 'granted') {
           setErrorMsg('Permission to access location was denied');
         } else {
           console.log("Thank you for granting application...");
         }


        if (auth.currentUser) {
          const currentUser = auth.currentUser;

          try {
            // Reference to the user's document in the "users" collection
            const docRef = doc(db, "drivers", currentUser.uid);

            // Get the document snapshot
            const docSnapShot = await getDoc(docRef);

            if (docSnapShot.exists()) {
              const userData = docSnapShot.data();

              // Check if the user is approved
              if (userData.isApproved) {
                router.replace("/(tabs)/bottomsheet2"); // Redirect to tabs if approved
              } else {
                router.replace("/auth/driver_verification"); // Redirect to awaiting approval screen
              }
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error fetching document:", error);
            // Optionally, you can redirect to an error screen or show an error message
          }
        }

       }

       // Call the async function
       requestLocationPermission();

       return () => {
         console.log('This route is now unfocused.');
       };
     }, [])
   );

    
	// useEffect(()=>{
	// 	if (auth.currentUser) return router.replace("(tabs)")
	// }, [auth.currentUser])


	return (
		 <SafeAreaView style={tw`flex-1 bg-white px-6 py-10 justify-between`} >
            <View style={tw`gap-y-8`} >
                <Welcome width={356} />
                <View>
                    <Text h2 poppinsMedium center onPress = {()=> router.push("(tabs)")} >Welcome</Text>
                    <Text poppinsLight center >Have a better driving experience</Text>
                </View>
            </View>
            <View style={tw`gap-y-3`} >
      
       		<Link href = "auth/sign_up" asChild>
	          <Button
                label ="Create An Account"  
                // style = {tw`p-4 bg-[#1e3a8a]`}
                style={tw`btn`}
                // disabled = {true}
                poppins
                // rounded
	            />
       		</Link>  
            <Link asChild href="/auth/sign_in">
                <Button
                label ="Sign In"  
                backgroundColor = "1e3a8a"
                style={tw`outline rounded-md`}
                labelStyle = {tw`text-blue-800`}
                poppins
                rounded
                outline
                /> 
            </Link>    	
      
            </View>
        </SafeAreaView>
	)
}

export default Index
