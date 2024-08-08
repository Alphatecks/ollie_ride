import { Text, View, Image } from "react-native";
import { Button } from '@rneui/themed';
import tw from 'twrnc';
import Onboarding from 'react-native-onboarding-swiper';
import { useFonts } from 'expo-font';
import { Link, useRouter } from "expo-router"


// import OnboardingImg1 from "@/assets/images/svg/car_select.svg"

export default function Index() {
  //   const [fontsLoaded, fontError] = useFonts({
  //   'Raleway-Black': require('./assets/fonts/Raleway-Black.ttf'),
  //   'Raleway-Regular': require('./assets/fonts/Raleway-Regular.ttf'),
  //   'Raleway-Medium': require('./assets/fonts/Raleway-Medium.ttf'),
  //   'Raleway-Bold': require('./assets/fonts/Raleway-Bold.ttf'),
  //   'Raleway-Light': require('./assets/fonts/Raleway-Light.ttf'),
  //   'Raleway-Italic': require('./assets/fonts/Raleway-Italic.ttf'),
  // });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded || fontError) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded, fontError]);

  // if (!fontsLoaded && !fontError) {
  //   return null;
  // }

  // if (!fontsLoaded) {
  //   return null;
  // }

  const router = useRouter();

  const navigateToHome = () => {
    console.log("inside func")
    router.push('/onboarding'); // Use 'push' to navigate to a new screen
  };

  return (
    <View style = {tw`bg-red-200 flex-1`} >
      <Onboarding
        bottomBarColor = "white"
        // SkipButtonComponent = {()=> <Text>jkfjk</Text>}
        onSkip = {()=> console.log("Skipped...")}
        showDone = {true}
        onDone = {()=> router.push('/auth') }
        pages={[
          {
            backgroundColor: 'white',
            image: <Image source={require('../assets/images/onboarding/carpool.png')}
              style = {tw`h-[200px] w-[200px]`}
             />, 
            title: 'Anywhere you are',
            subtitle: 'We provide you with seamless ride-sharing service regardless of your location. Join and travel hassle-free',
          },
          {
            backgroundColor: 'white',
            // image: <OnboardingImg1 />,
            image: <Image source={require('../assets/images/onboarding/carsharing.png')}
              style = {tw`h-[200px] w-[200px]`}
             />,
            title: 'Group Rides',
            subtitle: 'Experience the convenience of group rides anywhere you are, with friends, family, acquintances or teammates',
          },
          {
            backgroundColor: 'white',
            // image: <OnboardingImg1 />,
            image: <Image source={require('../assets/images/onboarding/schedule.png')}
              style = {tw`h-[200px] w-[200px]`}
             />,
            title: 'Anywhere you are',
            subtitle: 'We provide you with seamless ride-sharing service regardless of your location. Join and travel hassle-free',
          },
         {
            backgroundColor: 'white',
            // image: <OnboardingImg1 />,
            image: <Image source={require('../assets/images/onboarding/logistics.png')}
              style = {tw`h-[200px] w-[200px]`}
             />,
            title: 'Anywhere you are',
            subtitle: 'We provide you with seamless ride-sharing service regardless of your location. Join and travel hassle-free',
          },
        ]}
      />
    </View>
  );
}
