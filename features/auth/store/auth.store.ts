import { create } from "zustand";

type User = { 
    id: string;
    phone: string;
};
// refresh token not in zustand, It wiped on every refresh.
type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (payload: {
    user: User;
    accessToken: string;
  }) => void;
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