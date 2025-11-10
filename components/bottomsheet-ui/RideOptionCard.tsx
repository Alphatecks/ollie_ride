import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle, FlatList } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from "../../tailwind";
// FlatList already imported above


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
    // Keep the card box size stable by constraining the icon container height
    // and rendering a larger icon absolutely within it.
    const IconWrap: React.FC<{ name: string }> = ({ name }) => (
      <View style={{ height: 28, width: 40, alignItems: 'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons name={name as any} size={36} color={iconColor} style={{ position: 'absolute' }} />
      </View>
    );
    switch (id) {
      case 'economy':
        return <IconWrap name="car-hatchback" />;
      case 'premium':
        return <IconWrap name="car-limousine" />;
      case 'van':
        return <IconWrap name="van-passenger" />;
      default:
        return <IconWrap name="car" />;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`p-2 rounded-xl border`,
        selected ? { borderColor: borderColor, borderWidth: 2 } : { borderColor: '#E5E7EB', borderWidth: 1 },
        { backgroundColor: unselectedColor },
        tw``,
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
        <Text style={[tw`text-sm font-medium`, { color: textColor, marginBottom: 6 }]}>{duration}</Text>
      </View>
      <View style={tw`h-px bg-gray-200 my-2`} />
      <View style={tw`flex-row justify-between gap-10 items-center`}>
        <View>
          <Text style={[tw`text-sm poppins`, { color: textColor }]}>{title}</Text>
          <Text style={[tw`text-xs poppins`, { color: descriptionColor }]}>{description}</Text>
        </View>
        <View>
          <Text style={[tw`text-lg poppinsMedium`, { color: priceColor }]}>
            ₦{price}
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
    <FlatList
      data={options}
      horizontal
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled
      scrollEnabled
      scrollEventThrottle={16}
      initialNumToRender={3}
      windowSize={5}
      overScrollMode="always"
      contentContainerStyle={tw`p-2`}
      ItemSeparatorComponent={() => <View style={tw`w-4`} />}
      renderItem={({ item }) => (
        <RideOptionCard
          {...item}
          selected={selectedRide === item.id}
          onPress={() => onSelectRide(item.id)}
          containerStyle={tw`flex-1`}
        />
      )}
    />
  );
};
// const RideOptionsRow: React.FC<RideOptionsRowProps> = ({ options, selectedRide, onSelectRide }) => {
//   return (
//     <View style={tw`flex-row justify-between w-full gap-3`}>
//       {options.map((option) => (
//         <RideOptionCard
//           key={option.id}
//           {...option}
//           selected={selectedRide === option.id}
//           onPress={() => onSelectRide(option.id)}
//           containerStyle={tw`flex-1`}
//         />
//       ))}
//     </View>
//   );
// };




export { RideOptionCard, RideOptionsRow };

// Vertical list for ride options
interface RideOptionsListProps {
  options: RideOption[];
  selectedRide: string;
  onSelectRide: (id: string) => void;
}

const RideOptionsList: React.FC<RideOptionsListProps> = ({ options, selectedRide, onSelectRide }) => {
  return (
    <FlatList
      data={options}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      scrollEventThrottle={16}
      initialNumToRender={6}
      windowSize={10}
      contentContainerStyle={tw`px-4 pb-12`}
      ItemSeparatorComponent={() => <View style={tw`h-3`} />}
      renderItem={({ item }) => (
        <RideOptionCard
          {...item}
          selected={selectedRide === item.id}
          onPress={() => onSelectRide(item.id)}
        />
      )}
    />
  );
};

export { RideOptionsList };