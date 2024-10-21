import React, { useState, useEffect } from 'react';
import Text from 'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import { TextInput, View, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import tw from '@/tailwind';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { auth, db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore'; // Firestore methods

const Withdraw = () => {
  const [amount, setAmount] = useState<number>(0);
  const [bankAccount, setBankAccount] = useState(null); // To store the first bank account
  const [loading, setLoading] = useState(true); // To show a loading state
  const router = useRouter();

  useEffect(() => {
    const fetchBankAccount = async () => {
      setLoading(true);
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          Alert.alert('Error', 'User not authenticated');
          setLoading(false);
          router.push("/")

          return;
        }

        // Reference to the "bankAccounts" subcollection
        const bankAccountsRef = collection(db, 'users', currentUser.uid, 'bankAccounts');
        const snapshot = await getDocs(bankAccountsRef);

        if (!snapshot.empty) {
          const accounts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setBankAccount(accounts[0]); // Set the first bank account
        } else {
          setBankAccount(null); // No bank accounts found
        }
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
        Alert.alert('Error', 'Failed to fetch bank accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccount();
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
       <ActivityIndicator color = "green" size  = "large" />
      </View>
    );
  }

  console.log(amount)

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`bg-ollie-base p-3 gap-5 py-9`}>
        <Text poppins center style={tw`text-white`}>Enter amount to withdraw</Text>
        <TextInput
          style={tw`poppins p-4 border rounded-md border-gray-400 text-3xl text-white text-center`}
          keyboardType="numeric"
          onChangeText={(text) => setAmount(Number(text.replace(/[^0-9]/g, '')))} // Restricts input to numbers only
          value={amount.toString()}
        />
      </View>

      {/* Check if user has a bank account */}
      {bankAccount ? (
        <View style={tw`flex-row items-center justify-between border border-blue-900 p-5`}>
          <View style={tw`flex-row items-center gap-2`}>
            <FontAwesome name="bank" size={22} style={tw``} />
            <View>
              <Text style={tw``} poppins>****{bankAccount.bankAccount.slice(-4)}</Text>
              <Text style={tw``} poppins>{bankAccount.bankName}</Text>
            </View>
          </View>
          <AntDesign name="right" size={24} color="grey" />
        </View>
      ) : (
        // If no bank account is found, show the "Add Bank Account" UI
        <View style={tw`items-center p-4 gap-3`}>
          <Ionicons name="trash-bin-outline" size={40} color="black" onPress={() => router.push('payment/account_list')} />
          <Text poppins center style={tw``}>Please add a bank account first before withdrawal</Text>
          <Button
            poppins
            label="Add Bank Details"
            style={tw`btn`}
            onPress={() => router.push('payment/add_bank')}
          />
        </View>
      )}

      {/* Earnings section */}

	      <View style={tw`p-3 flex-1`}>
	        <View style={tw`gap-3 my-4`}>
	          <View style={tw`flex-row justify-between`}>
	            <Text poppinsMedium>Earnings</Text>
	            <Text poppinsMedium>$400.24</Text>
	          </View>
	          <View style={tw`flex-row justify-between`}>
	            <Text poppins>Trip Earnings</Text>
	            <Text poppins>$20.24</Text>
	          </View>
	          <View style={tw`flex-row justify-between`}>
	            <Text poppins>Tax</Text>
	            <Text poppins style={tw`text-red-500`}>$40.24</Text>
	          </View>
	        </View>

	        <View style={tw`h-[0.5px] bg-gray-500 my-8`}></View>

	        <View style={tw`flex-1 justify-between`}>
	          <View style={tw`flex-row justify-between`}>
	            <Text poppinsBold>Total</Text>
	            <Text poppinsBold>$400.24</Text>
	          </View>
	          <Button
	            poppins
	            label="Withdraw"
	            style={tw`btn`}
	            onPress={() => router.push('wallet_aux/withdraw_success')}
	            disabled={!bankAccount}
	          />
	        </View>
	      </View>

    </View>
  );
};

export default Withdraw;
