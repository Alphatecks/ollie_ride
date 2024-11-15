import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import tw from "twrnc"
import { useDeviceContext } from 'twrnc';

import Toast from 'react-native-toast-message';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  Colors, Typography, ThemeManager
} from 'react-native-ui-lib';

import { useColorScheme } from '@/components/useColorScheme';
import { Poppins_100Thin, Poppins_200ExtraLight, Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold,
Poppins_700Bold, Poppins_400Regular_Italic,
Poppins_800ExtraBold,
Poppins_900Black } from '@expo-google-fonts/poppins'

export {
  ErrorBoundary,
} from 'expo-router';

import {
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-native-sdk';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

type User = {
  id: string;
  name: string;
  image: string;
}


// Setup RNUILIB

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
  poppins: { fontFamily: 'Poppins_400Regular' },
  poppinsBold: { fontFamily: 'Poppins_700Bold' },
  poppinsLight: { fontFamily: 'Poppins_300Light' },
  poppinsThin: { fontFamily: 'Poppins_100Thin' },
  poppinsMedium: { fontFamily: 'Poppins_500Medium' }
});
  
const btnStyle = tw`bg-blue-900 rounded-md py-5 my-10 text-white`


  const TextFieldStyle = tw`border-[1px] border-[#B3B3B3] p-3 w-full rounded-md`;

  ThemeManager.setComponentTheme('TextField', (props, context) => {
    if (props.rounded) {
      return TextFieldStyle;
    }
  });



export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_100Thin, Poppins_200ExtraLight, Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_400Regular_Italic,
    Poppins_800ExtraBold,
    Poppins_900Black 
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  useDeviceContext(tw); // <- 👋

  
  const user: User = {
    id: "User111",
    name: 'John Malkovich',
    image: 'https://robohash.org/John',
  };

  const client = new StreamVideoClient({ apiKey: "kr9y2trtec48", user, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlcjExMSJ9.xhYqRBeTjA2NUQuh7HOJXsWvNnksC8xOjwDC-qDUEjc" });




  return (
    <>
    <GestureHandlerRootView style={{ flex: 1 }}>
    <StreamVideo client={client}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="riding_flow" options={{ headerShown: false }} />
        <Stack.Screen name="wallet_aux" options={{ headerShown: false }} />
        <Stack.Screen name="document_aux" options={{ headerShown: false }} />
        <Stack.Screen name="payment" options={{ headerShown: false }} />
        <Stack.Screen name="history_aux" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
        <Stack.Screen name="bottomsheet" options={{ headerShown: false }} />
      </Stack>
      </StreamVideo>
      <Toast />
    </ GestureHandlerRootView>
    </>
  );
}
