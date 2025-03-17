import { create } from "zustand";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Adjust the path based on your structure

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

// Listen for Firebase auth state changes
export const initAuthListener = () => {
  onAuthStateChanged(auth, (user) => {
    const { setUser, setLoading } = useAuthStore.getState();
    setUser(user);
    setLoading(false);
  });
};
