import { create } from 'zustand';
import { Trip } from '@/types';

interface TripState {
  trip: Trip | null; // State for trip, which can be null initially
  setTrip: (newTrip: Trip) => void; // Action to update trip
}

const useTripStore = create<TripState>((set) => ({
  trip: null,

  setTrip: (newTrip: Trip) => set({ trip: newTrip }),
}));

export default useTripStore;
