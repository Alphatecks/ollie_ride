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
Poppins_700Bold,
Poppins_800ExtraBold,
Poppins_900Black } from '@expo-google-fonts/poppins'

export {
  ErrorBoundary,
} from 'expo-router';

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: '(tabs)',
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();



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

// console.log(btnStyle)
  // Loading custom themes
// ThemeManager.setComponentTheme('Button', (props, context) => {
//     if (props.square) {
//       return {
//         borderRadius: 0,
//         padding: 70,
//         paddingBottom: 12,
//         width: "100%",
//         marginVertical: 4,
//         backgroundColor: props.outline ? '#014D3D' : '#e67e00',
//       };
//     }
//     if (props.rounded) {
//       return {
//         borderRadius: 5,
//         padding: 70,
//         paddingBottom: 12,
//         marginVertical: 4,
//         backgroundColor: props.outline ? '#008955' : '#e67e00',
//         color: props.outline ? '#008955' : 'white',
//         borderColor: props.outline ? '#008955' : '',
//       };
//     }
//     if (props.outline) {
//       return {
//         borderRadius: 4,
//         padding: 70,
//         paddingBottom: 12,
//         color: '#1D0BBB',
//         borderColor: '#1D0BBB',
//       };
//     }
//     if (props.default) {
//       return {
//         borderRadius: 0,
//         padding: 70,
//         paddingBottom: 100,
//         width: "100%",
//         height: 100,
//         marginVertical: 10,
//         backgroundColor: props.outline ? '#014D3D' : '#e67e00',
//       }
//     }

//   });

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


  return (
    <>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="wallet_aux" options={{ headerShown: false }} />
        <Stack.Screen name="history_aux" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </ GestureHandlerRootView>
    </>
  );
}
