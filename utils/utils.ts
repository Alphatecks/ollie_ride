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