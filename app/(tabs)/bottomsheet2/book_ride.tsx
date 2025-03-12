import { View, Text, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import tw from '@/tailwind'
import RideSelectionCard from '@/components/bottomsheet-ui/RideSelectionCard';
import { RideOptionsRow } from '@/components/bottomsheet-ui/RideOptionCard';
import BookingOption from '@/components/bottomsheet-ui/BookingOption';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import CalendarSVG from "@/assets/calendar.svg"
import { ExpandableSection } from 'react-native-ui-lib';
import Accordion from '@/components/bottomsheet-ui/Accordion';
import { TextInput } from 'react-native-gesture-handler';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

const BookRide = () => {

    const [selectedRide, setSelectedRide] = useState('economy');
    const [isExpanded, setIsExpanded] = useState<boolean>(false)

    const rideOptions = [
        {
          id: 'economy',
          title: 'Economy',
          description: '3 seats capacity',
          price: '$1',
          unit: 'km',
          duration: '5 min',
          icon: 'file'
        },
        {
          id: 'comfort',
          title: 'Comfort',
          description: '4 seats capacity',
          price: '$1.5',
          unit: 'km',
          duration: '7 min',
          icon: 'briefcase'
        }
      ];

      console.log("selected: ", selectedRide)

  return (
    <View>
      <Text style={tw`text-lg poppins text-center`}>Book Ride</Text>

        <RideOptionsRow 
          options={rideOptions} 
          selectedRide={selectedRide} 
          onSelectRide={setSelectedRide} 
        />

        <BookingOption
        title="Book for self"
        icon={<MaterialCommunityIcons name="account" size={24} color="#002D62" />}
        onPress={() => console.log("Book for self")}
        />
        <BookingOption
        title="Schedule for later"
        icon={<CalendarSVG />}
        onPress={() => console.log("Book for self")}
        />

          <Accordion
            title="Apply Promo code"
            icon={<FontAwesome5 name="percentage" size={20} color="#002D62" />}
          >
            <BottomSheetTextInput 
              placeholder="Enter text" 
              style={tw`border border-gray-300 p-2 rounded-md`} 
            />
          </Accordion>

    </View>

  )
}

export default BookRide