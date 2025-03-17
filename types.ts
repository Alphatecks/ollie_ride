// types.ts

import { Timestamp as FirebaseTimestamp } from 'firebase/firestore';
import { ViewStyle } from 'react-native';


export interface RideOption {
  id: string;
  title: string;
  description: string;
  price: string;
  unit: string;
  duration: string;
  selected?: boolean;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  selectedColor?: string;
  unselectedColor?: string;
  borderColor?: string;
  textColor?: string;
  descriptionColor?: string;
  priceColor?: string;
  priceUnitColor?: string;
  iconColor?: string;
}

export interface Timestamp {
    seconds: number;
    nanoseconds: number;
  }

export enum TripStatus {
  TRIP_ACCEPTED = "TRIP_ACCEPTED",
  TRIP_STARTED = "TRIP_STARTED",
  TRIP_ENROUTE = "TRIP_ENROUTE",
  TRIP_COMPLETED = "TRIP_COMPLETED",
  TRIP_AVAILABLE = "TRIP_AVAILABLE",
}

export interface Trip {
    tripId: string;
    createdAt: Timestamp;
    driverId: string | null;
    fromLocation: string;
    id: string;
    latitude: number;
    longitude: number;
    riderId: string;
    riderName: string;
    status: TripStatus;
    toLocation: string;
    tripAmount: number;
    updatedAt: Timestamp;
    riderPhoneNumber: string;
    riderCurrentLocation: string;
    riderProfileImage?: string;
    riderLongitude: number;
    riderLatitude: number;
    driverLongitude: number;
    driverLatitude: number;
    tripAccessCode: number;
    tripStartedTime?: Date;
    tripEndedTime?: Date | null;
    isTripEnroute?: boolean;
    isTripPaid?: boolean;
    paidWithCash?: boolean;
    isPaymentVerified?: boolean;
    showAccessCode?: boolean;
    rating?: number;
    isCanceled?: boolean;
    bookingFor: "self" | "others";
    driverProfileImage: string;
    driverDisplayName: string;
  }
  

  export interface UserProfile {
    id: string;
    city: string;
    full_name: string;
    gender: string;
    isApproved: boolean;
    phoneNumber: string;
    profileImage: string;
    role: string;
    state: string;
    street: string;
    totalBalance: number;
    totalDistanceCovered: number;
    totalTimeOnline: number;
    totalTimeSpentOnTrip: number;
    totalTrips: number;
    updatedAt: string; // Consider changing to `Date` if parsed
  }

  export interface TripParams {
    distance: string; // e.g., "1 m"
    distanceValue: number; // e.g., "0" (consider changing to number if it's always numeric)
    duration: string; // e.g., "1 min"
    durationValue: number; // e.g., "0" (consider changing to number if it's always numeric)
    fromLocation: string;
    riderLatitude: number; // Consider changing to number if it's always numeric
    riderLongitude: number; // Consider changing to number if it's always numeric
    selectedRide: string; // e.g., "economy", "van", etc.
    toLocation: string;
    bookingFor: "self" | "others";
  }
  

  export interface DriverData {
    acceptanceRate: number;
    cancellationRate: number;
    firstName: string;
    isApproved: boolean;
    lastName: string;
    phoneNumber: string;
    role: string;
    todayEarnings: number;
    totalBalance: number;
    totalDistanceCovered: number;
    totalTimeOnline: number;
    totalTimeSpentOnTrip: number;
    totalTips: number;
    totalTrips: number;
  }

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: FirebaseTimestamp;
}

export interface Chat {
  id: string; // tripId
  tripId: string;
  driverId: string;
  riderId: string;
  createdAt: FirebaseTimestamp;
}


export interface Place {
  id: number;
  latitude: number;
  longitude: number;
  fromLocation: string;
  toLocation: string;
  fullName: string;
  phoneNumber: string;
  time: string;
}


export interface LocationData {
  coords: {
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: number;
    latitude: number;
    longitude: number;
    speed: number;
  };
  mocked: boolean;
  timestamp: number;
}
