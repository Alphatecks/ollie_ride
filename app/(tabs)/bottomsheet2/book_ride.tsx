import { View, Text } from 'react-native'
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

          <View style={tw`border border-[0.5px] px-3 py-1 rounded-md`}>
            <ExpandableSection
              expanded={isExpanded}
              sectionHeader={
              <View style={tw`flex-row justify-between border-gray-400 my-2 py-1 ${isExpanded ? "border-b-[0.5px] " : ""}`} >
                <Text style={tw`poppinsMedium`}>What if I can Cancel a ride?</Text>
                {
                  isExpanded ? 
                  <MaterialIcons name="expand-less" size={24} color="gray" />
                  :
                  <MaterialIcons name="expand-more" size={24} color="gray" />
                }
              </View>
              }
              onPress={() => setIsExpanded(!isExpanded)}
              >
                <Text style={tw`poppins`}>Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</Text>
            </ExpandableSection>
          </View>


          <Accordion
            title="Apply Promo code"
            icon={<FontAwesome5 name="percentage" size={20} color="#002D62" />}
          >
          <TextInput
            style={tw`border border-gray-400 rounded-lg p-3 text-base`}
            placeholder="Enter promo code"
          />
      </Accordion>


    </View>
  )
}

export default BookRide