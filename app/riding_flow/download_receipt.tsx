import React, {useEffect, useState} from 'react'
import { ScrollView, View } from 'react-native'
import Text from "react-native-ui-lib/text"
import tw from "../../../tailwind"

import { Button, TextField } from 'react-native-ui-lib';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Car from "../../../assets/car.svg"
import NotificationCardBase from '../../components/notification/NotificationCardBase';
import { auth, db } from '../../firebaseConfig';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { Trip } from '../../types';

const DownloadReceipt = () => {

    const navigation = useNavigation()
    const route = useRoute()
    const params = route.params

    const [trip, setTrip] = useState<Trip>(null)

    console.log(params)

    const currentUser = auth.currentUser

    useEffect(()=>{
        const fetchTripDetails = async() => {
            const selectedTripRef = doc(db, "trips", params.id)
            const trip = await getDoc(selectedTripRef)
            if (trip.exists()){
                console.log("Trip data: ", trip.data())
                setTrip(trip.data())
            }
        }

        fetchTripDetails()
    }, [])

	return (
        <SafeAreaView style={tw`bg-white p-3 flex-1 justify-between`}>
       
            <ScrollView>

                <View style={tw`items-center`}>
                    <Car />
                    <Text poppinsMedium center h2 style={tw`text-ollie-base`} >Congratulations!!!</Text>
                    {/* <Text poppins center style={tw`my-2`} >Download your receipt below</Text> */}
                </View>
                
                <View style={tw`border border-[0.2] border-gray-300 rounded-md p-3`}>
                    <NotificationCardBase name={currentUser?.displayName} imageUrl={''} 
                    phoneNumber={'0909343234'}                 
                    />
                    <View style={tw`flex-row justify-evenly my-3 items-center`}>
                        <View style={tw`gap-2 border-r p-2 pr-3 border-gray-300`}>
                            <Text poppins style={tw`text-xs`}>Earnings</Text>
                            <Text poppinsMedium>N{trip?.tripAmount}</Text>
                        </View>
                        <View style={tw`gap-2 border-r p-2 pr-3 border-gray-300 items-center`}>
                            <Text poppins style={tw`text-sm`}>Ride Time</Text>
                            <Text poppinsMedium>2 hours 40secs</Text>
                        </View>
                        <View style={tw`gap-2 p-2 items-center`}>
                            <Text poppins style={tw`text-sm`}>Distance</Text>
                            <Text poppinsMedium>2.5km</Text>
                        </View>
                    </View>
                    <View style={tw`h-[0.2] bg-gray-300 my-3`}></View>

                    <View style={tw`flex-row items-center gap-2 my-2`}>
                        <View style={tw`h-3 w-3 bg-gray-400 rounded-full`}></View>
                        <View style={tw`h-[1] border-t border-dashed flex-1 mt-1`}></View>
                        <View style={tw`h-3 w-3 bg-ollie-base rounded-full`}></View>
                    </View>
                    <View style={tw`flex-row justify-evenly my-3`}>
                        <Text poppins style={tw`text-gray-400 flex-1`}>{trip?.fromLocation}</Text>
                        <Text poppins style={tw`text-gray-400 flex-1 text-right`}>{trip?.toLocation}</Text>
                    </View>

                    <View style={tw`gap-2 my-2`}>
                        <View style={tw`flex-row justify-between`}>
                            <Text poppins>Time started</Text>
                            <Text poppinsMedium>12:40am</Text>
                        </View>
                        <View style={tw`flex-row justify-between`}>
                            <Text poppins>Time completed</Text>
                            <Text poppinsMedium>12:40am</Text>
                        </View>
                        <View style={tw`flex-row justify-between`}>
                            <Text poppins>Ride ID</Text>
                            <Text poppinsMedium>823u89238923</Text>
                        </View>
                        <View style={tw`flex-row justify-between`}>
                            <Text poppins>Rating</Text>
                            <Text poppinsMedium>{trip?.rating}</Text>
                        </View>
                    </View>
                    <View style={tw`items-center`}>
                        <AntDesign name="barcode" size={50} color="black" />
                    </View>
                    <Text center poppins style={tw`text-blue-600 underline p-2`}>Download Reciept</Text>
                </View>
            </ScrollView>

			<Button label="Back To Home" poppins style={tw`btn`} />
             
        </SafeAreaView>
	)
}

export default DownloadReceipt