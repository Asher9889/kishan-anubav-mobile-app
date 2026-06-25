import { create } from "zustand";

import type { AuthUser } from "../types/user";

// refresh token not in zustand, It wiped on every refresh.
type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (payload: {
    user: AuthUser;
    accessToken: string;
  }) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  setBootstrapping: (value: boolean) => void;
  setAccessToken: (token: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  accessToken: null,

  isAuthenticated: false,

  isBootstrapping: true,

  login: ({ user, accessToken }) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
    }),

  setUser: (user) =>
    set({
      user,
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),

  setBootstrapping: (value) =>
    set({ isBootstrapping: value }),

  setAccessToken: (token) =>
    set({ accessToken: token}),
}));