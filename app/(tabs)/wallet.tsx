import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, Button } from 'react-native-ui-lib';
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../tailwind";
import { useNavigation } from '@react-navigation/native';
import { BarChart } from "react-native-gifted-charts";
import { doc, getDoc, onSnapshot } from 'firebase/firestore'; // Firestore methods
import { auth, db } from '../../firebaseConfig'; // Firebase setup
import { DriverData } from '../../types';


console.log(auth.currentUser)


const Wallet = () => {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [userData, setUserData] = useState<DriverData>()
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const navigation = useNavigation();

  // Fetch the current totalBalance and then listen for changes
  useEffect(() => {
    const fetchBalance = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);

        try {
          // Fetch the current balance first
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const _userData = userDocSnapshot.data();
            console.log(_userData)
            setTotalBalance(_userData.totalBalance || 0);
            setUserData(_userData)
          }

          // Now set up the real-time listener
          const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              setTotalBalance(userData.totalBalance || 0);
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

    fetchBalance();
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const barData = [
    { value: 250, label: 'M' },
    { value: 500, label: 'T', frontColor: '#177AD5' },
    { value: 745, label: 'W', frontColor: '#177AD5' },
    { value: 320, label: 'T' },
    { value: 600, label: 'F', frontColor: '#177AD5' },
    { value: 256, label: 'S' },
    { value: 300, label: 'S' },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1 bg-white p-3`}>
      <View style={tw`flex-row gap-4 border border-[0.8px] p-4 rounded-md border-blue-900 my-3`}>
        <View style={tw`flex-grow`}>
          <Text poppins style={tw`text-gray-500`}>Wallet Balance</Text>
          <Text poppinsMedium h2 onPress = {()=> navigation.navigate('DownloadReceipt')} >₦{totalBalance.toFixed(2)}</Text>
        </View>
        <View style={tw`flex-grow justify-center`}>
          <Button
            label="Add Money"
            style={tw`btn`}
            poppins
            onPress={() => navigation.navigate('Withdraw')}
          />
        </View>
      </View>

      {/* Bar Chart and Other Stats */}
      <View style={tw`items-center my-4`}>
        <Text poppins>Dec 18 - 16</Text>
        <Text poppinsMedium h2 onPress = {()=> navigation.navigate('CancelRide')}>₦0.00</Text>
      </View>

      <View style={tw`my-4`}>
        <BarChart
          barWidth={22}
          noOfSections={3}
          barBorderRadius={4}
          frontColor="lightgray"
          data={barData}
          yAxisThickness={0}
          xAxisThickness={0}
          labelTextStyle={tw`poppins`}
          xAxisLabelTextStyle={tw`poppins`}
          yAxisLabelTextStyle={tw`poppins`}
          isAnimated
        />
      </View>

      <View style={tw`flex-row gap-4 justify-evenly my-3`}>
        <View>
          <Text poppins style={tw`text-gray-500`}>Total Trips</Text>
          <Text poppinsMedium>{userData?.totalTrips}</Text>
        </View>
        <View>
          <Text poppins style={tw`text-gray-500`}>Time Online</Text>
          <Text poppinsMedium>{userData?.totalTimeOnline} Days</Text>
        </View>
        <View>
          <Text poppins style={tw`text-gray-500`}>Distance Covered</Text>
          <Text poppinsMedium>{userData?.totalDistanceCovered} km</Text>
        </View>
      </View>

      {/* Earnings Section */}
    </ScrollView>
  );
};

export default Wallet;
