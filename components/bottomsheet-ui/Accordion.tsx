import React, { useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

interface AccordionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, icon, children }) => {
  const [expanded, setExpanded] = useState(false);
  const animation = new Animated.Value(expanded ? 1 : 0);

  const toggleAccordion = () => {
    setExpanded(!expanded);
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80], // Adjust height as needed
  });

  return (
    <View style={tw`bg-white rounded-xl shadow-sm my-2`}>
      {/* Header */}
      <TouchableOpacity
        onPress={toggleAccordion}
        style={tw`flex-row items-center justify-between p-4`}
        activeOpacity={0.7}
      >
        <View style={tw`flex-row items-center gap-3`}>
          {icon}
          <Text style={tw`text-base text-black`}>{title}</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <MaterialIcons name="expand-more" size={24} color="black" />
        </Animated.View>
      </TouchableOpacity>

      {/* Expandable Content */}
      <Animated.View style={[tw`overflow-hidden`, { height }]}>
        <View style={tw`p-4`}>{children}</View>
      </Animated.View>
    </View>
  );
};

export default Accordion;
