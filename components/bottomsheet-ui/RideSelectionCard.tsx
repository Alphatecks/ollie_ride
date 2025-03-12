import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';

const RideSelectionCard = ({
  // Customizable props with defaults
  title = "Economy",
  description = "3 seats capacity",
  price = "$1",
  unit = "km",
  duration = "5 min",
  selected = true,
  icon = "file",
  onPress,
  
  // Customizable styles
  containerStyle = {},
  selectedColor = "#002D62",
  unselectedColor = "#E5E7EB",
  textColor = "#1F2937",
  descriptionColor = "#6B7280",
  priceColor = "#1F2937",
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`p-4 border rounded-xl mb-3`,
        selected ? tw`border-2` : tw`border`,
        selected ? { borderColor: selectedColor } : { borderColor: unselectedColor },
        containerStyle,
      ]}
      activeOpacity={0.7}
    >
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <View style={[
            tw`w-10 h-10 rounded-lg items-center justify-center mr-4`,
            { backgroundColor: selected ? selectedColor : unselectedColor },
          ]}>
            <Feather name={icon} size={20} color={selected ? "white" : textColor} />
          </View>
          
          <View style={tw`flex-1`}>
            <View style={tw`flex-row items-start justify-between`}>
              <View>
                <Text style={[tw`text-base font-medium`, { color: textColor }]}>
                  {title}
                </Text>
                <Text style={[tw`text-sm`, { color: descriptionColor }]}>
                  {description}
                </Text>
              </View>
              
              <View style={tw`items-end`}>
                <Text style={[tw`text-base font-medium`, { color: priceColor }]}>
                  {price}<Text style={tw`text-sm font-normal`}>/{unit}</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {selected && (
          <View style={[
            tw`absolute top-2 right-2 w-6 h-6 rounded-full items-center justify-center`,
            { backgroundColor: selectedColor }
          ]}>
            <Feather name="check" size={16} color="white" />
          </View>
        )}
        
        {duration && (
          <View style={tw`absolute top-2 left-1/2 -translate-x-1/2`}>
            <Text style={[tw`text-xs px-2 py-1 rounded-full`, { color: descriptionColor }]}>
              {duration}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RideSelectionCard;