import React, { useState, useEffect } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { View, Text, Button, Avatar } from 'react-native-ui-lib'
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../tailwind";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'react-native-image-picker';


import { auth, db, storage } from "../../firebaseConfig"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

import { useNavigation } from '@react-navigation/native'

import ProfileOptionsCard from "../../components/profile/ProfileOptionsCard"
import { ProfileOptionsLogoutCard } from "../../components/profile/ProfileOptionsCard"

import { getAllCollectionsData } from "../../utils/firebase"

import Toast from "react-native-toast-message"

// getAllCollectionsData().catch((error) => {
//   console.error('Error retrieving collections:', error);
// });


// console.log(auth.currentUser)

const Profile = () => {
	const navigation = useNavigation()

	const [avatarUri, setAvatarUri] = useState<string | null>(null); // Local avatar state

	const [user, setUser] = useState(auth.currentUser); // Store the current user
	const [userData, setUserData] = useState()
	const [loading, setLoading] = useState(false)

  // Listen for user state changes (e.g., update in displayName)
  useEffect(() => {

  	 const fetchUserDetails = async () => {
      // const currentUser = auth.currentUser;

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);

        try {
          // Fetch the current balance first
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const _userData = userDocSnapshot.data();
            setUserData(_userData)

			console.log(_userData)
          }

          // Now set up the real-time listener
          const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
            }
          });

          setLoading(false); // Stop loading once data is fetched and listener is set up
          return () => unsubscribe(); // Cleanup listener on unmount
        } catch (error) {
          console.error('Error fetching totalBalance:', error);
          setLoading(false); // Stop loading in case of an error
        }
      }
    };

    fetchUserDetails()

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
	    // currentUser.reload(); 
	    if (currentUser && currentUser.displayName !== user?.displayName) {
	      setUser(currentUser); // Update user state if displayName has changed
	    }
	  });

    return unsubscribe; // Cleanup listener on unmount
  }, [auth, auth.currentUser.displayName]);

	const pickImage = async () => {
    // Ask for permission to access media library
	    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
	    if (!permissionResult.granted) {
	      alert("Permission to access gallery is required!");
	      return;
	    }

	    // Open image picker
	    const result = await ImagePicker.launchImageLibraryAsync({
	      mediaTypes: ImagePicker.MediaTypeOptions.Images,
	      allowsEditing: true,
	      aspect: [1, 1],
	      quality: 1,
	    });

	    if (!result.canceled) {
	      const source = result.assets[0].uri;
	      setAvatarUri(source);
	      handleImageUpload(source); // Upload to Firebase Storage
	    }
  };

  const handleImageUpload = async (imageUri: string) => {
    if (!user) return;

    try {
      // Create a reference to store the image in Firebase Storage
      const imageRef = ref(storage, `drivers/${user.uid}/profile.jpg`);

      // Fetch the image file from the local URI
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Upload the image to Firebase Storage
      await uploadBytes(imageRef, blob);

      // Get the download URL of the uploaded image
      const downloadUrl = await getDownloadURL(imageRef);

      // Update the user's Firebase profile with the new photo URL
      await updateProfile(user, {
        photoURL: downloadUrl,
      });

      // Update the avatarUri with the new download URL
      setAvatarUri(downloadUrl);

      console.log("Image uploaded and profile updated:", downloadUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      Toast.show({
      	type: "error",
      	text1: `Error: ${error}`
      })
    }
  };

	const handleLogout = async () => {
		console.log("Pressed logout!!")
	    try {
	      await auth.signOut();  // Sign out the user
	      navigation.navigate('SignIn');
	    } catch (error) {
	      console.error('Error signing out: ', error);
        Toast.show({
	      	type: "error",
	      	text1: `Error: ${error}`
	      })
	    }
	}

	return (
			<View style = {tw`flex-1 bg-white`} >
				<View style={tw`bg-ollie-base h-[170px] flex-row justify-between p-3`}>
					<View></View>
					<View style={tw`items-center`}>
						<View style={tw`border-[2px] rounded-full border-white`}>							
							<Avatar 
							name = {user.displayName} 
							size = {60}
							source={{ uri: avatarUri || user?.photoURL || userData?.profileImage || '' }} // Use the uploaded or current user's photo
				            onPress={pickImage} // Open image picker on press
							/>
						</View>
						<View style={tw`flex-row items-center my-2`}>
							<MaterialIcons name="star" size={16} color="white" />
							<Text style={tw`text-white poppins`}> 4.0 </Text>
						</View>
						<Text style={tw`poppinsMedium text-white`}>{auth.currentUser.displayName}</Text>
					</View>
					<Text style={tw`text-white py-3`} onPress = {()=> navigation.navigate('UpdateProfile')} >Edit</Text>
				</View>
			

				{/* Profile Options */}
				<View style={tw`p-3 gap-7`}>
					<ProfileOptionsCard 
						title = "Manage Address" 
						href="payment" 
						icon = {<MaterialCommunityIcons 
						name="file-document-outline" 
						size={24} color="black" />}
					/>
					<ProfileOptionsCard 
						title = "My Bookings"  
						disabled = {true}
						icon={<MaterialCommunityIcons name="cog-outline" size={24} color="black" />} 
					/>
					<ProfileOptionsCard 
						title = "Emergency Contact" 
						href='help_center'
						icon={<MaterialCommunityIcons 
						name="headset" size={24} color="black" />} 
					/>
					<ProfileOptionsCard 
						title = "Settings" 
						href='help_center'
						icon={<MaterialCommunityIcons 
						name="headset" size={24} color="black" />} 
					/>
					<ProfileOptionsCard 
						title = "Help Center" 
						href='help_center'
						icon={<MaterialCommunityIcons 
						name="headset" size={24} color="black" />} 
					/>
					<ProfileOptionsLogoutCard title = "Log Out"  
					handlePress = {handleLogout}
					textStyle = "text-red-500" icon = {<AntDesign name="logout" size={24} color="red" />} 
					hasArrowIcon = {false} />
				</View>
				
			</View>
	)
}

export default Profile