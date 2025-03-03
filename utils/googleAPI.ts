import { Trip, TripStatus } from '@/types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebaseConfig';


const apiKey = 'AIzaSyCwiyu1HxfDQFf5A9U4g_m4YLI21EzVuLg';
// Function to fetch nearby places based on user's current location

export const getNearbyPlaces = async (latitude: number, longitude: number, radius: number = 1000, placeType) => {

  const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  const params = {
    location: `${latitude},${longitude}`,
    radius: radius,
    key: apiKey,
  };

  // Add place type parameter if provided
  if (placeType) {
    params.type = placeType;
  }

  // console.log(`URL: ${baseUrl}?location=${latitude},${longitude}&radius=${radius}&key=${apiKey}${placeType ? `&type=${placeType}` : ''}`); // For debugging

  try {
    const response = await axios.get(baseUrl, { params });
    const places = response.data.results;

    // Format the data to match your ridersData structure
    const formattedPlaces: Trip[] = places.map((place: Trip, index: number) => ({
      id: `trip-${index + 1}`,
      createdAt: new Date(), // Mock timestamp
      updatedAt: new Date(), // Mock timestamp
      driverId: null,
      fromLocation: place.name,
      toLocation: place.vicinity,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      riderId: `d6ARfL8EWYWldIvSHD7e9Ia5L4u2`,
      riderName: `Sixtus Anyanwu`,
      status: TripStatus.TRIP_AVAILABLE, // Example status
      tripAmount: Math.floor(Math.random() * 5000) + 500, // Random amount between 500 and 5000
      riderPhoneNumber: place.formatted_phone_number || '09010998765',
      riderCurrentLocation: null,
      tripAccessCode: Math.floor(1000 + Math.random() * 9000), // Random 4-digit code
      tripStartedTime: null,
      tripEndedTime: null,
      isTripEnroute: false,
      isTripPaid: false,
      paidWithCash: null, // Random boolean
      isPaymentVerified: false,
      showAccessCode: false,
      rating: null, // Random rating between 1 and 5
    }));
    

    
    console.log("List of all places: ", formattedPlaces.splice(0, 3));

    return formattedPlaces;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
};



const CACHE_EXPIRATION = 10 * 60 * 1000; // 10 minutes

export const getNearbyPlaces2 = async (
  latitude: number,
  longitude: number,
  radius: number = 1000,
  placeType?: string
) => {
  // await AsyncStorage.clear();

  const cacheKey = `places:${latitude},${longitude},${radius},${placeType || 'all'}`;

  try {
    // Check AsyncStorage for cached data
    const cachedData = await AsyncStorage.getItem(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (Date.now() - parsedData.timestamp < CACHE_EXPIRATION) {
        console.log('Returning cached data from AsyncStorage');
        // ---------- UNCOMMENT THE BELOW TO PUSH DATA TO THE FIRESTORE -----------
        // ------- THIS SHOULD BE DONE ONLY ONCE PLS TO AVOID USELESS DATA IN DB
        // Push cached data to Firestore
        // for (const trip of parsedData.data) {
        //   await addDoc(collection(db, 'trips'), { ...trip, timestamp: Date.now() });
        // }

        // ---------- UNCOMMENT THE BELOW TO PUSH DATA TO THE FIRESTORE -----------

        console.log("Pushed data to firebase.")

        return parsedData.data;
      }
    }

    const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const params = {
      location: `${latitude},${longitude}`,
      radius: radius,
      key: apiKey,
    };

    if (placeType) params.type = placeType;

    const response = await axios.get(baseUrl, { params });
    const places = response.data.results;

    const formattedPlaces: Trip[] = places.map((place, index: number) => ({
      id: `trip-${index + 1}`,
      createdAt: new Date(), // Mock timestamp
      updatedAt: new Date(), // Mock timestamp
      driverId: null,
      fromLocation: place.name,
      toLocation: place.vicinity,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      riderId: `d6ARfL8EWYWldIvSHD7e9Ia5L4u2`,
      riderName: `Sixtus Anyanwu`,
      status: 'pending', // Example status
      tripAmount: Math.floor(Math.random() * 5000) + 500, // Random amount between 500 and 5000
      riderPhoneNumber: place.formatted_phone_number || '09010998765',
      riderCurrentLocation: null,
      tripAccessCode: null, // Random 4-digit code
      tripStartedTime: null,
      tripEndedTime: null,
      isTripEnroute: false,
      isTripPaid: false,
      paidWithCash: null, // Random boolean
      isPaymentVerified: false,
      showAccessCode: false,
      rating: null, // Random rating between 1 and 5
    }));

    // Store result in AsyncStorage
    await AsyncStorage.setItem(
      cacheKey,
      JSON.stringify({ data: formattedPlaces, timestamp: Date.now() })
    );

    console.log('Fetched new data from API and cached in AsyncStorage');
    return formattedPlaces;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
};
