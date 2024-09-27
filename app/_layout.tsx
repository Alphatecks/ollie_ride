import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import tw from "twrnc"
import { useDeviceContext } from 'twrnc';

import {
  Colors, Typography, ThemeManager
} from 'react-native-ui-lib';

import { useColorScheme } from '@/components/useColorScheme';
import { Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold,
Inter_700Bold,
Inter_800ExtraBold,
Inter_900Black } from '@expo-google-fonts/inter'

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

Colors.loadColors({
  primaryColor: '#fa8a00',
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
  inter: { fontFamily: 'Inter_400Regular' },
  interBold: { fontFamily: 'Inter_700Bold' },
  interLight: { fontFamily: 'Inter_300Light' },
  interThin: { fontFamily: 'Inter_100Thin' },
  interMedium: { fontFamily: 'Inter_500Medium' }
});

  // Loading custom themes
ThemeManager.setComponentTheme('Button', (props, context) => {
    if (props.square) {
      return {
        borderRadius: 0,
        padding: 70,
        paddingBottom: 12,
        width: "100%",
        marginVertical: 4,
        backgroundColor: props.outline ? '#014D3D' : '#e67e00',
      };
    }
    if (props.rounded) {
      return {
        borderRadius: 5,
        padding: 70,
        paddingBottom: 12,
        marginVertical: 4,
        backgroundColor: props.outline ? '#008955' : '#e67e00',
        color: props.outline ? '#008955' : 'white',
        borderColor: props.outline ? '#008955' : '',
      };
    }
    if (props.outline) {
      return {
        borderRadius: 4,
        padding: 70,
        paddingBottom: 12,
        color: '#1D0BBB',
        borderColor: '#1D0BBB',
      };
    }

    return {
      backgroundColor: "#fa8a00"
    }
  });

  const TextFieldStyle = tw`border-[1px] border-[#B3B3B3] p-3 w-full rounded-md`;

  ThemeManager.setComponentTheme('TextField', (props, context) => {
    if (props.rounded) {
      return TextFieldStyle;
    }
  });



export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black 
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
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    // </ThemeProvider>
  );
}
