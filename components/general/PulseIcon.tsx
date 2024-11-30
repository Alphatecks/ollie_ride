import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import tw from '@/tailwind';

type PulsingCarIconProps = {
    handlePress: () => void;
}


const PulsingCarIcon = ({handlePress}: PulsingCarIconProps) => {
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start the pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 1.2, // Scale up to 1.5 times the size
          duration: 1000, // Duration for scaling up
          useNativeDriver: true, // Use native driver for better performance
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1, // Scale back to the original size
          duration: 1000, // Duration for scaling down
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnimation]);

  return (
    <View style={tw`absolute top-2 left-2`}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnimation }], // Apply the scale animation
        }}
      >
        <FontAwesome name="car" size={24} color="green" onPress={handlePress} />
      </Animated.View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     top: 100,
//     left: 50,
//   },
// });

export default PulsingCarIcon;
