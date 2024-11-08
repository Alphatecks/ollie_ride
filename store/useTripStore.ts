import { create } from 'zustand';
import { Trip } from '@/types';

interface TripState {
  trip: Trip | null;
  setTrip: (newTrip: Trip) => void;
  updateTripStatus: (status: string, driverId: string) => void;
}

const useTripStore = create<TripState>((set) => ({
  trip: null,

  setTrip: (newTrip) => set({ trip: newTrip }),

  // Update only the trip's status and driverId
  updateTripStatus: (status, driverId) =>
    set((state) => ({
      trip: state.trip ? { ...state.trip, status, driverId } : null,
    })),
}));

export default useTripStore;
