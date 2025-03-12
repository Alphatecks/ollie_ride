import { View, Text, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import tw from '@/tailwind'
import RideSelectionCard from '@/components/bottomsheet-ui/RideSelectionCard';
import { RideOptionsRow } from '@/components/bottomsheet-ui/RideOptionCard';
import BookingOption from '@/components/bottomsheet-ui/BookingOption';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import CalendarSVG from "@/assets/calendar.svg"
import { ExpandableSection } from 'react-native-ui-lib';
import Accordion from '@/components/bottomsheet-ui/Accordion';
import { TextInput } from 'react-native-gesture-handler';
import { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import DoubleLocationCard from '@/components/home/DoubleLocationCard';
import TimePicker from '@/components/bottomsheet-ui/TimePicker';

const BookRide = () => {

    const [selectedRide, setSelectedRide] = useState('economy');
    const [isExpanded, setIsExpanded] = useState<boolean>(false)

    const rideOptions = [
        {
          id: 'economy',
          title: 'Economy',
          description: '3 seats capacity',
          price: '1000',
          unit: 'km',
          duration: '5 min',
          icon: 'file'
        },
        {
          id: 'comfort',
          title: 'Comfort',
          description: '4 seats capacity',
          price: '1000.5',
          unit: 'km',
          duration: '7 min',
          icon: 'briefcase'
        },
        {
          id: 'premium',
          title: 'Premium',
          description: '4 seats capacity',
          price: '1000.5',
          unit: 'km',
          duration: '7 min',
          icon: 'briefcase'
        }
      ];

      console.log("selected: ", selectedRide)

      const [selectedTime, setSelectedTime] = useState({
        hour: '03',
        minute: '30',
        period: 'PM'
      });
    
      const handleTimeChange = (time) => {
        setSelectedTime(time);
        console.log('Selected time:', time);
      };

  return (
    <View>
      <Text style={tw`text-lg poppins text-center my-4`}>Book Ride</Text>
        <TimePicker
            initialHour="03"
            initialMinute="30"
            initialPeriod="PM"
            onTimeChange={handleTimeChange}
          />  
                  
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