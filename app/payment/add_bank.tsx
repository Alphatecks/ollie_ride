import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import Text from 'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import { collection, addDoc, query, where, getDocs, setDoc, doc } from 'firebase/firestore'; // Import necessary Firestore methods
import { auth, db } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import tw from '@/tailwind';
import Toast from 'react-native-toast-message';

const AddBankDetails = () => {
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddBankDetails = async () => {
    if (!bankName || !bankAccount || !accountHolder) {
      Toast.show({
        type: 'error',
        text1: 'Please fill in all fields',
      });
      return;
    }

    if (bankAccount.length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Bank account number must be at least 10 digits',
      });
      return;
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Toast.show({
          type: 'error',
          text1: 'User not authenticated',
        });
        return;
      }

      // Reference to the user's "bankAccounts" subcollection
      const bankAccountsRef = collection(db, 'users', currentUser.uid, 'bankAccounts');

      // Query to check if the bank account already exists
      const q = query(bankAccountsRef, where('bankAccount', '==', bankAccount));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // If no account exists, add a new one with addDoc()
        await addDoc(bankAccountsRef, {
          bankName,
          bankAccount,
          accountHolder,
        });
        Toast.show({
          type: 'success',
          text1: 'Bank details added successfully',
        });
      } else {
        // If the account exists, update it with setDoc()
        const existingAccountDoc = querySnapshot.docs[0]; // Get the first matching document
        const docRef = doc(db, 'users', currentUser.uid, 'bankAccounts', existingAccountDoc.id);
        await setDoc(docRef, {
          bankName,
          bankAccount,
          accountHolder,
        });
        Toast.show({
          type: 'success',
          text1: 'Bank details updated successfully',
        });
      }

      // Clear form fields
      setBankName('');
      setBankAccount('');
      setAccountHolder('');
      // Navigate after successful operation
      // router.push('/wallet_aux/withdraw_success');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to add/update bank details. Please try again.',
      });
      console.error('Error adding/updating bank details:', error);
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
