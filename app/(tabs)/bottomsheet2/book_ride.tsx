import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-ui-lib'
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import tw from '../../../tailwind'
import RideSelectionCard from '../../../components/bottomsheet-ui/RideSelectionCard';
import { RideOptionsRow } from '../../../components/bottomsheet-ui/RideOptionCard';
import BookingOption from '../../../components/bottomsheet-ui/BookingOption';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CalendarSVG from "../../../assets/calendar.svg"
import ContactSVG from "../../../assets/contacts.svg"
import { ExpandableSection } from 'react-native-ui-lib';
import Accordion from '../../../components/bottomsheet-ui/Accordion';
import { TextInput } from 'react-native-gesture-handler';
// Removed BottomSheet inputs: this screen is not inside a Gorhom BottomSheet
import DoubleLocationCard from '../../../components/home/DoubleLocationCard';
import TimePicker from '../../../components/bottomsheet-ui/TimePicker';
import { RepeatOptionGroup } from '../../../components/bottomsheet-ui/RepeatPicker';
import { RepeatOptions, rideOptions } from '../../../constants/Data';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Avatar, Button as UILibButton, RadioButton, RadioGroup } from 'react-native-ui-lib'
import { auth, db } from '../../../firebaseConfig'
import { Trip, TripStatus, UserProfile } from '../../../types'
import { addDoc, collection, doc, getDoc, Timestamp } from 'firebase/firestore'
import Toast from 'react-native-toast-message'
import { calculateTripFare, generateAccessCode } from '../../../utils/utils'
import ContactPickerModal from '../../../components/general/ContactPickerModal';
import { ContactOption, fetchDeviceContacts, requestContactsPermission } from '../../../utils/contactPicker';

