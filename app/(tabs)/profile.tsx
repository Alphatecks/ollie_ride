import React, { useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { View, Text, Button, Avatar } from 'react-native-ui-lib'
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@/tailwind";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';


import { auth, db, storage } from "@/firebaseConfig"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from 'firebase/auth';

import { useRouter } from "expo-router"

import ProfileOptionsCard from "@/components/profile/ProfileOptionsCard"
import { ProfileOptionsLogoutCard } from "@/components/profile/ProfileOptionsCard"

import { getAllCollectionsData } from "@/utils/firebase"

import Toast from "react-native-toast-message"

// getAllCollectionsData().catch((error) => {
//   console.error('Error retrieving collections:', error);
// });


const Profile = () => {
	const router = useRouter()

	const [avatarUri, setAvatarUri] = useState<string | null>(null); // Local avatar state

	const user = auth.currentUser

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
      const imageRef = ref(storage, `users/${user.uid}/profile.jpg`);

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
	      router.replace('auth/sign_in');
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
							source={{ uri: avatarUri || user?.photoURL || '' }} // Use the uploaded or current user's photo
				            onPress={pickImage} // Open image picker on press
							/>
						</View>
						<View style={tw`flex-row items-center my-2`}>
							<MaterialIcons name="star" size={16} color="white" />
							<Text style={tw`text-white poppins`}> 4.0 </Text>
						</View>
						<Text style={tw`poppinsMedium text-white`}>{user.displayName}</Text>
					</View>
					<Text style={tw`text-white`} onPress = {()=> router.push("auth/driver_verification")} >Edit</Text>
				</View>
				<View style={tw`p-4`}>
				<View style={tw`bg-white shadow-md -mt-10 rounded-md p-3 gap-2`}>
					<Text poppins center>Trips Completed</Text>
					<Text poppinsMedium center>233 trips over 2 years</Text>
					<View style={tw`h-[1px] bg-gray-300 my-3`}></View>
					<View style={tw`flex-row gap-2 justify-around`}>
						<View>
							<Text poppins style={tw`text-gray-400`}>Acceptance Rate</Text>
							<Text poppinsMedium center>70%</Text>
						</View>
						<View>
							<Text poppins style={tw`text-gray-400`}>Cancelation Rate</Text>
							<Text poppinsMedium center>70%</Text>
						</View>
					</View>
				</View>
				</View>
				{/* Profile Options */}
				<View style={tw`p-3 gap-7`}>
					<ProfileOptionsCard title = "Payment" href="payment" icon = {<MaterialCommunityIcons name="file-document-outline" size={24} color="black" />}/>
					<ProfileOptionsCard title = "Documents" href = "document_aux" icon = {<FontAwesome5 name="coins" size={24} color="black" />} />
					<ProfileOptionsCard title = "Settings"  
					disabled = {true}
					icon={<MaterialCommunityIcons name="cog-outline" size={24} color="black" />} />
					<ProfileOptionsCard title = "Help Center" 
					disabled = {true}
					icon={<MaterialCommunityIcons name="headset" size={24} color="black" />} />
					<ProfileOptionsLogoutCard title = "Log Out"  
					handlePress = {handleLogout}
					textStyle = "text-red-500" icon = {<AntDesign name="logout" size={24} color="red" />} 
					hasArrowIcon = {false} />
				</View>
				
			</View>
	)
}

export default Profile