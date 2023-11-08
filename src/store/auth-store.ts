/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSession } from '@/types/user-session';

type AuthStore = {
  session: UserSession | undefined;
  setSession: (session: UserSession) => void;
  deleteSession: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: undefined,
      setSession: (session) => set({ session }),
      deleteSession: () => set({ session: undefined }),
    }),
    { name: 'auth-store' }
  )
);
