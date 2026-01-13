// src/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('authToken') || null,
  user: localStorage.getItem('authUser')
    ? JSON.parse(localStorage.getItem('authUser')!)
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('authUser', JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.token = null;
      state.user = null;

      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
