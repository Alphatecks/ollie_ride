import { create } from "zustand";
import { Trip } from "../types";

interface TripStore {
  selectedTrip: Trip | null;
  tripAccessCode: number | null;
  setSelectedTrip: (trip: Trip | null) => void;
  setTripAccessCode: (tripAccessCode: number) => void;
}

export const useTripStore = create<TripStore>((set) => ({
  tripAccessCode: null,
  selectedTrip: null,
  setSelectedTrip: (trip) => set({ selectedTrip: trip }),
  setTripAccessCode: (tripAccessCode) => set({ tripAccessCode: tripAccessCode }),
}));
