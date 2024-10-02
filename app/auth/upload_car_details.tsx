import React, { useState } from 'react'
import { View, Text, Button, Badge } from 'react-native-ui-lib'
import { TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import tw from "@/tailwind"
import Entypo from '@expo/vector-icons/Entypo';
import { FontAwesome } from '@expo/vector-icons';

import uploadFile, { fetchBlobFromUri } from "@/utils/upload"
import { auth } from "@/firebaseConfig"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';

const UploadCarDetails = () => {
  const [carFrontURL, setCarFrontURL] = useState<string>("")
  const [carBackURL, setCarBackURL] = useState<string>("")
  const storage = getStorage()

  const [formValues, setFormValues] = useState({
    carBrand: '',
    gearType: '',
    carCondition: '',
    carPlateNumber: ''
  });

  const handleInputChange = (field, value) => {
    setFormValues({
      ...formValues,
      [field]: value,
    });
  };

  const handleContinue = () => {
    console.log(formValues)
  }

  const pickImage = async (carView: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      let blob = await fetchBlobFromUri(result.assets[0].uri);

      // Generate a reference to the file in Firebase Storage
      const storageRef = ref(storage, `${auth?.currentUser?.uid}/${result.assets[0].fileName}`);

      // Upload the image to Firebase Storage
      await uploadBytes(storageRef, blob);
      console.log("Image uploaded to Firebase Storage");

      // Get the download URL for the uploaded image
      const downloadURL = await getDownloadURL(storageRef);
      console.log("URL: ", downloadURL);

      // Set the URL based on carView
      if (carView === "frontView") {
        setCarFrontURL(downloadURL);
      } else {
        setCarBackURL(downloadURL);
      }
    }
  };

  return (
    <View style={tw`bg-white flex-1 p-3`}>
      <Text poppins h2 style={tw`mb-5 text-center`}>Upload Car Details</Text>

      <View style={tw`flex-row justify-around`}>
        <TouchableOpacity onPress={() => pickImage("frontView")}>
        {carFrontURL ? (
        <View style={tw`h-30 w-30`}>
            <Image source={{ uri: carFrontURL }} style={tw`h-30 w-30`} />
            <FontAwesome name="times" size={24} color="red" style={tw`absolute right-0`} onPress = {()=> setCarFrontURL("")} />
	    </View>
          ) : (
          <View style={tw`flex-grow h-30 w-30 bg-gray-200 items-center justify-center`}>
            <Entypo name="plus" size={24} color="white" />
          </View>
          )}
        <Text poppins center>Front View</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => pickImage("backView")}>
          {carBackURL ? (
          <View style={tw`h-30 w-30`}>
            <Image source={{ uri: carBackURL }} style={tw`h-30 w-30`} />
            <FontAwesome name="times" size={24} color="red" style={tw`absolute right-0`} onPress = {()=> setCarFrontURL("")} />
	      </View>
          ) : (
          <View style={tw`flex-grow h-30 w-30 bg-gray-200 items-center justify-center`}>
            <Entypo name="plus" size={24} color="white" />
          </View>
          )}
        <Text poppins center>Back View</Text>
        </TouchableOpacity>
      </View>

      {/* Form fields */}
      <View style={tw`my-4`}>
        <TextInput
          style={tw`input poppins`}
          placeholder="Car Brand"
          value={formValues.carBrand}
          onChangeText={(value) => handleInputChange('carBrand', value)}
        />
        <TextInput
          style={tw`input poppins`}
          placeholder="Gear Type"
          value={formValues.gearType}
          onChangeText={(value) => handleInputChange('gearType', value)}
        />
        <TextInput
          style={tw`input poppins`}
          placeholder="Car Condition"
          value={formValues.carCondition}
          onChangeText={(value) => handleInputChange('carCondition', value)}
        />
        <TextInput
          style={tw`input poppins`}
          placeholder="Car Plate Number"
          value={formValues.carPlateNumber}
          onChangeText={(value) => handleInputChange('carPlateNumber', value)}
        />
      </View>

      <Button label="Continue" poppins style={tw`p-4 rounded-md`} onPress={handleContinue} />
    </View>
  )
}

export default UploadCarDetails;
