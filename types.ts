// types.ts
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
    isPaymentVerified?: boolean
  }
  