const BookRide = () => {

    const [selectedRide, setSelectedRide] = useState('economy');
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const [selected, setSelected] = useState("Every Tuesday");
    const [bookFor, setBookFor] = useState<"self" | "others">("self")
    const [isFetchingProfile, setIsFetchingProfile] = useState<boolean>(false)
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [selectedContact, setSelectedContact] = useState<ContactOption | null>(null);
    const [contactOptions, setContactOptions] = useState<ContactOption[]>([]);
    const [isContactModalVisible, setIsContactModalVisible] = useState(false);
    const [isLoadingContacts, setIsLoadingContacts] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const sheetSnapPoints = useMemo(() => ['45%'], []);
    const navigation = useNavigation()
    const route = useRoute()
    // Unwrap nested params structure
    const params = route.params?.params || route.params

    console.log("selected: ", selectedRide, selected, params)

    useEffect(() => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const fetchUserData = async () => {
        try {
          setIsFetchingProfile(true)
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            setUserProfile({ id: userDocRef.id, ...(userSnap.data() as UserProfile) });
          }
        } catch (e) {
          Toast.show({ type: 'error', text1: 'Failed to load profile' });
        } finally {
          setIsFetchingProfile(false)
        }
      }
      fetchUserData();
    }, [])

    const [selectedTime, setSelectedTime] = useState({
      hour: '03',
      minute: '30',
      period: 'PM'
    });

    const handleBookingSelection = () => {
      bottomSheetRef.current?.snapToIndex(0)
    };

    const getContactInitials = useCallback(() => {
      const name = selectedContact?.name || '';
      if (!name) {
        return 'CT';
      }
      const initials = name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
      return initials || 'CT';
    }, [selectedContact]);

    const handleChooseContact = useCallback(async () => {
      try {
        setIsLoadingContacts(true);
        const hasPermission = await requestContactsPermission();
        if (!hasPermission) {
          Toast.show({
            type: 'error',
            text1: 'Permission denied',
            text2: 'Enable contacts access in settings to select a contact.'
          });
          return;
        }

        const contacts = await fetchDeviceContacts();
        const limitedContacts = contacts.slice(0, 200);
        setContactOptions(limitedContacts);
        if (limitedContacts.length === 0) {
          Toast.show({
            type: 'info',
            text1: 'No contacts found',
            text2: 'Add contacts with phone numbers to continue.'
          });
        }
        setIsContactModalVisible(true);
      } catch (error) {
        console.error('Error loading contacts:', error);
        Toast.show({
          type: 'error',
          text1: 'Unable to load contacts',
          text2: 'Please try again.'
        });
      } finally {
        setIsLoadingContacts(false);
      }
    }, []);

    const handleContactSelect = useCallback((contact: ContactOption) => {
      setSelectedContact(contact);
      setBookFor('others');
      setIsContactModalVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Contact selected',
        text2: contact.name
      });
    }, []);

    const handleConfirmCreateTrip = async () => {
      if (!params) return;
      try {
        setConfirmLoading(true)
        const currentUser = auth.currentUser;
        const tripFare = calculateTripFare(params.distance, selectedRide)

        if (bookFor === 'others' && !selectedContact) {
          Toast.show({
            type: 'error',
            text1: 'Select a contact',
            text2: 'Choose a contact before confirming.'
          });
          setConfirmLoading(false);
          return;
        }

        const riderName = bookFor === 'others'
          ? (selectedContact?.name || '')
          : currentUser?.displayName || userProfile?.full_name || '';

        const riderPhoneNumber = bookFor === 'others'
          ? (selectedContact?.phoneNumber || '')
          : userProfile?.phoneNumber || '';

        if (!riderName || !riderPhoneNumber) {
          Toast.show({
            type: 'error',
            text1: 'Missing contact details',
            text2: 'We need a name and phone number to proceed.'
          });
          setConfirmLoading(false);
          return;
        }

        const newTrip: Trip = {
          ...params,
          createdAt: Timestamp.now(),
          driverId: null,
          riderId: currentUser?.uid as string,
          riderName,
          status: TripStatus.TRIP_AVAILABLE,
          tripAmount: tripFare,
          riderPhoneNumber,
          riderProfileImage: userProfile?.profileImage,
          tripAccessCode: generateAccessCode(),
          bookingFor: bookFor,
          selectedRide,
          matchingStatus: 'PENDING',
          // Ensure latitude/longitude fields exist for server matching
          latitude: params.riderLatitude,
          longitude: params.riderLongitude,
          otherContactName: bookFor === 'others' ? selectedContact?.name : undefined,
          otherContactPhoneNumber: bookFor === 'others' ? selectedContact?.phoneNumber : undefined,
          bookedByName: userProfile?.full_name || currentUser?.displayName || '',
          bookedByPhoneNumber: userProfile?.phoneNumber || '',
        };

        const docRef = await addDoc(collection(db, 'trips'), newTrip)
        Toast.show({ type: 'success', text1: 'Trip created successfully!!' })
        bottomSheetRef.current?.close()
        navigation.navigate('SearchingDriver', { ...params, tripId: docRef.id })
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Error creating trip' })
      } finally {
        setConfirmLoading(false)
      }
    }

  return (
    <View style={tw`flex-1 px-4`}>
      <Text style={tw`text-lg poppins text-center my-4`}>Book Ride</Text>

      <DoubleLocationCard
        fromLocation={params?.fromLocation}
        toLocation={params?.toLocation}
        locationDistance={params?.distance}
      />

      <View style={tw`mt-2`}>
        <RideOptionsRow
          options={rideOptions}
          selectedRide={selectedRide}
          onSelectRide={setSelectedRide}
        />
      </View>

      <BookingOption
        title="Book for self"
        icon={<MaterialCommunityIcons name="account" size={24} color="#002D62" />}
        onPress={handleBookingSelection}
      />
      <BookingOption
        title="Schedule for later"
        icon={<CalendarSVG />}
        onPress={() => console.log('Schedule for later')}
      />

      <Accordion
        title="Apply Promo code"
        icon={<FontAwesome5 name="percentage" size={20} color="#002D62" />}
      >
        <TextInput
          placeholder="Enter text"
          style={tw`border border-gray-300 p-2 rounded-md`}
        />
      </Accordion>

      <Button
        style={tw`btn mt-6 w-5/6 self-center`}
        label="Book a ride"
        onPress={handleBookingSelection}
      />

      {/* Book for self bottom sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={sheetSnapPoints}
        enablePanDownToClose
      >
        <BottomSheetView style={tw`px-4 py-4`}>
          <Text style={tw`poppinsMedium text-center text-lg`}>Book for self</Text>
          <RadioGroup initialValue={bookFor} onValueChange={setBookFor} style={tw`mt-4`}>
            <View style={tw`flex-row gap-6 items-center`}>
              <RadioButton value={'self'} color={'#002D62'} />
              <View style={tw`flex-row gap-2 items-center`}>
                <Avatar label={'ME'} backgroundColor={'#002D62'} labelColor={'white'} size={28} />
                <Text style={tw`poppinsMedium`}>Self</Text>
              </View>
            </View>
            <View style={tw`flex-row gap-6 items-center mt-4`}>
              <RadioButton value={'others'} color={'#002D62'} />
              <View style={tw`flex-row gap-3 items-center flex-1`}>
                <Avatar label={getContactInitials()} backgroundColor={'#002D62'} labelColor={'white'} size={28} />
                <View style={tw`flex-1`}>
                  <Text style={tw`poppinsMedium`}>
                    {selectedContact?.name || 'No contact selected'}
                  </Text>
                  <Text style={tw`poppinsMedium text-gray-500`}>
                    {selectedContact?.phoneNumber || 'Tap below to choose'}
                  </Text>
                </View>
              </View>
            </View>
          </RadioGroup>

          <TouchableOpacity
            style={tw`flex-row gap-3 items-center mt-4`}
            onPress={handleChooseContact}
            disabled={isLoadingContacts}
            accessibilityLabel="Choose another contact from device"
          >
            <ContactSVG />
            <Text style={tw`poppinsMedium text-blue-900`}>
              {isLoadingContacts ? 'Loading contacts…' : 'Choose other contacts'}
            </Text>
          </TouchableOpacity>

          <UILibButton
            style={tw`btn mt-6`}
            label={confirmLoading ? 'Processing...' : 'Confirm'}
            disabled={confirmLoading || isFetchingProfile}
            onPress={handleConfirmCreateTrip}
          />
        </BottomSheetView>
      </BottomSheet>

      <ContactPickerModal
        visible={isContactModalVisible}
        loading={isLoadingContacts}
        contacts={contactOptions}
        onSelect={handleContactSelect}
        onClose={() => setIsContactModalVisible(false)}
        onRetry={handleChooseContact}
      />
    </View>
  )
}

export default BookRide