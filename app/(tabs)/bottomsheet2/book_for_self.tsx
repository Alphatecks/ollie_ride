import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Button, RadioButton, RadioGroup } from 'react-native-ui-lib'
import tw from '../../tailwind'
import UserSVG from "../../assets/profile-blue.svg"
import ContactSVG from "../../assets/contacts.svg"
import { baseColor } from '../../constants/Colors'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Trip, TripParams, TripStatus, UserProfile } from '../../types'
import { addDoc, collection, doc, getDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '../../firebaseConfig'
import { calculateTripFare, generateAccessCode } from '../../utils/utils'
import { rideOptions } from '../../constants/Data'
import Toast from 'react-native-toast-message'
import ButtonLoader from '../../components/general/ButtonLoader'

const Index = () => {
    const [currentContact, setCurrentContact] = useState<"self" | "others">("self")

    const navigation = useNavigation()
    const route = useRoute()
    const params = route.params

    const currentUser = auth.currentUser


    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState<boolean>(false)
  
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

    const handleConfirm = async () => {


        console.log("PARAMS: ", params)

        const tripFare = calculateTripFare(params.distance, params.selectedRide)
    


        const newTrip: Trip = {
            createdAt: Timestamp.now(),
            driverId: null, // No driver assigned initially
            fromLocation: params.fromLocation as string,
            latitude: params.riderLatitude as number,
            longitude: params.riderLongitude as number,
            riderId: currentUser?.uid as string,
            riderName: currentUser?.displayName,
            status: TripStatus.TRIP_AVAILABLE, // Initially available for drivers
            toLocation: params.toLocation as string,
            tripAmount: tripFare,
            riderPhoneNumber:  userProfile?.phoneNumber,
            riderProfileImage: userProfile?.profileImage,
            tripAccessCode: generateAccessCode(),
            bookingFor: currentContact,
            ...params
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
                    <View style={tw`flex-row gap-2 items-center justify-center`}>
                        <Avatar label={"TI"} backgroundColor={baseColor} labelColor='white' size={28} />                
                        <Text style={tw`poppinsMedium`}>John Nweke</Text>
                        <View style={tw`w-[1] h-[1] bg-ollie-base rounded-full`}></View>
                        <Text style={tw`poppinsMedium text-gray-500`}>0802945900</Text>
                    </View>
                
                </View>
            </RadioGroup>

            <View style={tw`flex-row gap-2 my-4 items-center ml-12`}>
                <ContactSVG />
                <Text style={tw`poppinsMedium`}>Choose other contacts</Text>
            </View>
        </View>
        {loading ? <ButtonLoader />:
            <Button style={tw`btn mt-10`} label="Confirm" onPress = {handleConfirm} />
        
        }
     
    </View>
  )
}

export default Index