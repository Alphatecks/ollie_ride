import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import Text from 'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { collection, onSnapshot } from 'firebase/firestore'; // Firestore methods for real-time updates
import { auth, db } from '@/firebaseConfig'; // Import Firebase auth and Firestore
import { useRouter } from 'expo-router';
import PaymentCard from '@/components/payment/PaymentCard';
import tw from '@/tailwind';

const AccountList = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    // Reference to the "bankAccounts" subcollection
    const bankAccountsRef = collection(db, 'users', currentUser.uid, 'bankAccounts');

    // Set up real-time listener with onSnapshot
    const unsubscribe = onSnapshot(bankAccountsRef, (snapshot) => {
      if (snapshot.empty) {
        setBankAccounts([]); // No bank accounts found
      } else {
        const accounts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBankAccounts(accounts); // Store the fetched bank accounts in state
      }
      setLoading(false); // Stop loading after data is fetched
    }, (error) => {
      console.error('Error fetching real-time bank accounts:', error);
      Alert.alert('Error', 'Failed to listen for bank account updates');
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={tw`bg-white p-3 flex-1`}>
      <Text poppinsMedium>All Bank Accounts</Text>

      {bankAccounts.length > 0 ? (
        <View style={tw`flex-1 justify-between`}>
        	<View>
	          {bankAccounts.map((account) => (
	            <PaymentCard
	              key={account.id}
	              title={`***${account.bankAccount.slice(-4)}`} // Display last 4 digits of the account
	              subtitle={account.bankName}
	              icon={<FontAwesome name="bank" size={24} color="black" />}
	              href={`payment/${account.id}`} // Navigate to bank detail page
	            />
	          ))}
        	</View>
	        <Button
	          label="Add New Bank"
	          poppins
	          style={tw`btn mt-5`}
	          disabled={loading}
	          onPress = {()=>router.push('payment/add_bank')}
        />
        </View>
      ) : (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text poppins center style={tw`mb-4`}>
            You don't have any accounts added, please add one to view them.
          </Text>
          <Button
            label="Add Bank Details"
            onPress={() => router.push('payment/add_bank')} // Navigate to add bank details screen
            style={tw`btn`}
          />
        </View>
      )}
    </View>
  );
};

export default AccountList;
