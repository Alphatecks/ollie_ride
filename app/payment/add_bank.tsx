import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import Text from 'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods for subcollection
import { auth, db } from '@/firebaseConfig'; // Import Firebase auth and Firestore
import { useRouter } from 'expo-router';
import tw from '@/tailwind';

import Toast from "react-native-toast-message"

const AddBankDetails = () => {
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddBankDetails = async () => {
    if (!bankName || !bankAccount || !accountHolder) {
      Toast.show({
        type: "error",
        text1: 'Please fill in all fields'
      })
      return;
    }

    if (bankAccount.length < 10) {
      Toast.show({
        type: "error",
        text1: 'Bank account number must be at least 10 digits'
      })
      return;
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('Error', 'User not authenticated');
        Toast.show({
        type: "error",
        text1: 'User not authenticated'
      })
        return;
      }

      // Reference to the user's "bankAccounts" subcollection
      const bankAccountsRef = collection(db, 'users', currentUser.uid, 'bankAccounts');
      
      // Add a new document with bank details in the "bankAccounts" subcollection
      await addDoc(bankAccountsRef, {
        bankName,
        bankAccount,
        accountHolder,
      });

      Alert.alert('Success', 'Bank details added successfully');
      setBankName('');
      setBankAccount('');
      setAccountHolder('');
      // router.push('/wallet_aux/withdraw_success'); // Navigate after successful addition
    } catch (error) {
      Alert.alert('Error', 'Failed to add bank details. Please try again.');
      console.error('Error adding bank details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 p-5 bg-white`}>
      <Text poppins center style={tw`text-lg text-ollie-base mb-5`}>
        Add Bank Details
      </Text>

      <View style={tw`flex-1 justify-between`}>
        <View>
          {/* Bank Name Input */}
          <TextInput
            placeholder="Bank Name"
            style={tw`poppins p-4 border rounded-md border-gray-400`}
            value={bankName}
            onChangeText={setBankName}
          />

          {/* Bank Account Number Input */}
          <TextInput
            placeholder="Bank Account Number"
            style={tw`poppins p-4 border rounded-md border-gray-400 my-4`}
            value={bankAccount}
            keyboardType="numeric"
            onChangeText={(text) => setBankAccount(text.replace(/[^0-9]/g, ''))} // Only allow numbers
          />

          {/* Account Holder Name Input */}
          <TextInput
            placeholder="Account Holder's Name"
            style={tw`poppins p-4 border rounded-md border-gray-400`}
            value={accountHolder}
            onChangeText={setAccountHolder}
          />
        </View>
        {/* Submit Button */}
        <Button
          label="Add Bank Details"
          poppins
          style={tw`btn mt-5`}
          disabled={loading}
          onPress={handleAddBankDetails}
        />
      </View>
    </View>
  );
};

export default AddBankDetails;
