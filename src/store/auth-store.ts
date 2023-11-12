/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSession } from '@/types/user-session';

type AuthStore = {
  session: UserSession | undefined;
  token: string | undefined;
  setSession: (session: UserSession) => void;
  deleteSession: () => void;
  setToken: (token: string) => void;
  deleteToken: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: undefined,
      token: undefined,
      setSession: (session) => set({ session }),
      deleteSession: () => set({ session: undefined }),
      setToken: (token) => set({ token }),
      deleteToken: () => set({ token: undefined }),
    }),
    { name: 'auth-store' }
  )
);
