import React from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import tw from "twrnc"
import { useDeviceContext } from 'twrnc';



import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

import Entypo from '@expo/vector-icons/Entypo';


// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  // const colorScheme = useColorScheme();
  useDeviceContext(tw);

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarActiveTintColor: "blue",
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
        tabBarLabelStyle: { fontFamily: "Poppins_400Regular", fontSize: 12, },
        tabBarStyle: tw`elevation-0 border-t-0 h-14 dark:bg-black`,
        headerTitleAlign: "center",
        headerTitleStyle: {fontFamily: "Poppins_400Regular"}
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />,
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
          tabBarIcon: ({ color }) => <MaterialIcons name="history" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          headerShown: true,
          tabBarIcon: ({ color }) => <MaterialIcons name="notifications" size={24} color={color}  />,
        }}
      />
    </Tabs>
  );
}
