import React, { useEffect, useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import Text from "react-native-ui-lib/text";
import Button from "react-native-ui-lib/button";
import tw from "@/tailwind";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'; // Firestore methods
import { db, auth } from '@/firebaseConfig'; // Firestore config

const AccountList = () => {
  const params = useLocalSearchParams();
  const { bank_id } = params; // Get the bank_id from the routed params
  const [bankDetails, setBankDetails] = useState({ bankName: '', bankAccount: '', accountHolder: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch bank account details from Firestore when the screen loads
    const fetchBankDetails = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'drivers', auth.currentUser.uid, 'bankAccounts', bank_id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBankDetails(docSnap.data()); // Set the bank details to state
        } else {
          Alert.alert('Error', 'Bank account not found');
        }
      } catch (error) {
        console.error('Error fetching bank details:', error);
        Alert.alert('Error', 'Failed to fetch bank details');
      } finally {
        setLoading(false);
      }
    };

    fetchBankDetails();
  }, [bank_id]);

  const handleUpdateBankDetails = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'drivers', auth.currentUser.uid, 'bankAccounts', bank_id);
      await updateDoc(docRef, {
        bankName: bankDetails.bankName,
        bankAccount: bankDetails.bankAccount,
        accountHolder: bankDetails.accountHolder
      });
      Alert.alert('Success', 'Bank details updated successfully');
      router.back(); // Navigate back after update
    } catch (error) {
      console.error('Error updating bank details:', error);
      Alert.alert('Error', 'Failed to update bank details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBank = async () => {
    // Show a confirmation alert before deleting
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this bank account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const docRef = doc(db, 'drivers', auth.currentUser.uid, 'bankAccounts', bank_id);
              await deleteDoc(docRef);
              Alert.alert('Success', 'Bank account deleted successfully');
              router.back(); // Navigate back after deletion
            } catch (error) {
              console.error('Error deleting bank details:', error);
              Alert.alert('Error', 'Failed to delete bank account');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={tw`bg-white p-3 flex-1 justify-between`}>
      <View style={tw`gap-9`}>
        {/* Bank Name Input */}
        <View style={tw`items-center`}>
          <Text poppins center>Bank Name</Text>
          <TextInput
            style={tw`poppinsMedium text-center text-lg w-full`}
            placeholder={bankDetails.bankName || 'Bank Name'}
            placeholderTextColor="black"
            value={bankDetails.bankName}
            onChangeText={(text) => setBankDetails({ ...bankDetails, bankName: text })}
            onFocus={() => setBankDetails({ ...bankDetails, bankName: '' })}
          />
        </View>

        {/* Account Holder Name Input */}
        <View style={tw`items-center`}>
          <Text poppins center>Account Holder Name</Text>
          <TextInput
            style={tw`poppinsMedium text-center text-lg w-full`}
            placeholder={bankDetails.accountHolder || 'Account Holder Name'}
            placeholderTextColor="black"
            value={bankDetails.accountHolder}
            onChangeText={(text) => setBankDetails({ ...bankDetails, accountHolder: text })}
            onFocus={() => setBankDetails({ ...bankDetails, accountHolder: '' })}
          />
        </View>

        {/* Bank Account Number Input */}
        <View style={tw`items-center`}>
          <Text poppins center>Account Number</Text>
          <TextInput
            style={tw`poppinsMedium text-center text-lg w-full`}
            placeholder={bankDetails.bankAccount || 'Account Number'}
            placeholderTextColor="black"
            value={bankDetails.bankAccount}
            keyboardType="numeric"
            onChangeText={(text) => setBankDetails({ ...bankDetails, bankAccount: text.replace(/[^0-9]/g, '') })}
            onFocus={() => setBankDetails({ ...bankDetails, bankAccount: '' })}
          />
        </View>
      </View>

      {/* Buttons */}
      <View style={tw`gap-4`}>
        <Button label="Update Bank" poppins style={tw`btn`} onPress={handleUpdateBankDetails} disabled={loading} />
        <Button label="Delete Bank" poppins style={tw`btn`} outline onPress={handleDeleteBank} disabled={loading} />
      </View>
    </View>
  );
};

export default AccountList;
