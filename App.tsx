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
import SplashScreen from './app/splash';
import IndexScreen from './app/index';
import OnboardingScreen from './app/onboarding';
import LocationPermissionScreen from './app/location_permission';

// Auth screens
import SignInScreen from './app/auth/sign_in';
import SignUpScreen from './app/auth/sign_up';
import PhoneVerifyScreen from './app/auth/phone_verify';
import ForgotPasswordScreen from './app/auth/forgot_password';
import SetPasswordScreen from './app/auth/set_password';
import AwaitEmailVerificationScreen from './app/auth/await_email_verification';
import ProfileScreen from './app/auth/profile';

// Tab screens  
import Bottomsheet2Screen from './app/(tabs)/bottomsheet2/index';
import RentalScreen from './app/(tabs)/rental';
import WalletScreen from './app/(tabs)/wallet';
import HistoryScreen from './app/(tabs)/history';
import NotificationsScreen from './app/(tabs)/notifications';
import ProfileTabScreen from './app/(tabs)/profile';

// Bottomsheet2 sub-screens (ride booking flow)
import BookRideScreen from './app/(tabs)/bottomsheet2/book_ride';
import BookForSelfScreen from './app/(tabs)/bottomsheet2/book_for_self';
import SearchingDriverScreen from './app/(tabs)/bottomsheet2/searching_driver';
import DriverArrivingScreen from './app/(tabs)/bottomsheet2/driver_arriving';
import PaymentMethodScreen from './app/(tabs)/bottomsheet2/payment_method';
import ReachedDestinationScreen from './app/(tabs)/bottomsheet2/reached_destination';

// Wallet and Payment screens
import WithdrawScreen from './app/wallet_aux/withdraw';
import WithdrawSuccessScreen from './app/wallet_aux/withdraw_success';
import PaymentIndexScreen from './app/payment/index';
import AccountListScreen from './app/payment/account_list';

// Riding flow utility screens
import CancelRideScreen from './app/riding_flow/cancel_ride';
import DownloadReceiptScreen from './app/riding_flow/download_receipt';

// Rental screens
import CarDetailScreen from './app/rental/car-details';
import BookCarScreen from './app/rental/book-car';
import SelfDriveRequirementScreen from './app/rental/self-drive-requirement';
import BookingSummaryScreen from './app/rental/booking-summary';
import ChoosePaymentMethodScreen from './app/rental/choose-payment-method';

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

// MainTabs component - Rider only
function MainTabs() {
  const insets = useSafeAreaInsets();
  const user = auth.currentUser;
  useDeviceContext(tw);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: baseColor,
        headerShown: false,
        tabBarLabelStyle: { fontFamily: "Poppins_400Regular", fontSize: 12 },
        tabBarStyle: tw`elevation-0 border-t-0 h-[70px] py-2 dark:bg-black`,
        headerTitleAlign: "center",
        tabBarHideOnKeyboard: true
      }}>
      <Tab.Screen
        name="Home"
        component={Bottomsheet2Screen}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />,
        }}
      />

        <Tab.Screen
          name="Rental"
          component={RentalScreen}
          options={{
            title: 'Car Rental',
            headerShown: true,
            headerTitleStyle: { fontFamily: 'Poppins-Regular', fontWeight: 'bold' },
            tabBarLabel: "Rental",
            tabBarIcon: ({ color }) => <MaterialIcons name="car-rental" size={24} color={color} />,
          }}
        />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'History',
          headerShown: true,
          headerTitleStyle: { fontFamily: 'Poppins-Regular' },
          tabBarLabel: "History",
          tabBarIcon: ({ color }) => <MaterialIcons name="history" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          title: 'My Wallet',
          headerShown: true,
          headerTitleStyle: { fontFamily: 'Poppins-Regular' },
          tabBarLabel: "Wallet",
          tabBarIcon: ({ color }) => <MaterialIcons name="wallet" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileTabScreen}
        options={{
          title: 'My Profile',
          headerShown: true,
          headerTitleStyle: { fontFamily: 'Poppins-Regular' },
          tabBarLabel: "Profile",
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
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="SetPassword" component={SetPasswordScreen} />
      <Stack.Screen name="AwaitEmailVerification" component={AwaitEmailVerificationScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Index" component={IndexScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Auth" component={AuthStack} />
          <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          
          {/* Ride booking flow screens */}
          <Stack.Screen name="BookRide" component={BookRideScreen} />
          <Stack.Screen name="BookForSelf" component={BookForSelfScreen} />
          <Stack.Screen name="SearchingDriver" component={SearchingDriverScreen} />
          <Stack.Screen name="DriverArriving" component={DriverArrivingScreen} />
          <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
          <Stack.Screen name="ReachedDestination" component={ReachedDestinationScreen} />

          {/* Wallet and Payment screens */}
          <Stack.Screen name="Withdraw" component={WithdrawScreen} />
          <Stack.Screen name="WithdrawSuccess" component={WithdrawSuccessScreen} />
          <Stack.Screen name="Payment" component={PaymentIndexScreen} />
          <Stack.Screen name="AccountList" component={AccountListScreen} />

          {/* Riding flow utility screens */}
          <Stack.Screen name="CancelRide" component={CancelRideScreen} />
          <Stack.Screen name="DownloadReceipt" component={DownloadReceiptScreen} />
          
          {/* Rental screens */}
          <Stack.Screen name="CarDetail" component={CarDetailScreen} />
          <Stack.Screen name="BookCar" component={BookCarScreen} />
          <Stack.Screen name="SelfDriveRequirement" component={SelfDriveRequirementScreen} />
          <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
          <Stack.Screen name="ChoosePaymentMethod" component={ChoosePaymentMethodScreen} />
          
          {/* Other screens */}
          <Stack.Screen 
            name="Notifications" 
            component={NotificationsScreen} 
            options={{ 
              headerShown: true, 
              title: 'Notifications',
              headerTitleStyle: { fontFamily: 'Poppins-Regular' }
            }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}