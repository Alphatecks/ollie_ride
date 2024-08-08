import { View, Text } from 'react-native'
import tw from 'twrnc';
import Onboarding from 'react-native-onboarding-swiper';


const OnboardingFlow = () => {
	return (
		<View>
		  <Onboarding
        pages={[
          {
            backgroundColor: 'white',
            // image: <OnboardingImg1 />,
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
	)
}

export default OnboardingFlow;