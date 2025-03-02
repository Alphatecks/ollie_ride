// types.ts

import { Timestamp as FirebaseTimestamp } from 'firebase/firestore';


export interface Timestamp {
    seconds: number;
    nanoseconds: number;
  }
  
  export interface Trip {
    createdAt: Timestamp;
    driverId: string | null;
    fromLocation: string;
    id: string;
    latitude: number;
    longitude: number;
    riderId: string;
    riderName: string;
    status: string;
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