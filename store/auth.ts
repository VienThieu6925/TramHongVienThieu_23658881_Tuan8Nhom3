//Bai1
// import { create } from 'zustand';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export type User = { id: string; email: string; name?: string };

// type AuthState = {
//   token: string | null;
//   user: User | null;
//   hydrated: boolean;
//   setAuth: (token: string, user: User) => Promise<void>;
//   logout: () => Promise<void>;
//   hydrate: () => Promise<void>;
// };

// const TOKEN_KEY = 'auth_token';
// const USER_KEY = 'auth_user';

// export const useAuth = create<AuthState>((set) => ({
//   token: null,
//   user: null,
//   hydrated: false,

//   setAuth: async (token, user) => {
//     await AsyncStorage.multiSet([
//       [TOKEN_KEY, token],
//       [USER_KEY, JSON.stringify(user)],
//     ]);
//     set({ token, user });
//   },

//   logout: async () => {
//     await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
//     set({ token: null, user: null });
//   },

//   hydrate: async () => {
//     const [[, token], [, user]] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
//     set({ token, user: user ? JSON.parse(user) : null, hydrated: true });
//   },
// }));

//Bai2

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTokenValid } from '@/utils/token';

export type User = { id: string; email: string; name?: string };

type AuthState = {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  setAuth: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const useAuth = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,

  setAuth: async (token, user) => {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_KEY, JSON.stringify(user)],
    ]);
    set({ token, user });
  },

  logout: async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    set({ token: null, user: null });
  },

  hydrate: async () => {
    try {
      const [[, token], [, user]] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
      if (token && user && isTokenValid(token)) {
        set({ token, user: JSON.parse(user), hydrated: true });
      } else {
        await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
        set({ token: null, user: null, hydrated: true });
      }
    } catch {
      set({ token: null, user: null, hydrated: true });
    }
  },
}));