// firebaseTripUtils.ts
import { 
  collection, 
  addDoc,
  setDoc, 
  doc, 
  updateDoc, 
  getDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';  // Ensure this is your Firebase config file

// Utility to create a trip (called by rider)
export const createTrip = async (
  riderId: string, 
  fromLocation: string, 
  toLocation: string, 
  tripAmount: number,
  latitude: number,
  longitude: number,
  riderName: string,
) => {
  const tripData = {
    riderId,
    driverId: null,  // No driver assigned yet
    status: 'TRIP_AVAILABLE',
    fromLocation,
    toLocation,
    tripAmount,
    latitude,
    longitude,
    riderName,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const docRef = await addDoc(collection(db, 'trips'), tripData);
    console.log('Trip created with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding trip: ', error);
    throw error;
  }
};

// Utility for driver to accept a trip
export const acceptTrip = async (tripId: string, driverId: string) => {
  const tripRef = doc(db, 'trips', tripId);

  // Check if the trip is still pending before accepting
  const tripSnap = await getDoc(tripRef);
  if (tripSnap.exists() && tripSnap.data().status === 'pending') {
    await updateDoc(tripRef, {
      driverId: driverId,
      status: 'accepted',
      updatedAt: new Date(),
    });
    console.log('Trip accepted by driver: ', driverId);

    // Update driver status to busy
    await updateDriverAvailability(driverId, false, tripId);
  } else {
    console.error('Trip is no longer available');
    throw new Error('Trip is no longer available');
  }
};

// Utility to cancel a trip (can be called by driver or rider)
export const cancelTrip = async (tripId: string, driverId: string) => {
  const tripRef = doc(db, 'trips', tripId);

  await updateDoc(tripRef, {
    status: 'TRIP_CANCELED',
    updatedAt: new Date(),
    driver: null,
  });
  console.log('Trip canceled');

  // Update driver status to available if they cancel
  await updateDriverAvailability(driverId, true, null);
};

// Utility to update driver's availability status
export const updateDriverAvailability = async (
  driverId: string, 
  isAvailable: boolean, 
  currentTripId: string | null
) => {
  const driverRef = doc(db, 'drivers', driverId);
  
  await updateDoc(driverRef, {
    isAvailable,
    currentTripId,
  });
  console.log(`Driver ${driverId} availability updated: Available - ${isAvailable}`);
};

// Utility to listen for real-time updates on trip status
export const listenToTripUpdates = (tripId: string, callback: (tripData: any) => void) => {
  const tripRef = doc(db, 'trips', tripId);

  const unsubscribe = onSnapshot(tripRef, (docSnap) => {
    if (docSnap.exists()) {
      const tripData = docSnap.data();
      console.log('Trip status updated: ', tripData.status);
      callback(tripData);  // Pass trip data to the provided callback function
    } else {
      console.log('No such trip!');
    }
  });

  return unsubscribe;  // Return unsubscribe function to stop listening
};


// Utility to fetch all available trips without a driver
export const fetchAvailableTrips = async () => {
  const tripsCollection = collection(db, 'trips');
  
  // Query to get trips where driverId is null and status is 'available'
  const tripsQuery = query(
    tripsCollection, 
    where('driverId', '==', null),
  );

  try {
    const querySnapshot = await getDocs(tripsQuery);
    const availableTrips = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('Available trips fetched:', availableTrips);
    return availableTrips;
  } catch (error) {
    console.error('Error fetching available trips:', error);
    throw error;
  }
};

