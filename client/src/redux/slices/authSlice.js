import { createSlice } from "@reduxjs/toolkit";

// Access token is kept in-memory only (Redux) to avoid XSS exposure.
// On app load, we call /api/auth/refresh to get a new access token via the httpOnly refresh cookie.
const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  setUser,
  setLoading,
  setError,
  clearCredentials,
} = authSlice.actions;
export default authSlice.reducer;
