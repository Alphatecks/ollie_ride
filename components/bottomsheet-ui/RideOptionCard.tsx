import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import { FlatList } from 'react-native';


interface RideOption {
  id: string;
  title: string;
  description: string;
  price: string;
  unit: string;
  duration: string;
  selected?: boolean;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  selectedColor?: string;
  unselectedColor?: string;
  borderColor?: string;
  textColor?: string;
  descriptionColor?: string;
  priceColor?: string;
  priceUnitColor?: string;
  iconColor?: string;
}

const RideOptionCard: React.FC<RideOption> = ({
  id = 'economy',
  title = 'Economy',
  description = '3 seats capacity',
  price = '$1',
  unit = 'km',
  duration = '5 min',
  selected = false,
  onPress,
  containerStyle = {},
  selectedColor = '#002D62',
  unselectedColor = '#FFFFFF',
  borderColor = '#002D62',
  textColor = '#000000',
  descriptionColor = '#6B7280',
  priceColor = '#000000',
  priceUnitColor = '#6B7280',
  iconColor = '#002D62',
}) => {
  const renderVehicleIcon = () => {
    switch (id) {
      case 'economy':
        return <MaterialCommunityIcons name="car-hatchback" size={28} color={iconColor} />;
      case 'premium':
        return <MaterialCommunityIcons name="car-sedan" size={28} color={iconColor} />;
      case 'van':
        return <MaterialCommunityIcons name="van-passenger" size={28} color={iconColor} />;
      default:
        return <MaterialCommunityIcons name="car" size={28} color={iconColor} />;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`p-4 rounded-xl border`,
        selected ? { borderColor: borderColor, borderWidth: 2 } : { borderColor: '#E5E7EB', borderWidth: 1 },
        { backgroundColor: unselectedColor },
        tw`w-[109px]`,
        containerStyle,
      ]}
      activeOpacity={0.7}
    >
      {selected && (
        <View style={tw`absolute -top-2 -right-2 z-10`}>
          <View style={[tw`w-10 h-10 rounded-full items-center justify-center`, { backgroundColor: selectedColor }]}>
            <Feather name="check" size={20} color="white" />
          </View>
        </View>
      )}
      <View style={tw`items-center mt-2`}>
        <View style={tw`mb-1`}>{renderVehicleIcon()}</View>
        <Text style={[tw`text-sm font-medium mb-2`, { color: textColor }]}>{duration}</Text>
      </View>
      <View style={tw`h-px bg-gray-200 my-2`} />
      <View style={tw`flex-row justify-between items-center`}>
        <View>
          <Text style={[tw`text-sm poppins`, { color: textColor }]}>{title}</Text>
          <Text style={[tw`text-sm poppins`, { color: descriptionColor }]}>{description}</Text>
        </View>
        <View>
          <Text style={[tw`text-xl font-bold poppins`, { color: priceColor }]}>
            {price}
            <Text style={[tw`text-base poppins`, { color: priceUnitColor }]}>/{unit}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface RideOptionsRowProps {
  options: RideOption[];
  selectedRide: string;
  onSelectRide: (id: string) => void;
}

const RideOptionsRow: React.FC<RideOptionsRowProps> = ({ options, selectedRide, onSelectRide }) => {
  return (
    <View style={tw`flex-row justify-between w-full gap-3`}>
      {options.map((option) => (
        <RideOptionCard
          key={option.id}
          {...option}
          selected={selectedRide === option.id}
          onPress={() => onSelectRide(option.id)}
          containerStyle={tw`flex-1`}
        />
      ))}
    </View>
  );
};




export { RideOptionCard, RideOptionsRow };
