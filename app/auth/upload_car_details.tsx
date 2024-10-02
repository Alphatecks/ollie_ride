import React, { useState } from 'react'
import { View, Text } from 'react-native-ui-lib'
import tw from "@/tailwind"

import uploadFile, { fetchBlobFromUri } from "@/utils/upload"
import {auth} from "@/firebaseConfig"

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


import * as ImagePicker from 'expo-image-picker';


const UploadCarDetails = () => {
	const [image, setImage] = useState<string | null>(null);

	const storage = getStorage()

	const pickImage = async () => {
	  // Launch the image picker
	  let result = await ImagePicker.launchImageLibraryAsync({
	    mediaTypes: ImagePicker.MediaTypeOptions.All,
	    allowsEditing: false,
	    aspect: [4, 3],
	    quality: 1,
	  });

	  if (!result.canceled) {
	    setImage(result.assets[0]);

	    // Upload image to Firebase Storage
	    const storageRef = ref(storage, `${auth?.currentUser?.uid}/${result.assets[0].fileName}`);

		const blob = await fetchBlobFromUri(result.assets[0].uri)

		console.log(blob)
		console.log("Uploading to firebase storage")
	    await uploadBytes(storageRef, blob);
	    console.log("Done uploading");

	    const downloadURL = await getDownloadURL(storageRef)

	    console.log("URL: ", downloadURL)
	  }
	};

	return (
		<View style={tw`bg-white flex-1 p-3`}>
			<Text poppins h2 onPress={pickImage} >Upload Car Details</Text>
			<View>
				
			</View>
		</View>
	)
}

export default UploadCarDetails