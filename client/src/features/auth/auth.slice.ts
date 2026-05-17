import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../../types/auth";

type User = AuthUser | null;

type AuthState = {
  user: User;
  isAuthenticated: boolean;
  isAuthReady: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAuthReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    setAuthReady(state) {
      state.isAuthReady = true;
    },
  },
});

export const { setUser, clearUser, setAuthReady } = authSlice.actions;
export default authSlice.reducer;
