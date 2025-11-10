// app/trip_available.tsx

import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Text from 'react-native-ui-lib/text';
import tw from "../../../tailwind";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';
import { useTripStore } from "../../../store/tripStore";
import Toast from "react-native-toast-message";
import { useEffect, useState, useRef, useCallback } from "react";
import Geolocation, { GeoPosition } from '@react-native-community/geolocation';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { googleSearch, googleDistanceMatrix, reverseGeocode } from "../../../utils/useSearch"
import { LocationData } from "../../../types";
import { auth, db } from "../../../firebaseConfig";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import AddressSelectionSheet from "../../../components/bottomsheet-ui/AddressSelectionSheet";
import { RecentPlace } from "../../../constants/Data";


const url = "https://firebasestorage.googleapis.com/v0/b/ollie-ride-7abb8.appspot.com/o/man.jpg?alt=media&token=de524b5c-ef1b-482b-ad53-1b0cc0c6decd";

const Index = () => {
  
  const navigation = useNavigation();

  const { selectedTrip, setSelectedTrip } = useTripStore();
  const [locationDistance, setLocationDistance] = useState<any>({})
  const [location, setLocation] = useState<LocationData>(null);
  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState(''); 
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const [isFromTyping, setIsFromTyping] = useState(false);
  const [isToTyping, setIsToTyping] = useState(false);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [frequentPlaces, setFrequentPlaces] = useState<RecentPlace[]>([]);
  type ViewStage = 'edit' | 'confirm' | 'book';
  const [viewStage, setViewStage] = useState<ViewStage>('edit');
  const [isLocating, setIsLocating] = useState(false);

  const currentUser = auth.currentUser;
  const mapRef = useRef<MapView | null>(null);

  const animateToRegion = useCallback((latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, []);

  const handleLocationSuccess = useCallback(
    async (
      position: GeoPosition,
      { approximate = false, overwriteAddress = true }: { approximate?: boolean; overwriteAddress?: boolean } = {}
    ) => {
      setLocation(position);

      const { latitude, longitude } = position.coords;
      animateToRegion(latitude, longitude);

      if (overwriteAddress) {
        try {
          const addressResult = await reverseGeocode(latitude, longitude);
          if (addressResult.data) {
            setFromText(addressResult.data);
            console.log("User address:", addressResult.data);
          } else if (addressResult.error) {
            console.error("Error getting address:", addressResult.error);
          }
        } catch (error) {
          console.error("Unexpected error during reverse geocoding:", error);
        }
      }

      if (approximate) {
        Toast.show({
          type: "info",
          text1: "Location acquired",
          text2: "Using approximate location"
        });
      }
    },
    [animateToRegion]
  );

  const fetchCurrentLocation = useCallback(
    (overwriteAddress = true) => {
      setIsLocating(true);
      Geolocation.getCurrentPosition(
        async (position: GeoPosition) => {
          try {
            await handleLocationSuccess(position, { overwriteAddress });
          } catch (error) {
            console.error('Error handling location success:', error);
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error('Error getting location (high accuracy):', error);
          Geolocation.getCurrentPosition(
            async (position: GeoPosition) => {
              try {
                await handleLocationSuccess(position, { approximate: true, overwriteAddress });
              } catch (locationError) {
                console.error('Error handling approximate location:', locationError);
              } finally {
                setIsLocating(false);
              }
            },
            (fallbackError) => {
              console.error('Error getting location (fallback):', fallbackError);
              Toast.show({
                type: "error",
                text1: "Location Error",
                text2: "Please check your GPS settings and try again"
              });
              setIsLocating(false);
            },
            { 
              enableHighAccuracy: false, 
              timeout: 10000, 
              maximumAge: 300000
            }
          );
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 60000 
        }
      );
    },
    [handleLocationSuccess]
  );

  useEffect(() => {
    fetchCurrentLocation();

    if (!currentUser) return; // Ensure user is authenticated

    const fetchTrips = async () => {
      try {
        const tripsRef = collection(db, "trips");
        const q = query(tripsRef, where("riderId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        const trips = querySnapshot.docs.map((doc) => ({
          tripId: doc.id,
          ...doc.data(),
        }));

        // Check if user has any trips before accessing
        if (trips.length > 0) {
        console.log("Trips for current user:", trips[0].tripId);
          setSelectedTrip(trips[0]);

          // Compute frequent destinations by toLocation occurrence
          const toLocationCount = new Map<string, number>();
          trips.forEach((t: any) => {
            const key = t.toLocation?.trim();
            if (key) {
              toLocationCount.set(key, (toLocationCount.get(key) || 0) + 1);
            }
          });
          const sorted = Array.from(toLocationCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([address], idx) => ({
              id: `freq-${idx}`,
              name: address.split(',')[0] || address,
              address,
              distance: '',
            }));
          setFrequentPlaces(sorted);
        } else {
          console.log("No trips found for current user");
          setSelectedTrip(null);
          setFrequentPlaces([]);
        }

      } catch (error) {
        console.error("Error fetching trips:", error);
        Toast.show({
          type: "error",
          text1: "Error fetching trip."
        });
      }
    };

    fetchTrips();
  }, [currentUser, fetchCurrentLocation]);


  useEffect(() => {
    const getFromAndToDistance = async () => {
      if (!isFromTyping && !isToTyping && fromText.trim() && toText.trim()) {
        const timer = setTimeout(async () => {
          console.log("User has finished typing:", { fromText, toText });
          setIsCalculatingDistance(true);
          
          const res = await googleDistanceMatrix(fromText, toText);
  
          console.log("Total distance: ", res.data);
          setLocationDistance(res.data);
          setIsCalculatingDistance(false);
  
        }, 800); // Reduced from 2000ms to 800ms for faster response
    
        return () => clearTimeout(timer);
      }
    }
    getFromAndToDistance()

  }, [isFromTyping, isToTyping, fromText, toText]);

  

  const onClose = () => {

    navigation.navigate('BookRide')
    
  }

  const handleFromTextChange = async (text: string) => {
    setIsFromTyping(true);
    setFromText(text);
    const suggestions = await googleSearch(text);
    setFromSuggestions(suggestions?.data || []);
  };
  
  const handleToTextChange = async (text: string) => {
    setIsToTyping(true);
    setToText(text);
    const suggestions = await googleSearch(text);
    setToSuggestions(suggestions?.data || []);
  };
  

const handleSuggestionClick = (suggestion) => {
// Set the selected suggestion as the new text value
  setFromText(suggestion);
  // Clear the suggestions list
  setFromSuggestions([]);
};

const handleSuggestionClickTo = (suggestion) => {
  // Set the selected suggestion as the new text value
  setToText(suggestion);
  // Clear the suggestions list
  setToSuggestions([]);
};

const handlePress = async () => {
  // Check if location is available
  if (!location || !location.coords) {
    Toast.show({
      type: "error",
      text1: "Location not available",
      text2: "Please enable location services and try again"
    });
    return;
  }

  // Open the bottom sheet
  setShowAddressSheet(true);
}

const handlePlaceSelect = (place: RecentPlace, field: 'from' | 'to') => {
  if (field === 'from') {
    setFromText(place.address);
  } else {
    setToText(place.address);
    // Close sheet and navigate to booking flow if both addresses are set
      if (fromText) {
        setViewStage('confirm');
      }
  }
}

  const handleRequestConfirmView = () => {
    if (fromText?.trim() && toText?.trim()) {
      setViewStage('confirm');
    }
  };

  const handleConfirmLocation = () => {
    // Close the sheet and navigate to full-page BookRide
    setShowAddressSheet(false);
    navigation.navigate('BookRide', {
      params: {
        fromLocation: fromText,
        toLocation: toText,
        distance: locationDistance?.distance || '',
        riderLatitude: location?.coords?.latitude,
        riderLongitude: location?.coords?.longitude,
      }
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Map Background */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location?.coords?.latitude || 4.8156,
          longitude: location?.coords?.longitude || 7.0498,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={false}
        loadingEnabled={true}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        showsCompass={true}
        showsScale={true}
      >
        {/* Custom Marker at User Location */}
        {location?.coords && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description={fromText || "Current location"}
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerDot} />
              <View style={styles.markerPulse} />
        </View> 
          </Marker>
        )}
      </MapView>

      {/* Locate Me Button */}
      <TouchableOpacity
        style={[styles.locateButton, isLocating && styles.locateButtonDisabled]}
        onPress={() => fetchCurrentLocation()}
        activeOpacity={0.85}
        disabled={isLocating}
        accessibilityLabel="Center map on current location"
      >
        {isLocating ? (
          <ActivityIndicator size="small" color="#1E3A8A" />
        ) : (
          <Ionicons name="locate" size={24} color="#1E3A8A" />
        )}
      </TouchableOpacity>

      {/* Notification Bell Icon - Top Right */}
      <TouchableOpacity 
        style={styles.notificationButton}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Ionicons name="notifications-outline" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      {/* Floating UI Elements at Bottom */}
      <View style={styles.bottomContainer}>
        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={handlePress}
        >
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>

        {/* Ride Schedules Button */}
        <TouchableOpacity 
          style={styles.rideSchedulesButton}
          onPress={() => console.log('Ride schedules pressed')}
        >
          <MaterialIcons name="schedule" size={24} color="#1E3A8A" style={styles.scheduleIcon} />
          <Text style={styles.rideSchedulesText}>Ride schedules</Text>
        </TouchableOpacity>
      </View>

      {/* Address Selection Bottom Sheet */}
      <AddressSelectionSheet
        isVisible={showAddressSheet}
        onClose={() => setShowAddressSheet(false)}
        fromLocation={fromText}
        toLocation={toText}
        onFromChange={handleFromTextChange}
        onToChange={handleToTextChange}
        recentPlaces={frequentPlaces}
        onPlaceSelect={handlePlaceSelect}
        fromSuggestions={fromSuggestions}
        toSuggestions={toSuggestions}
        onFromSuggestionSelect={handleSuggestionClick}
        onToSuggestionSelect={handleSuggestionClickTo}
        isConfirmView={viewStage === 'confirm'}
        isBookingView={viewStage === 'book'}
        onRequestConfirmView={handleRequestConfirmView}
        onConfirmLocation={handleConfirmLocation}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  notificationButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locateButton: {
    position: 'absolute',
    right: 20,
    bottom: 260,
    backgroundColor: 'white',
    borderRadius: 22,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locateButtonDisabled: {
    opacity: 0.6,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontFamily: 'Poppins-Regular',
  },
  rideSchedulesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleIcon: {
    marginRight: 12,
  },
  rideSchedulesText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1E3A8A',
    borderWidth: 3,
    borderColor: 'white',
    zIndex: 2,
  },
  markerPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E3A8A',
    opacity: 0.2,
    zIndex: 1,
  },
});

export default Index;