import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Avatar, Button, RadioButton, RadioGroup } from 'react-native-ui-lib'
import tw from '../../../tailwind'
import UserSVG from "../../../assets/profile-blue.svg"
import ContactSVG from "../../../assets/contacts.svg"
import { baseColor } from '../../../constants/Colors'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Trip, TripParams, TripStatus, UserProfile } from '../../../types'
import { addDoc, collection, doc, getDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '../../../firebaseConfig'
import { calculateTripFare, generateAccessCode } from '../../../utils/utils'
import { rideOptions } from '../../../constants/Data'
import Toast from 'react-native-toast-message'
import ButtonLoader from '../../../components/general/ButtonLoader'
import ContactPickerModal from '../../../components/general/ContactPickerModal'
import { ContactOption, fetchDeviceContacts, requestContactsPermission } from '../../../utils/contactPicker'

const Index = () => {
    const [currentContact, setCurrentContact] = useState<"self" | "others">("self")

    const navigation = useNavigation()
    const route = useRoute()
    const params = route.params

    const currentUser = auth.currentUser


    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [selectedContact, setSelectedContact] = useState<ContactOption | null>(null);
    const [isContactModalVisible, setIsContactModalVisible] = useState(false);
    const [contactOptions, setContactOptions] = useState<ContactOption[]>([]);
    const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  
    useEffect(() => {

        if(!params){
            return;
        }

        const fetchUserData = async () => {
        
        if (currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid);

            try{
                setIsFetching(true)
                const userSnap = await getDoc(userDocRef);
    
                if (userSnap.exists()) {
                    setUserProfile({ id: userDocRef.id, ...userSnap.data() as UserProfile });
    
                    console.log(userProfile?.phoneNumber)
                    setIsFetching(false)
                }

            }catch(e){
                Toast.show({
                  type: "error",
                  text1: "Error occured fetching from server."
                });
                setIsFetching(false)
            }

            
        }
        setIsFetching(false);
        };

        fetchUserData();
    }, []);

    const handleChooseContact = useCallback(async () => {
        try {
            setIsLoadingContacts(true);
            const hasPermission = await requestContactsPermission();
            if (!hasPermission) {
                Toast.show({
                    type: "error",
                    text1: "Permission denied",
                    text2: "Please allow contact access from settings to select a contact."
                });
                return;
            }

            const contacts = await fetchDeviceContacts();
            const limitedContacts = contacts.slice(0, 200);
            setContactOptions(limitedContacts);
            if (limitedContacts.length === 0) {
                Toast.show({
                    type: "info",
                    text1: "No contacts found",
                    text2: "Add contacts with phone numbers to your device and try again."
                });
            }
            setIsContactModalVisible(true);
        } catch (error) {
            console.error("Error loading contacts:", error);
            Toast.show({
                type: "error",
                text1: "Unable to load contacts",
                text2: "Please try again."
            });
        } finally {
            setIsLoadingContacts(false);
        }
    }, []);

    const handleContactSelect = useCallback((contact: ContactOption) => {
        setSelectedContact(contact);
        setCurrentContact("others");
        setIsContactModalVisible(false);
        Toast.show({
            type: "success",
            text1: "Contact selected",
            text2: `${contact.name}`
        });
    }, []);

    const getContactInitials = useCallback(() => {
        const name = selectedContact?.name || '';
        if (!name) {
            return "CT";
        }
        const initials = name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("");
        return initials || "CT";
    }, [selectedContact]);

    const handleConfirm = async () => {


        console.log("PARAMS: ", params)

        const rideCategory =
            typeof params?.selectedRide === 'string' && params.selectedRide
                ? params.selectedRide
                : 'economy';

        const tripFare = calculateTripFare(params.distance, params.selectedRide ?? rideCategory)
    
        if (currentContact === "others" && !selectedContact) {
            Toast.show({
                type: "error",
                text1: "Select a contact",
                text2: "Choose a contact before confirming the ride."
            });
            return;
        }

        const riderName = currentContact === "others"
            ? (selectedContact?.name || '')
            : currentUser?.displayName || userProfile?.full_name || '';

        const riderPhoneNumber = currentContact === "others"
            ? (selectedContact?.phoneNumber || '')
            : userProfile?.phoneNumber || '';

        if (!riderName || !riderPhoneNumber) {
            Toast.show({
                type: "error",
                text1: "Missing contact details",
                text2: "We need a name and phone number to proceed."
            });
            return;
        }


        const newTrip: Trip = {
            ...params,
            createdAt: Timestamp.now(),
            driverId: null, // No driver assigned initially
            riderId: currentUser?.uid as string,
            riderName,
            status: TripStatus.TRIP_AVAILABLE, // Initially available for drivers
            tripAmount: tripFare,
            riderPhoneNumber,
            riderProfileImage: userProfile?.profileImage,
            tripAccessCode: generateAccessCode(),
            bookingFor: currentContact,
            selectedRide: rideCategory,
            matchingStatus: 'PENDING',
            otherContactName: currentContact === "others" ? selectedContact?.name : undefined,
            otherContactPhoneNumber: currentContact === "others" ? selectedContact?.phoneNumber : undefined,
            bookedByName: userProfile?.full_name || currentUser?.displayName || '',
            bookedByPhoneNumber: userProfile?.phoneNumber || '',
        };

    
        try {
            setLoading(true)
            const docRef = await addDoc(collection(db, "trips"), newTrip);
            console.log("Trip created with ID:", docRef.id);
            Toast.show({
              type: "success",
              text1: "Trip created successfully!!"
            });
            setLoading(false)

            navigation.navigate('SearchingDriver', { ...params, tripId: docRef.id });

        } catch (error) {
            console.error("Error creating trip:", error);
            Toast.show({
              type: "error",
              text1: "Error creating trip"
            });
            setLoading(false)
        }

    };

    if(isFetching){
        return (
            <View style={tw`bg-white flex-1 justify-center items-center`}>
            <ActivityIndicator size={40} color={"green"} />
          </View>
        )
    }
    if(!params){
        return (
            <View style={tw`bg-white flex-1 justify-center items-center`}>
                <Text> There is no params for this screen.</Text>
              </View>
        )
    }
    
  return (
    <View style={tw`flex-1`}>
        <View>
            <View style={tw`mb-4`}>
                <Text style={tw`poppinsMedium text-center text-lg`}>Someone else taking this ride?</Text>
                <Text style={tw`poppins text-center`}>Choose a contact so that they also get driver number, 
                    vehicle details and ride access code via SMS
                </Text>

            </View>

            <RadioGroup initialValue={currentContact} onValueChange={setCurrentContact}>
                <View style={tw`flex-row gap-6`}>
                    <RadioButton value={'self'} color={baseColor}  />
                    <View style={tw`flex-row gap-2 items-center justify-center`}>
                        <UserSVG />
                        <Text style={tw`poppinsMedium`}>Self</Text>
                    </View>
                </View>

                <View style={tw`flex-row gap-6 mt-4`}>
                    <RadioButton value={'others'} color={baseColor} />
                    <View style={tw`flex-row gap-3 items-center justify-center flex-1`}>
                        <Avatar
                            label={getContactInitials()}
                            backgroundColor={baseColor}
                            labelColor='white'
                            size={28}
                        />
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
                style={tw`flex-row gap-3 my-4 items-center ml-12`}
                onPress={handleChooseContact}
                disabled={isLoadingContacts}
                accessibilityLabel="Choose another contact from device"
            >
                <ContactSVG />
                <Text style={tw`poppinsMedium text-blue-900`}>
                    {isLoadingContacts ? 'Loading contacts…' : 'Choose other contacts'}
                </Text>
                {isLoadingContacts && <ActivityIndicator size="small" color={baseColor} />}
            </TouchableOpacity>
        </View>
        {loading ? <ButtonLoader />:
            <Button style={tw`btn mt-10`} label="Confirm" onPress = {handleConfirm} />
        
        }

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

export default Index