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
    tripAccessCode: number;
    tripStartedTime?: Date;
    tripEndedTime?: Date | null;
    isTripEnroute?: boolean;
    isTripPaid?: boolean;
    paidWithCash?: boolean;
    isPaymentVerified?: boolean;
    showAccessCode?: boolean;
    rating?: number;
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