import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState, useEffect } from 'react';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth, db } from "./firebaseConfig";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import tw from "./tailwind";
import { useDeviceContext } from 'twrnc';
import Text from "react-native-ui-lib/text";
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Badge, Typography, Colors } from 'react-native-ui-lib';
import { baseColor } from './constants/Colors';
import Toast from 'react-native-toast-message';

// Import all screens
import IndexScreen from './app/index';
import OnboardingScreen from './app/onboarding';

// Auth screens
import SignInScreen from './app/auth/sign_in';
import SignUpScreen from './app/auth/sign_up';
import PhoneVerifyScreen from './app/auth/phone_verify';
import ForgotPasswordScreen from './app/auth/forgot_password';
import SetPasswordScreen from './app/auth/set_password';
import AwaitEmailVerificationScreen from './app/auth/await_email_verification';
import ProfileScreen from './app/auth/profile';
import UploadCarDetailsScreen from './app/auth/upload_car_details';
import PaymentDetailsScreen from './app/auth/payment_details';

// Tab screens  
import Bottomsheet2Screen from './app/(tabs)/bottomsheet2/index';
import WalletScreen from './app/(tabs)/wallet';
import HistoryScreen from './app/(tabs)/history';
import NotificationsScreen from './app/(tabs)/notifications';
import ProfileTabScreen from './app/(tabs)/profile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Setup RNUILIB Typography with Poppins fonts
Colors.loadDesignTokens({primaryColor: '#1e3a8a' });

Colors.loadColors({
  primaryColor: '#1e3a8a',
  secondaryColor: '#C1BBE2',
  textColor: '##414141',
  errorColor: '#E63B2E',
  successColor: '#ADC76F',
  warnColor: '#FF963C',
});

Typography.loadTypographies({
  h1: { fontSize: 58, fontWeight: '300', lineHeight: 80 },
  h2: { fontSize: 24 },
  p1: { fontSize: 16 },
  p2: { fontSize: 14 },
  center: { textAlign: "center" },
  right: { textAlign: "right" },
  left: { textAlign: "left" },
  authText: { fontSize: 30, color: "#08633D" },
  poppins: { fontFamily: 'Poppins-Regular' },
  poppinsBold: { fontFamily: 'Poppins-Bold' },
  poppinsLight: { fontFamily: 'Poppins-Light' },
  poppinsThin: { fontFamily: 'Poppins-Thin' },
  poppinsMedium: { fontFamily: 'Poppins-Medium' }
});

// MainTabs component with custom header
function MainTabs() {
  const insets = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
            setIsOnline(userData.isOnline || false);
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
      if (user) {
        const userRef = doc(db, 'drivers', user.uid);
        await updateDoc(userRef, { isOnline: !isOnline });
        setIsOnline((prevStatus) => !prevStatus);
        console.log('Toggled the isOnline State');
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error('Error updating document:', error);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: baseColor,
        headerShown: false,
        tabBarLabelStyle: { fontFamily: "Poppins_400Regular", fontSize: 12 },
        tabBarStyle: tw`elevation-0 border-t-0 h-[70px] py-2 dark:bg-black`,
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: "Poppins_400Regular" },
        tabBarHideOnKeyboard: true
      }}>
      <Tab.Screen
        name="Home"
        component={Bottomsheet2Screen}
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

      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          title: 'My Wallet',
          headerShown: true,
          tabBarIcon: ({ color }) => <MaterialIcons name="wallet" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
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
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
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
      <Tab.Screen
        name="ProfileTab"
        component={ProfileTabScreen}
        options={{
          title: 'My Profile',
          headerShown: true,
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Auth Stack Navigator
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="PhoneVerify" component={PhoneVerifyScreen} />
      <Stack.Screen name="PaymentDetails" component={PaymentDetailsScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="SetPassword" component={SetPasswordScreen} />
      <Stack.Screen name="AwaitEmailVerification" component={AwaitEmailVerificationScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="UploadCarDetails" component={UploadCarDetailsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Index">
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Index" component={IndexScreen} />
          <Stack.Screen name="Auth" component={AuthStack} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}