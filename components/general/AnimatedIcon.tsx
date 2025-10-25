import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc'; // Assuming you're using twrnc

const AnimatedIcon = () => {
  const colorAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the looping animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnimation, {
          toValue: 1,
          duration: 1000, // 1 second to change to dark green
          useNativeDriver: false, // Required because color interpolation isn't natively supported
        }),
        Animated.timing(colorAnimation, {
          toValue: 0,
          duration: 600, // 1 second to change back to green
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [colorAnimation]);

  // Interpolate the animated value to transition between colors
  const iconColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['green', 'darkgreen'], // Define color range
  });

  return (
    <View style={tw`py-3 absolute top-2 left-3`}>
      <Animated.Text
        style={{
          color: iconColor, // Use the interpolated color here
        }}
      >
        <FontAwesome name="car" size={24} />
      </Animated.Text>
    </View>
  );
};

export default AnimatedIcon;
