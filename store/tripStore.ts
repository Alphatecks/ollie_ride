import { create } from "zustand";
import { Trip } from "@/types";

interface TripStore {
  selectedTrip: Trip | null;
  setSelectedTrip: (trip: Trip | null) => void;
}

export const useTripStore = create<TripStore>((set) => ({
  selectedTrip: null,
  setSelectedTrip: (trip) => set({ selectedTrip: trip }),
}));
