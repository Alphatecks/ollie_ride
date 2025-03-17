import { rideOptions } from "@/constants/Data";
import { Timestamp } from "firebase/firestore";


export function generateAccessCode(): number {
    const min = 10000; // Smallest 5-digit number
    const max = 99999; // Largest 5-digit number
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


 export const formatDate = (timestamp: Date, is12HourFormat = true) => {
    const date = new Date(timestamp);
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  
    if (is12HourFormat) {
      options.hour12 = true;
    }
  
    return date.toLocaleString('en-US', options);
  };

  interface TripParams {
    distance: string; // e.g., "2.1 km"
    selectedRide: string; // e.g., "economy", "van", "premium"
  }


  export const calculateTripFare = (distance: string, selectedRide: string): number => {
    // Extract numeric value from "2.1 km"
    const tripDistanceKm = parseFloat(distance);
  
    // Find the selected ride option
    const selectedRideOption = rideOptions.find(option => option.id === selectedRide);
  
    if (!selectedRideOption) {
      throw new Error("Invalid ride selection");
    }
  
    // Convert price from string to number
    const pricePerKm = parseFloat(selectedRideOption.price);
  
    // Calculate total trip fare
    return tripDistanceKm * pricePerKm;
  };