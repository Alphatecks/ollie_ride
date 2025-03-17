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
import { RepeatOptionGroup } from '@/components/bottomsheet-ui/RepeatPicker';
import { RepeatOptions, rideOptions } from '@/constants/Data';
import { useLocalSearchParams, useRouter } from 'expo-router';

const BookRide = () => {

    const [selectedRide, setSelectedRide] = useState('economy');
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const [selected, setSelected] = useState("Every Tuesday");
    const params = useLocalSearchParams()

    const router = useRouter()

    console.log("selected: ", selectedRide, selected, params)

    const [selectedTime, setSelectedTime] = useState({
      hour: '03',
      minute: '30',
      period: 'PM'
    });

    const handleBookingSelection = () => {
      // Push down the data to the next screen route
      router.push({
        pathname: "/(tabs)/bottomsheet2/book_for_self",
        params: { selectedRide, ...params }
      });
    };

  return (
    <View>
      <Text style={tw`text-lg poppins text-center my-4`}>Book Ride</Text>
        {/* <TimePicker
            initialHour="03"
            initialMinute="30"
            initialPeriod="PM"
            onTimeChange={handleTimeChange}
          />   */}


        <DoubleLocationCard fromLocation={params?.fromLocation} toLocation={params?.toLocation} 
          locationDistance={params?.distance}          
        />

        <RideOptionsRow 
          options={rideOptions} 
          selectedRide={selectedRide} 
          onSelectRide={setSelectedRide} 
        />

        <BookingOption
        title="Book for self"
        icon={<MaterialCommunityIcons name="account" size={24} color="#002D62" />}
        onPress={handleBookingSelection}
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