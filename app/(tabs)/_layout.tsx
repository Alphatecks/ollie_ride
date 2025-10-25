import { useState, useEffect } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import tw from "../../tailwind";
import { useDeviceContext } from 'twrnc';
import Text from "react-native-ui-lib/text";
import Entypo from 'react-native-vector-icons/Entypo';
import { Badge } from 'react-native-ui-lib';
import { baseColor } from '../../constants/Colors';


export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(false); // Default to false initially
  const [isLoading, setIsLoading] = useState(false); // Default to false initially
  const user = auth.currentUser;
  useDeviceContext(tw);

  // Fetch user's current isOnline status when component mounts
  useEffect(() => {
    const fetchOnlineStatus = async () => {
      try {
        if (user) {
          const userRef = doc(db, 'drivers', user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setIsOnline(userData.isOnline || false); // Use current status or default to false
          }
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchOnlineStatus();
  }, [user]);

  // Toggle isOnline status in Firestore and update UI state
  const updateOnlineStatus = async () => {
    try {
      setIsLoading(true)
      const userRef = doc(db, 'drivers', user.uid);
      await updateDoc(userRef, { isOnline: !isOnline });
      setIsOnline((prevStatus) => !prevStatus); // Toggle local state
      console.log('Toggled the isOnline State');
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error('Error updating document:', error);
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: baseColor,
        headerShown: false,
        tabBarLabelStyle: { fontFamily: "Poppins_400Regular", fontSize: 12 },
        tabBarStyle: tw`elevation-0 border-t-0 h-14 dark:bg-black`,
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: "Poppins_400Regular" },
        tabBarHideOnKeyboard: true,
        tabBarStyle: tw`h-[70px] py-2`
      }}>
      <Tabs.Screen
        name="bottomsheet2"
        options={{
          headerShown: true,
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />,
          header: () => {
            return (
              <View style={[
                tw`h-[70px] bg-white items-center`,
                { paddingTop: insets.top || 10 }
              ]}>
                <TouchableOpacity style={tw`${isOnline ? "bg-ollie-base" : "bg-gray-800 opacity-80"} w-30 rounded-full`}
                  onPress={updateOnlineStatus}>
                  {isLoading ?
                    <ActivityIndicator size = "large" color = "white" />
                    :
                    <View style={tw`flex-row items-center justify-around`}>
                      <Text style={tw`text-white p-2`} poppins center>
                        {isOnline ? "Online" : "Offline"}
                      </Text>
                      <Ionicons name="car-sharp" size={24}  style={tw`text-ollie-base bg-white rounded-full`} />
                    </View>
                  }
                </TouchableOpacity>
              </View>
            );
          },
        }}
      />


      <Tabs.Screen
        name="wallet"
        options={{
          title: 'My Wallet',
          headerShown: true,
          tabBarIcon: ({ color }) => <MaterialIcons name="wallet" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          headerShown: true,
          tabBarIcon: ({ color }) => 
            <View>
              <MaterialIcons name="history" size={28} color={color} />
            </View>
          ,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          headerShown: true,
          tabBarIcon: ({ color }) => 
          <View>
              <Badge backgroundColor='green' size={10}/>
              <MaterialIcons name="notifications" size={24} color={color} />
          </View>
          ,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          headerShown: true,
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
