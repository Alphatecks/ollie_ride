import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import {Text, Button} from "react-native-ui-lib"

import tw from "../../../tailwind";
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ButtonLoader from "../../components/general/ButtonLoader";
import { auth, db, storage } from "../../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';

import Toast from "react-native-toast-message"
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const UploadCarDetails = () => {
  const [carFrontURI, setCarFrontURI] = useState<string>(""); // Local URI for front image
  const [carBackURI, setCarBackURI] = useState<string>("");  // Local URI for back image
  const [carFrontURL, setCarFrontURL] = useState<string>(""); // Firebase URL for front image
  const [carBackURL, setCarBackURL] = useState<string>("");   // Firebase URL for back image
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useNavigation();
  const user = auth.currentUser;

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

  const handleContinue = async () => {
    if (!user) {
      console.log("You are not authenitcated")
      Toast.show({
        type: "error",
        text1: "You are not authenitcated!!"
      })
      return
    }
    try {
      setLoading(true);

      // Upload the front image
      if (carFrontURI) {
        const frontRef = ref(storage, `${auth?.currentUser?.uid}/carFront.jpg`);
        const frontBlob = await fetch(carFrontURI).then(res => res.blob());
        await uploadBytes(frontRef, frontBlob);
        const frontDownloadURL = await getDownloadURL(frontRef);
        setCarFrontURL(frontDownloadURL);
      }

      // Upload the back image
      if (carBackURI) {
        const backRef = ref(storage, `${auth?.currentUser?.uid}/carBack.jpg`);
        const backBlob = await fetch(carBackURI).then(res => res.blob());
        await uploadBytes(backRef, backBlob);
        const backDownloadURL = await getDownloadURL(backRef);
        setCarBackURL(backDownloadURL);
      }

      // Save data to Firestore with the image URLs
      await setDoc(doc(db, "cars", user.uid), {
        ...formValues,
        carFrontURL,
        carBackURL
      });

      setLoading(false);
      navigation.navigate('DriverVerification');

    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  const pickImage = async (carView: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;

      // Set the image URI for immediate display
      if (carView === "frontView") {
        setCarFrontURI(selectedImageUri);
      } else {
        setCarBackURI(selectedImageUri);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      enableOnAndroid={true}
      extraScrollHeight={50}
      keyboardOpeningTime={0}
      style={tw`bg-white flex-1 p-3`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/*<Text poppins h2 style={tw`mb-5 text-center`} onPress={() => router.push("auth/driver_verification")}>
          Upload Car Details
        </Text>*/}

        <View style={tw`flex-row justify-around mt-6`}>
          <TouchableOpacity onPress={() => pickImage("frontView")}>
            {carFrontURI ? (
              <View style={tw`h-30 w-30`}>
                <Image source={{ uri: carFrontURI }} style={tw`h-30 w-30`} />
                <FontAwesome6 name="xmark" size={24} color="red" style={tw`absolute right-0`} onPress={() => setCarFrontURI("")} />
              </View>
            ) : (
              <View style={tw`flex-grow h-30 w-30 bg-gray-200 items-center justify-center`}>
                <Entypo name="plus" size={24} color="white" />
              </View>
            )}
            <Text poppins center>Front View</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => pickImage("backView")}>
            {carBackURI ? (
              <View style={tw`h-30 w-30`}>
                <Image source={{ uri: carBackURI }} style={tw`h-30 w-30`} />
                <FontAwesome6 name="xmark" size={24} color="red" style={tw`absolute right-0`} onPress={() => setCarBackURI("")} />
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
        {loading ? (
          <ButtonLoader />
        ) : (
          <Button
            label="Continue"
            poppins
            disabled={Object.values(formValues).some(value => value === '')}
            style={tw`p-4 rounded-md`}
            onPress={handleContinue}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UploadCarDetails;
